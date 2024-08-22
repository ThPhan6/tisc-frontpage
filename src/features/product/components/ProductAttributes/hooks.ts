import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { QUERY_KEY } from '@/constants/util';

import { getSelectedProductSpecification, useSelectProductSpecification } from '../../services';
import { useGetDimensionWeight } from './../../../dimension-weight/hook';
import { useBoolean, useCheckPermission, useGetQueryFromOriginURL } from '@/helper/hook';
import { cloneDeep, countBy, isEmpty, uniqueId } from 'lodash';

import {
  getAllPreSelectAttributes,
  productSpecificationSelector,
  setCurAttrGroupCollapse,
  setDefaultSelectionFromSpecifiedData,
  setPartialProductDetail,
  setPartialProductSpecifiedData,
  setStep,
} from '../../reducers';
import { ProductAttributeFormInput, ProductAttributeProps, SpecificationType } from '../../types';
import {
  AutoStepPreSelectOnAttributeGroupResponse,
  OptionQuantityProps,
} from '../../types/autoStep';
import { AttributeGroupKey, ProductInfoTab } from './types';
import { setReferToDesignDocument } from '@/features/product/reducers';
import {
  SelectedSpecAttributte,
  SpecificationAttributeGroup,
  SpecificationPreSelectStep,
} from '@/features/project/types';
import { useAppSelector } from '@/reducers';

import { getNewDataAfterReordering } from '@/components/Drag';

export const getStepSelected = (steps?: AutoStepPreSelectOnAttributeGroupResponse[]) => {
  if (!steps?.length) {
    return [];
  }

  const stepPayload: SpecificationPreSelectStep[] = steps
    .filter((el) => el.options.length !== 0)
    .map((el) => ({
      step_id: el.id as string,
      options: el.options
        .filter((opt) => opt.quantity > 0)
        .map((opt) => ({
          id: opt.id,
          /* option selected in 1st step(origin) has default quantity is 1 */
          quantity: el.order === 1 ? 1 : opt.quantity,
          pre_option: opt.pre_option,
        })),
    }))
    .filter((el) => el.options.length !== 0);

  return stepPayload;
};

const getSelectedAttributeAndOption = (attrs: ProductAttributeProps[]) => {
  const selectedAttributes: SelectedSpecAttributte[] = [];

  attrs.forEach((attr) => {
    const selectedOption = attr.basis_options?.find((opt) => opt.isChecked);
    if (selectedOption) {
      selectedAttributes.push({
        id: attr.id,
        basis_option_id: selectedOption.id,
      });
    }
  });
  return selectedAttributes;
};

export const getSpecificationRequest = (specGroup: ProductAttributeFormInput[]) => {
  const specState: SpecificationAttributeGroup[] = [];

  specGroup.forEach((gr) => {
    if (!gr.isChecked) {
      return;
    }

    if (gr.selection && gr.attribute_selected_id) {
      const haveAttributeSelected = gr.attributes.find(
        (attr) => attr.id === gr.attribute_selected_id,
      );

      if (haveAttributeSelected) {
        if (gr.id && gr.attributes?.length) {
          const attributeGroup = getSelectedAttributeAndOption([haveAttributeSelected]) ?? [];

          specState.push({
            id: gr.id,
            attributes: attributeGroup,
            id_format_type: gr.id_format_type,
          });
        }

        if (gr.id && gr.steps?.length) {
          const stepGroup =
            getStepSelected(gr.steps as unknown as AutoStepPreSelectOnAttributeGroupResponse[]) ??
            [];

          specState.push({
            id: gr.id,
            configuration_steps: stepGroup,
            step_selections: gr.stepSelection.quantities,
            /// default each attribute group has attributes property is empty array
            attributes: [],
            id_format_type: gr.id_format_type,
          });
        }
      }
    } else {
      if (gr.id && gr.attributes?.length) {
        const attributeGroup = getSelectedAttributeAndOption(gr.attributes) ?? [];

        specState.push({
          id: gr.id,
          attributes: attributeGroup,
          id_format_type: gr.id_format_type,
        });
      }

      if (gr.id && gr.steps?.length) {
        const stepGroup =
          getStepSelected(gr.steps as unknown as AutoStepPreSelectOnAttributeGroupResponse[]) ?? [];

        specState.push({
          id: gr.id || '',
          configuration_steps: stepGroup,
          step_selections: gr.stepSelection?.quantities,
          /// default each attribute group has attributes property is empty array
          attributes: [],
          id_format_type: gr.id_format_type,
        });
      }
    }
  });

  return specState;
};

export const getSpecificationWithSelectedValue = (
  specGroup: SpecificationAttributeGroup[],
  specState: ProductAttributeFormInput[],
  isSpecifiedModal?: boolean,
) => {
  const checkedSpecGroup = cloneDeep(specState);
  specGroup.forEach((gr) => {
    const selectedGroup = checkedSpecGroup.findIndex((el) => el.id === gr.id);
    if (selectedGroup === -1) {
      return;
    }
    const optionIds = gr.attributes?.map((e) => e.basis_option_id);
    if (isSpecifiedModal) {
      checkedSpecGroup[selectedGroup].isChecked =
        checkedSpecGroup[selectedGroup].type === SpecificationType.attribute ? true : gr.isChecked;
      checkedSpecGroup[selectedGroup].stepSelection = gr.step_selections;
    } else {
      checkedSpecGroup[selectedGroup].isChecked =
        checkedSpecGroup[selectedGroup].type === SpecificationType.attribute
          ? true
          : checkedSpecGroup[selectedGroup].isChecked;
    }
    checkedSpecGroup[selectedGroup].attributes = checkedSpecGroup[selectedGroup].attributes.map(
      (attr) => ({
        ...attr,
        basis_options: attr.basis_options?.map((opt) => ({
          ...opt,
          isChecked: optionIds?.includes(opt.id),
        })),
      }),
    );
  });
  return checkedSpecGroup;
};

export const checkedOptionType = (data: ProductAttributeProps[]) =>
  countBy(data, (attr) => attr.type === 'Options').true >= 2;

export const useProductAttributeForm = (
  attributeType: ProductInfoTab,
  productId: string,
  props?: {
    isSpecifiedModal?: boolean;
    isGetDimensionWeight?: boolean;
    isGetProductSpecification?: boolean;
  },
) => {
  const dispatch = useDispatch();
  const selectProductSpecification = useSelectProductSpecification();
  const {
    feature_attribute_groups,
    general_attribute_groups,
    specification_attribute_groups,
    dimension_and_weight,
    product_information,
    id,
    specifiedDetail,
  } = useAppSelector((state) => state.product.details);
  const allPreSelectAttributes = useAppSelector((state) => state.product.allPreSelectAttributes);
  const productSpecifiedData = useAppSelector(productSpecificationSelector);
  const referToDesignDocument = specifiedDetail?.specification?.is_refer_document;

  const loaded = useBoolean();
  const isTiscAdmin = useCheckPermission('TISC Admin');

  const projectProductId = useGetQueryFromOriginURL(QUERY_KEY.project_product_id);

  const { data: dwData } = useGetDimensionWeight(props?.isGetDimensionWeight);

  const [autoStepPopup, setAutoStepPopup] = useState<boolean>(false);

  const dimensionWeightData = dimension_and_weight.id ? dimension_and_weight : dwData;

  let attributeGroup =
    attributeType === 'general'
      ? general_attribute_groups
      : attributeType === 'feature'
      ? feature_attribute_groups
      : specification_attribute_groups;
  if (props?.isSpecifiedModal && attributeType === 'specification') {
    attributeGroup = attributeGroup.map((item) => {
      const found = specifiedDetail?.specification.attribute_groups.find(
        (group) => group.id === item.id,
      );
      return {
        ...item,
        isChecked: found?.isChecked,
      };
    });
  }
  const attributeGroupKey: AttributeGroupKey =
    attributeType === 'general'
      ? 'general_attribute_groups'
      : attributeType === 'feature'
      ? 'feature_attribute_groups'
      : 'specification_attribute_groups';

  useEffect(() => {
    if (
      attributeType === 'specification' &&
      loaded.value === false &&
      productId &&
      isTiscAdmin === false
    ) {
      if (props?.isSpecifiedModal) {
        dispatch(setDefaultSelectionFromSpecifiedData());
        /// get all attributes selected
        dispatch(getAllPreSelectAttributes(productSpecifiedData ?? []));
        loaded.setValue(true);
      } else if (props?.isGetProductSpecification && !isEmpty(specification_attribute_groups)) {
        getSelectedProductSpecification(productId, projectProductId).then((res) => {
          loaded.setValue(true);
          if (res) {
            const newSpecficationAttributeGroups = getSpecificationWithSelectedValue(
              res.specification?.attribute_groups || [],
              attributeGroup,
            );

            /* specification attribute group for brand user views project product specified from assistance request */
            if (projectProductId) {
              newSpecficationAttributeGroups.forEach((attrGrp, attrGrpIdx) => {
                res.specification.attribute_groups.forEach((specAttrGrp) => {
                  if (attrGrp.id === specAttrGrp.id) {
                    newSpecficationAttributeGroups[attrGrpIdx] = {
                      ...newSpecficationAttributeGroups[attrGrpIdx],
                      isChecked: true,
                      stepSelection: specAttrGrp.step_selections,
                      viewSteps: specAttrGrp.viewSteps,
                    };

                    return;
                  }

                  newSpecficationAttributeGroups[attrGrpIdx] = {
                    ...newSpecficationAttributeGroups[attrGrpIdx],
                    isChecked:
                      newSpecficationAttributeGroups[attrGrpIdx].type ===
                        SpecificationType.autoStep &&
                      newSpecficationAttributeGroups[attrGrpIdx].isChecked
                        ? false
                        : newSpecficationAttributeGroups[attrGrpIdx].isChecked,
                    stepSelection: {},
                    viewSteps: [],
                  };
                });
              });
            }

            dispatch(
              setPartialProductDetail({
                specification_attribute_groups: newSpecficationAttributeGroups,
                // set vendor locations have selected from user selection
                brand_location_id: res.brand_location_id,
                distributor_location_id: res.distributor_location_id,
              }),
            );

            const newAllPreSelectAttributes = getSpecificationRequest(
              newSpecficationAttributeGroups.filter(
                (el) => el.type === SpecificationType.attribute,
              ),
            );

            dispatch(getAllPreSelectAttributes(newAllPreSelectAttributes));
          }
        });
      }
    }
  }, [props?.isSpecifiedModal, attributeType, specification_attribute_groups, loaded.value]);

  const onDragEnd = (result: any) => {
    const newAttributesGroups = getNewDataAfterReordering(
      result,
      attributeGroup,
    ) as ProductAttributeFormInput[];

    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newAttributesGroups,
      }),
    );
  };

  const onDeleteProductAttribute = (index: number) => () => {
    const newProductAttribute = attributeGroup.filter((_item, key) => index !== key);
    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newProductAttribute,
      }),
    );
    dispatch(setCurAttrGroupCollapse({ [attributeGroupKey]: '' }));
  };

  const onChangeAttributeItem = (index: number) => (data: ProductAttributeProps[]) => {
    const newProductAttribute = [...attributeGroup];
    newProductAttribute[index] = {
      ...newProductAttribute[index],
      attributes: data,
    };
    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newProductAttribute,
      }),
    );
  };

  const addNewProductAttribute = () => {
    /// type of id must be string to handle dragging
    const randomId = uniqueId('new-');

    dispatch(setCurAttrGroupCollapse({ [attributeGroupKey]: randomId }));

    if (attributeGroupKey === 'specification_attribute_groups') {
      dispatch(
        setPartialProductDetail({
          [attributeGroupKey]: [
            ...attributeGroup,
            {
              id: randomId,
              name: '',
              attributes: [],
              specification_steps: [],
              configuration_steps: [],
              steps: [],
              selection: false,
              type: SpecificationType.attribute,
            },
          ],
        }),
      );
    } else {
      dispatch(
        setPartialProductDetail({
          [attributeGroupKey]: [
            ...attributeGroup,
            {
              id: randomId,
              name: '',
              attributes: [],
            },
          ],
        }),
      );
    }
  };

  const addNewAutoStep = () => {
    const randomId = uniqueId('new-');

    /// create new attribute
    // addNewProductAttribute(randomId);

    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: [
          ...attributeGroup,
          {
            id: randomId,
            name: '',
            attributes: [],
            steps: [],
            selection: false,
            type: SpecificationType.autoStep,
          },
        ],
      }),
    );

    dispatch(setCurAttrGroupCollapse({ [attributeGroupKey]: randomId }));

    dispatch(setStep('pre'));

    setAutoStepPopup(true);
  };

  const onChangeAttributeName =
    (groupIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAttributes = [...attributeGroup];
      const newItemAttributes = { ...attributeGroup[groupIndex] };

      newItemAttributes.name = e.target.value;
      newAttributes[groupIndex] = newItemAttributes;

      dispatch(
        setPartialProductDetail({
          [attributeGroupKey]: newAttributes,
        }),
      );
    };

  const deleteAttributeItem =
    (groupIndex: number, attrIndex: number, callback?: () => void) => () => {
      const newAttributes = [...attributeGroup];
      const newItemAttributes = attributeGroup[groupIndex].attributes.filter(
        (_attr, idx) => idx !== attrIndex,
      );

      const isOptionType = checkedOptionType(newItemAttributes);

      newAttributes[groupIndex] = {
        ...newAttributes[groupIndex],
        attributes: newItemAttributes,
        selection: isOptionType,
      };

      /// reset selected
      callback?.();

      dispatch(
        setPartialProductDetail({
          [attributeGroupKey]: newAttributes,
        }),
      );
    };

  const onSelectSpecificationOption = (
    groupIndex: number,
    attributeId: string,
    optionId?: string,
    option: { resetAttributeOptionChecked?: boolean; updatePreSelect?: boolean } = {
      resetAttributeOptionChecked: true,
      updatePreSelect: true,
    },
  ) => {
    const newState = cloneDeep(attributeGroup);
    const attributeIndex = newState[groupIndex].attributes.findIndex((el) => el.id === attributeId);

    if (attributeIndex === -1) {
      return;
    }

    newState[groupIndex] = {
      ...newState[groupIndex],
      attribute_selected_id: attributeId,
    };

    newState[groupIndex].attributes = newState[groupIndex].attributes.map((attr) => {
      if (!newState[groupIndex].selection) {
        // current attribute select is equal to attribute selected
        if (attr.id === attributeId) {
          return {
            ...attr,
            basis_options: attr.basis_options?.map((el) => {
              return {
                ...el,
                isChecked: el.id === optionId,
              };
            }),
          };
        }

        return attr;
      }

      // keep prev attribute selected
      if (!option?.resetAttributeOptionChecked) {
        return attr;
      }

      return {
        ...attr,
        basis_options: attr.basis_options?.map((el) => {
          return {
            ...el,
            isChecked: el.id === optionId && attr.id === attributeId,
          };
        }),
      };
    });

    let haveCheckedOptionAttribute = newState[groupIndex].attributes.some(
      (attr) => attr.type === 'Options' && attr.basis_options?.some((opt) => opt.isChecked),
    );

    if (!optionId) {
      haveCheckedOptionAttribute = false;
    }

    newState[groupIndex].isChecked = haveCheckedOptionAttribute;

    const haveCheckedAttributeGroup = newState.some((group) => group.isChecked);

    if (isTiscAdmin) {
      return;
    }

    const newSpecificationOptionAttributeGroups = newState.filter(
      (el) => el.type === SpecificationType.attribute,
    );

    if (!props?.isSpecifiedModal) {
      const newSpecficationRequest = {
        is_refer_document: !haveCheckedAttributeGroup || false,
        attribute_groups: getSpecificationRequest(newSpecificationOptionAttributeGroups),
      };

      if (option.updatePreSelect) {
        /// update pre-select attributes
        selectProductSpecification(id, {
          specification: newSpecficationRequest,
        });
      }

      dispatch(getAllPreSelectAttributes(newSpecficationRequest.attribute_groups));
    }

    dispatch(
      setPartialProductDetail({
        specification_attribute_groups: newState,
      }),
    );

    if (props?.isSpecifiedModal) {
      const foundId = newState[groupIndex].id;
      const foundGroup = specifiedDetail?.specification.attribute_groups.find(
        (item) => item.id === foundId,
      );
      const newGroup = {
        ...newState[groupIndex],
        ...foundGroup,
        isChecked: newState[groupIndex].isChecked,
        attributes: newState[groupIndex].attributes
          .map((attribute) => {
            return {
              id: attribute.id,
              basis_option_id: attribute.basis_options?.find((bo) => bo.isChecked === true)?.id,
            };
          })
          .filter((el) => el.basis_option_id),
      };
      const newAttributeGroups = newState
        .filter((item) => item.isChecked)
        .map((item) => {
          if (item.id !== foundId) {
            const originItem = specifiedDetail?.specification.attribute_groups.find(
              (el) => el.id === item.id,
            );
            return originItem;
          }
          return newGroup;
        });

      dispatch(
        setPartialProductSpecifiedData({
          specification: {
            is_refer_document: false,
            attribute_groups: newAttributeGroups as any,
          },
        }),
      );
    }
    dispatch(setReferToDesignDocument(!haveCheckedAttributeGroup));

    return { haveCheckedOptionAttribute, haveCheckedAttributeGroup };
  };

  const onCheckedSpecification = (groupIndex: number, updatedOnchange: boolean = true) => {
    const newState = cloneDeep(attributeGroup);
    if (!newState[groupIndex].isChecked) {
      return;
    }

    const haveOptionAttr = newState[groupIndex].attributes.some((el) => el.type === 'Options');

    /// update update attribute group has configuration step
    if (newState[groupIndex].type === SpecificationType.autoStep) {
      // UNCHECK group and clear all selected option
      newState[groupIndex].isChecked = false;
      newState[groupIndex].steps = newState[groupIndex].steps?.map((el) => ({
        ...el,
        options: (el.options as OptionQuantityProps[]).map((opt) => ({
          ...opt,
          quantity: 0,
          yours: 0,
        })),
      }));

      const haveCheckedAttributeGroup = newState.some((group) => group.isChecked);

      if (updatedOnchange && !props?.isSpecifiedModal) {
        const newAllPreSelectAttributes = allPreSelectAttributes.filter(
          (el) => el.id !== newState[groupIndex].id,
        );

        const newAttributeGroups = newAllPreSelectAttributes.concat({
          id: newState[groupIndex].id as string,
          configuration_steps: [],
        });

        selectProductSpecification(id, {
          specification: {
            is_refer_document: !haveCheckedAttributeGroup || false,
            attribute_groups: newAttributeGroups,
          },
          // brand_location_id: '',
          // distributor_location_id: '',
        });
      }

      /// update attribute group has option
    } else if (haveOptionAttr) {
      // UNCHECK group and clear all selected option
      newState[groupIndex].isChecked = false;
      newState[groupIndex].attributes = newState[groupIndex].attributes.map((attr) => ({
        ...attr,
        basis_options: attr?.basis_options?.map((otp) => ({ ...otp, isChecked: false })),
      }));

      const haveCheckedAttributeGroup = newState.some((group) => group.isChecked);

      if (updatedOnchange && !props?.isSpecifiedModal) {
        const newSpecificationOptionAttributeGroups = newState.filter(
          (el) => el.type === SpecificationType.attribute,
        );

        selectProductSpecification(id, {
          specification: {
            is_refer_document: !haveCheckedAttributeGroup || false,
            attribute_groups: getSpecificationRequest(newSpecificationOptionAttributeGroups),
          },
          // brand_location_id: '',
          // distributor_location_id: '',
        });
      }
    }

    // CHECK group but only allow change for group don't have any option attribute
    // If have option attribute user have to chose option
    if (
      (newState[groupIndex].isChecked || !haveOptionAttr) &&
      newState[groupIndex].type !== SpecificationType.autoStep
    ) {
      newState[groupIndex].isChecked = !newState[groupIndex].isChecked;
    }

    dispatch(
      setPartialProductDetail({
        specification_attribute_groups: newState,
      }),
    );
    const haveCheckedAttributeGroup = newState.some((group) => group.isChecked);
    if (props?.isSpecifiedModal) {
      const foundId = newState[groupIndex].id;
      dispatch(
        setPartialProductSpecifiedData({
          specification: {
            is_refer_document: newState[groupIndex].isChecked ? false : !haveCheckedAttributeGroup,
            attribute_groups: specifiedDetail?.specification.attribute_groups?.filter(
              (item) => item.id !== foundId,
            ) as any,
          },
        }),
      );
    }

    /* update specifying of project */
    dispatch(
      setReferToDesignDocument(newState[groupIndex].isChecked ? false : !haveCheckedAttributeGroup),
    );
  };
  const onUnCheckedAllAttributeGroups = () => {
    dispatch(
      setPartialProductSpecifiedData({
        specification: {
          is_refer_document: true,
          attribute_groups: [],
        },
      }),
    );
  };

  return {
    onDeleteProductAttribute,
    onChangeAttributeItem,
    addNewProductAttribute,
    onChangeAttributeName,
    deleteAttributeItem,
    attributeGroupKey,
    attributeGroup,
    onCheckedSpecification,
    onUnCheckedAllAttributeGroups,
    onSelectSpecificationOption,
    referToDesignDocument,
    dimensionWeightData,
    productInformationData: product_information,
    onDragEnd,

    /// auto-steps
    addNewAutoStep,
    autoStepPopup,
    setAutoStepPopup,
  };
};
