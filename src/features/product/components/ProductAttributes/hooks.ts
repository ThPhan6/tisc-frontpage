import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getSelectedProductSpecification, selectProductSpecification } from '../../services';
import { useBoolean, useCheckPermission } from '@/helper/hook';
import { cloneDeep } from 'lodash';

import {
  resetProductState,
  setDefaultSelectionFromSpecifiedData,
  setPartialProductDetail,
} from '../../reducers';
import { ProductAttributeFormInput, ProductAttributeProps } from '../../types';
import { AttributeGroupKey, ProductInfoTab } from './types';
import { setReferToDesignDocument } from '@/features/product/reducers';
import { SelectedSpecAttributte, SpecificationAttributeGroup } from '@/features/project/types';
import { useAppSelector } from '@/reducers';

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
    if (gr.isChecked) {
      specState.push({
        id: gr.id || '',
        attributes: getSelectedAttributeAndOption(gr.attributes),
      });
    }
  });
  return specState;
};

export const getSpecificationWithSelectedValue = (
  specGroup: SpecificationAttributeGroup[],
  specState: ProductAttributeFormInput[],
) => {
  const checkedSpecGroup = cloneDeep(specState);
  specGroup.forEach((gr) => {
    const selectedGroup = specState.findIndex((el) => el.id === gr.id);
    if (selectedGroup === -1) {
      return;
    }
    const optionIds = gr.attributes.map((e) => e.basis_option_id);
    checkedSpecGroup[selectedGroup].isChecked = true;
    checkedSpecGroup[selectedGroup].attributes = checkedSpecGroup[selectedGroup].attributes.map(
      (attr) => ({
        ...attr,
        basis_options: attr.basis_options?.map((opt) => ({
          ...opt,
          isChecked: optionIds.includes(opt.id),
        })),
      }),
    );
  });
  return checkedSpecGroup;
};

export const useProductAttributeForm = (
  attributeType: ProductInfoTab,
  productId: string,
  isSpecifiedModal?: boolean,
) => {
  const dispatch = useDispatch();
  const { feature_attribute_groups, general_attribute_groups, specification_attribute_groups, id } =
    useAppSelector((state) => state.product.details);
  const referToDesignDocument = useAppSelector(
    (state) => state.product.details.specifiedDetail?.specification?.is_refer_document,
  );
  const loaded = useBoolean();
  const isTiscAdmin = useCheckPermission('TISC Admin');

  const attributeGroup =
    attributeType === 'general'
      ? general_attribute_groups
      : attributeType === 'feature'
      ? feature_attribute_groups
      : specification_attribute_groups;

  const attributeGroupKey: AttributeGroupKey =
    attributeType === 'general'
      ? 'general_attribute_groups'
      : attributeType === 'feature'
      ? 'feature_attribute_groups'
      : 'specification_attribute_groups';

  useEffect(() => {
    if (
      attributeType === 'specification' &&
      specification_attribute_groups.length && // Wait for all specification attributes loaded
      loaded.value === false &&
      productId &&
      isTiscAdmin === false
    ) {
      if (isSpecifiedModal) {
        dispatch(setDefaultSelectionFromSpecifiedData());
        loaded.setValue(true);
      } else {
        getSelectedProductSpecification(productId).then((res) => {
          loaded.setValue(true);
          if (res) {
            dispatch(
              setPartialProductDetail({
                specification_attribute_groups: getSpecificationWithSelectedValue(
                  res.specification.attribute_groups,
                  attributeGroup,
                ),
                brand_location_id: res.brand_location_id,
                distributor_location_id: res.distributor_location_id,
              }),
            );
          }
        });
      }
    }
  }, [isSpecifiedModal, attributeType, specification_attribute_groups, loaded.value]);

  useEffect(() => {
    return () => {
      dispatch(resetProductState());
    };
  }, []);

  const onDeleteProductAttribute = (index: number) => () => {
    const newProductAttribute = attributeGroup.filter((_item, key) => index !== key);
    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newProductAttribute,
      }),
    );
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
    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: [
          ...attributeGroup,
          {
            name: '',
            attributes: [],
          },
        ],
      }),
    );
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

      newAttributes[groupIndex] = {
        ...newAttributes[groupIndex],
        attributes: newItemAttributes,
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
    updatedOnchange: boolean = true, // disabled TISC
    optionId?: string,
  ) => {
    const newState = cloneDeep(specification_attribute_groups);
    const attributeIndex = newState[groupIndex].attributes.findIndex((el) => el.id === attributeId);

    if (attributeIndex === -1) {
      return;
    }

    newState[groupIndex].attributes[attributeIndex].basis_options = newState[groupIndex].attributes[
      attributeIndex
    ].basis_options?.map((el) => ({
      ...el,
      isChecked: el.id === optionId ? true : false,
    }));

    const haveCheckedOptionAttribute = newState[groupIndex].attributes.some(
      (attr) => attr.type === 'Options' && attr.basis_options?.some((opt) => opt.isChecked),
    );

    newState[groupIndex].isChecked = haveCheckedOptionAttribute;

    const haveCheckedAttributeGroup = newState.some((group) => group.isChecked);

    if (updatedOnchange) {
      if (!isSpecifiedModal) {
        selectProductSpecification(id, {
          specification: {
            is_refer_document: referToDesignDocument || false,
            attribute_groups: getSpecificationRequest(newState),
          },
        });
      }

      dispatch(
        setPartialProductDetail({
          specification_attribute_groups: newState,
        }),
      );

      dispatch(setReferToDesignDocument(!haveCheckedAttributeGroup));
    }
  };

  const onCheckedSpecification = (groupIndex: number, updatedOnchange: boolean = true) => {
    const newState = cloneDeep(specification_attribute_groups);
    const haveOptionAttr = newState[groupIndex].attributes.some((el) => el.type === 'Options');

    if (newState[groupIndex].isChecked && haveOptionAttr) {
      // UNCHECK group and clear all selected option
      newState[groupIndex].attributes = newState[groupIndex].attributes.map((attr) => ({
        ...attr,
        basis_options: attr?.basis_options?.map((otp) => ({ ...otp, isChecked: false })),
      }));

      if (updatedOnchange && !isSpecifiedModal) {
        selectProductSpecification(id, {
          specification: {
            is_refer_document: referToDesignDocument || false,
            attribute_groups: getSpecificationRequest(newState),
          },
          brand_location_id: '',
          distributor_location_id: '',
        });
      }
    }

    if (newState[groupIndex].isChecked || !haveOptionAttr) {
      // CHECK group but only allow change for group don't have any option attribute
      // If have option attribute user have to chose option
      newState[groupIndex].isChecked = !newState[groupIndex].isChecked;
    }

    const haveCheckedAttributeGroup = newState.some((group) => group.isChecked);

    dispatch(
      setPartialProductDetail({
        specification_attribute_groups: newState,
      }),
    );

    dispatch(
      setReferToDesignDocument(newState[groupIndex].isChecked ? false : !haveCheckedAttributeGroup),
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
    onSelectSpecificationOption,
    referToDesignDocument,
  };
};
