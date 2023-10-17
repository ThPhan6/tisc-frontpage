import React, { FC, useEffect, useState } from 'react';

import { message } from 'antd';

import { ReactComponent as ActionRightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon-18.svg';

import { getAutoStepData, getLinkedOptionByOptionIds, getPreSelectStep } from '../../services';
import { useProductAttributeForm } from './hooks';
import { useScreen } from '@/helper/common';
import { useCheckPermission, useGetParamId, useQuery } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { capitalize, map, sortBy, trimEnd, uniq } from 'lodash';

import {
  LinkedOptionDataProps,
  OptionPreSelectedProps,
  OptionSelectedProps,
  PickedOptionProps,
  setCurAttrGroupCollapse,
  setLinkedOptionData,
  setOptionsSelected,
  setPartialProductDetail,
  setPickedOption,
  setPreSelectStep,
  setSlide,
  setSlideBar,
  setStep,
  setStepData,
} from '../../reducers';
import {
  AttributeSelectedProps,
  ProductAttributeFormInput,
  ProductAttributeProps,
  SpecificationAttributeBasisOptionProps,
  SpecificationType,
} from '../../types';
import {
  AutoStepOnAttributeGroupResponse,
  AutoStepPreSelectOnAttributeGroupResponse,
  AutoStepPreSelectOptionResponse,
  LinkedOptionProps,
  OptionQuantityProps,
} from '../../types/autoStep';
import { ActiveKeyType } from './types';
import store, { useAppSelector } from '@/reducers';
import { closeDimensionWeightGroup, closeProductFooterTab } from '@/reducers/active';
import { SubBasisOption } from '@/types';

import CustomCollapse from '@/components/Collapse';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import InputGroup from '@/components/EntryForm/InputGroup';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import { AutoStep } from '../AutoStep/AutoStep';
import { PreSelectStep } from '../AutoStep/PreSelectStep';
import { getIDFromPreOption, getPickedOptionGroup } from '../AutoStep/util';
import { AttributeOption, ConversionText, GeneralText } from './CommonAttribute';
import { ProductAttributeContainerProps } from './ProductAttributeContainer';
import { ProductAttributeSubItem, getConversionText } from './ProductAttributeSubItem';
import { SelectAttributeSpecificationChoice } from './SelectAttributeSpecificationChoice';
import { SelectAttributesToGroupRow } from './SelectAttributesToGroupRow';
import styles from './index.less';

const ATTRIBUTE_SELECTED_DEFAULT_VALUE: AttributeSelectedProps = {
  groupId: '',
  attribute: {
    id: '',
    name: '',
  },
};

interface ProductAttributeGroupProps extends ProductAttributeContainerProps {
  attributeGroup: ProductAttributeFormInput[];
  attrGroupItem: ProductAttributeFormInput;
  groupIndex: number;
  curProductId: string;
  icon?: JSX.Element;
}

export const ProductAttributeGroup: FC<ProductAttributeGroupProps> = ({
  activeKey,
  attributeGroup,
  attrGroupItem,
  groupIndex,
  attributes,
  specifying,
  noBorder,
  curProductId,
  isSpecifiedModal,
  icon,
}) => {
  const isTablet = useScreen().isTablet;

  const {
    attributeGroupKey,
    onChangeAttributeItem,
    onChangeAttributeName,
    deleteAttributeItem,
    onCheckedSpecification,
    onSelectSpecificationOption,
  } = useProductAttributeForm(activeKey, curProductId, {
    isSpecifiedModal,
  });

  const user = useAppSelector((state) => state.user.user);

  const isTiscAdmin = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const isDesignerAdmin = useCheckPermission(['Design Admin', 'Design Team']);
  const isEditable = isTiscAdmin && !isTablet;

  const signature = useQuery().get('signature') ?? '';
  const isPublicPage = !!signature;

  const [curAttributeSelect, setCurAttributeSelect] = useState<AttributeSelectedProps>(
    ATTRIBUTE_SELECTED_DEFAULT_VALUE,
  );

  /// for specification choice attribute
  const [collapsible, setCollapsible] = useState<ActiveKeyType>([]);

  const [showAttributeOptionSelected, setShowAttributeOptionSelected] = useState<boolean>(true);
  const [isAttributeGroupSelected, setIsAttributeGroupSelected] = useState<boolean>(true);

  const productId = useGetParamId();

  const { curAttrGroupCollapseId, details } = useAppSelector((state) => state.product);
  const { specification_attribute_groups } = details;

  const currentSpecAttributeGroupId = curAttrGroupCollapseId?.['specification_attribute_groups'];

  const [autoStepModal, setAutoStepModal] = useState<boolean>(false);

  const autoSteps = (sortBy(attributeGroup[groupIndex]?.steps, (o) => o.order) ??
    []) as AutoStepOnAttributeGroupResponse[];

  const showTISCAutoSteps = !isPublicPage && isEditable;

  const inactiveAutoSteps =
    isDesignerAdmin ||
    !currentSpecAttributeGroupId ||
    currentSpecAttributeGroupId !== attrGroupItem.id ||
    currentSpecAttributeGroupId?.indexOf('new') !== -1 /* new group */ ||
    attributeGroupKey !== 'specification_attribute_groups' ||
    attrGroupItem?.steps?.length ||
    attrGroupItem.type !== SpecificationType.autoStep;

  useEffect(() => {
    if (attrGroupItem.selection && attrGroupItem.id) {
      let attributeSelected: AttributeSelectedProps = ATTRIBUTE_SELECTED_DEFAULT_VALUE;

      attrGroupItem.attributes.forEach((attribute) => {
        const hasAttributeOptionSelected = attribute.basis_options?.find(
          (option) => option.isChecked,
        );

        if (hasAttributeOptionSelected) {
          attributeSelected = {
            groupId: attrGroupItem.id || '',
            attribute: {
              id: attribute.id,
              name: attribute.name,
            },
          };
          const curAttributeValue =
            curAttributeSelect.groupId && curAttributeSelect.attribute?.id
              ? curAttributeSelect
              : attributeSelected;

          setCurAttributeSelect(curAttributeValue);
        }
      });
    }
  }, [attrGroupItem]);

  useEffect(() => {
    if (inactiveAutoSteps) {
      return;
    }

    if (showTISCAutoSteps) {
      getAutoStepData(productId, currentSpecAttributeGroupId).then((res) => {
        const newSpecificationAttributeGroup = [...specification_attribute_groups].map((el) =>
          el.id === currentSpecAttributeGroupId ? { ...el, steps: res } : el,
        );

        store.dispatch(
          setPartialProductDetail({
            specification_attribute_groups: newSpecificationAttributeGroup,
          }),
        );
      });

      return;
    }

    /// cheking in public page
    if (
      isPublicPage &&
      (user?.access_level.toLocaleLowerCase() === 'tisc admin' ||
        user?.access_level.toLocaleLowerCase() === 'consultant team')
    ) {
      return;
    }

    getAutoStepData(productId, currentSpecAttributeGroupId).then(async (res) => {
      if (res) {
        const preSelectSteps: AutoStepPreSelectOptionResponse[] = await getPreSelectStep(
          user?.id as string,
          productId,
          currentSpecAttributeGroupId,
        );

        const newRes = [...res];

        if (preSelectSteps.length) {
          preSelectSteps.forEach((el) => {
            res.forEach((opt, index) => {
              if (!opt.options.length || el.step_id !== opt.id) {
                return;
              }

              newRes[index] = {
                ...opt,
                options: opt.options.map((optionItem) => {
                  if (index === 0) {
                    return {
                      ...optionItem,
                      quantity: el.options.some((o) => o.id === optionItem.id) ? 1 : 0,
                      yours: optionItem.replicate ?? 0,
                    };
                  }

                  const optionFound = el.options.find(
                    (o) => o.id === optionItem.id && optionItem.pre_option === o.pre_option,
                  );

                  return {
                    ...optionItem,
                    quantity: optionFound ? optionFound.quantity : 0,
                    yours: optionItem.replicate ?? 0,
                  };
                }),
              };
            });
          });
        }

        /// save steps to specification attribute group
        store.dispatch(
          setPartialProductDetail({
            specification_attribute_groups: [...specification_attribute_groups].map((el) =>
              el.id === currentSpecAttributeGroupId
                ? { ...el, steps: newRes, isChecked: !!preSelectSteps.length }
                : el,
            ),
          }),
        );
      }
    });
  }, [currentSpecAttributeGroupId]);

  const handleOnChangeCollapse = () => {
    store.dispatch(
      setCurAttrGroupCollapse({
        [attributeGroupKey]:
          curAttrGroupCollapseId?.[attributeGroupKey] === attrGroupItem.id ? '' : attrGroupItem.id,
      }),
    );

    store.dispatch(closeProductFooterTab());
    store.dispatch(closeDimensionWeightGroup());
  };

  const handleOpenAutoStepModal = (stepIndex: number) => async () => {
    if (!productId) {
      message.error('Product ID is required');
      return;
    }

    if (!curAttrGroupCollapseId) {
      message.error('Attribute Group ID is required');
      return;
    }

    let curIndex = stepIndex;
    if (stepIndex === autoSteps.length - 1) {
      curIndex -= 1;
    }

    const newSlideBars: string[] = [];

    /// set up data to open modal based on each step
    const linkedOptionData: LinkedOptionDataProps[] = [];
    const pickedOption: PickedOptionProps = {};
    const optionsSelected: OptionSelectedProps = {};

    const firstStep = autoSteps[0];
    const optionIds = firstStep.options.map((opt) => opt.id);

    let newOptions: LinkedOptionProps | undefined;
    ///* mapping from specfication basis to get step 1 data
    attributes?.forEach((attr) => {
      if (newOptions) {
        return;
      }

      attr.subs.forEach((el) => {
        if (newOptions) {
          return;
        }

        el.basis?.subs?.forEach((sub) => {
          if (newOptions) {
            return;
          }

          if (optionIds.includes(sub.id)) {
            newOptions = {
              id: el.basis.id,
              name: el.basis.name,
              subs: (el.basis.subs as unknown as SubBasisOption[]).map((item) => {
                const opt = autoSteps[0].options.find((o) => o.id === item.id);

                return {
                  ...item,
                  replicate: opt?.replicate ?? 1,
                  sub_id: el.basis.id,
                  sub_name: el.basis.name,
                  pre_option: undefined,
                };
              }),
            };
          }
        });
      });
    });

    if (!newOptions) {
      message.error('Cannot get first step');
      return;
    }

    ///* set picked data for first step
    linkedOptionData[0] = { pickedData: [newOptions], linkedData: [] };

    /// list ID of previous option
    let exceptOptionIds: string[] = [];
    // Active option ID on left panel to load data to right panel
    let optionId = '';

    autoSteps.forEach((autoStep, index) => {
      /// set description
      newSlideBars.push(autoStep.name);

      // set option picked on right panel
      optionsSelected[autoStep.order] = {
        order: autoStep.order,
        options: autoStep.options,
      };

      //
      if (index >= autoSteps.length - 1) {
        const options = getPickedOptionGroup(autoStep.options);
        linkedOptionData[index] = { pickedData: options, linkedData: [] };

        return;
      }

      // add all option ID of previous step to prevent duplicate next step
      if (index <= curIndex && curIndex !== 0) {
        exceptOptionIds = uniq(exceptOptionIds.concat(autoStep.options.map((option) => option.id)));
      }

      if (index !== 0) {
        // set other picked data
        const options = getPickedOptionGroup(autoStep.options);
        linkedOptionData[index] = { pickedData: options, linkedData: [] };
      }

      const nextStep = autoSteps[index + 1];

      /// get first option highlighted
      const { optionId: pickedId, preOptionId } = getIDFromPreOption(
        nextStep.options[0].pre_option,
      );

      // save highlight left panel
      pickedOption[index] = {
        id: pickedId,
        pre_option: preOptionId,
      };

      // handle get the ID of previous active option on left panel
      if (index === curIndex) {
        if (nextStep) {
          optionId = pickedId;
        }
      }
    });

    const newLinkedOptionData = [...linkedOptionData];

    // get right panel data from selected options
    if ((curIndex === 0 && optionId) || (curIndex !== 0 && optionId && exceptOptionIds.length)) {
      const linkedDataResponse = await getLinkedOptionByOptionIds(
        optionId,
        exceptOptionIds.join(','),
      );

      const nextStep = curIndex + 1;

      newLinkedOptionData[curIndex].linkedData = linkedDataResponse.map((opt) => ({
        ...opt,
        subs: opt.subs.map((item) => ({
          ...item,
          subs: item.subs.map((sub) => ({
            ...sub,
            pre_option: autoSteps[nextStep].options[0].pre_option,
            pre_option_name: autoSteps[nextStep].options[0].pre_option_name,
          })),
        })),
      }));
    }

    store.dispatch(setLinkedOptionData(newLinkedOptionData));

    store.dispatch(setOptionsSelected(optionsSelected));

    store.dispatch(setPickedOption(pickedOption));

    store.dispatch(setSlideBar(newSlideBars));

    store.dispatch(setSlide(curIndex));

    store.dispatch(setStep(curIndex));

    setAutoStepModal(true);
  };

  const handleOpenPreSelectAutoStepModal = (stepIndex: number) => () => {
    if (!productId) {
      message.error('Product ID is required');
      return;
    }

    if (!curAttrGroupCollapseId) {
      message.error('Attribute Group ID is required');
      return;
    }

    const slideBars: string[] = [];
    const pickedOption: PickedOptionProps = {};
    const optionsSelected: OptionSelectedProps = {};
    const stepData: OptionPreSelectedProps = {};
    const newPreSelectStep: OptionPreSelectedProps = {};

    let curStepIndex = stepIndex;
    if (stepIndex === (attrGroupItem.steps as any[]).length - 1) {
      --curStepIndex;
    }

    const newSteps: AutoStepPreSelectOnAttributeGroupResponse[] = (
      attrGroupItem.steps as AutoStepPreSelectOnAttributeGroupResponse[]
    ).map((el) => ({
      ...el,
      options: el.options.map((opt) => ({
        ...opt,
        quantity: opt.quantity ?? 0,
        yours: opt.yours ?? 0,
      })),
    }));

    newSteps.forEach((el, index) => {
      /// update slide bar
      slideBars.push(el.name);

      /// update origin step data
      stepData[el.order] = {
        ...el,
        options: el.options.map((opt) => ({ ...opt, quantity: 0, yours: 0 })),
      };

      /* set option selected */
      optionsSelected[el.order] = {
        id: el.id,
        order: el.order,
        options: el.options
          .filter((optionItem) => optionItem.quantity > 0)
          .map((optionItem) => {
            if (!newSteps[index + 1]) {
              return { ...optionItem, disabled: false };
            }

            const impaired = newSteps[index + 1].options.find((option) => {
              const { optionId, preOptionId } = getIDFromPreOption(option.pre_option);

              return optionItem.id === optionId && optionItem.pre_option === preOptionId;
            });

            return { ...optionItem, disabled: !impaired };
          }),
      };
      /* ------------------ */

      /* set option highlighted on left panel */
      const optHasQuantity = el.options.find((opt) => opt.quantity > 0);

      if (el.order >= 2 && optHasQuantity) {
        /// set option highlighted is the first option found has quantity
        const { optionId: pickedId, preOptionId } = getIDFromPreOption(optHasQuantity.pre_option);

        const leftOption = newSteps[index - 1].options.find((opt) =>
          el.order === 2
            ? opt.id === pickedId
            : opt.id === pickedId && opt.pre_option === preOptionId,
        );

        if (leftOption) {
          // save highlight left panel
          pickedOption[el.order - 2] = {
            id: leftOption.id,
            pre_option: leftOption.pre_option ?? '',
            replicate: leftOption.replicate,
            yours: leftOption.replicate,
          };

          // set 1st option selected
          if (el.order === 2) {
            optionsSelected[1] = {
              id: newSteps[index - 1].id,
              order: 1,
              options: [leftOption],
            };
          }
        }
      }
      /* ------------------------------------- */

      /* set current data view on step was clicked */
      const curPicked = pickedOption[el.order - 2];

      if (index === 0) {
        newPreSelectStep[el.order] = el;
      } else if (curPicked?.id) {
        newPreSelectStep[el.order] = {
          ...el,
          options: el.options.every((opt) => opt.quantity === 0)
            ? []
            : el.options.filter((opt) => {
                const { optionId, preOptionId } = getIDFromPreOption(opt.pre_option);

                return el.order > 2
                  ? curPicked.id === optionId && curPicked.pre_option === preOptionId
                  : curPicked.id === optionId;
              }),
        };
      }
      /* --------------------------------------- */
    });

    // console.log('stepData', stepData);
    // console.log('pickedOption', pickedOption);
    console.log('optionsSelected', optionsSelected);

    /* mapping to find option on the left side doesn't any further option linked on the right side and disabled it */
    const newOptionsSelected = optionsSelected;

    map(optionsSelected, (optionData, order) => {
      const curOrder = Number(order);

      if (curOrder === 1 || !stepData[curOrder + 1]) {
        return false;
      }

      const newOption = optionData.options.map((el) => {
        const impaired = stepData[curOrder + 1].options.find((option) => {
          const { optionId, preOptionId } = getIDFromPreOption(option.pre_option);

          return el.id === optionId && el.pre_option === preOptionId;
        });

        return { ...el, disabled: !impaired };
      });

      newOptionsSelected[curOrder] = { ...newOptionsSelected[curOrder], options: newOption };

      return true;
    });

    /// set options seleted
    store.dispatch(setOptionsSelected(newOptionsSelected));
    /* ---------------------------------------------------------------------------- */

    /// set origin data
    store.dispatch(setStepData(stepData));

    /// set step data to view
    store.dispatch(setPreSelectStep(newPreSelectStep));

    // set option highlighted
    store.dispatch(setPickedOption(pickedOption));

    store.dispatch(setSlideBar(slideBars));

    store.dispatch(setSlide(curStepIndex));

    store.dispatch(setStep(curStepIndex));

    setAutoStepModal(true);
  };

  const renderCollapseHeader = (grIndex: number) => {
    const group = attributeGroup[grIndex];
    if (isTiscAdmin) {
      return isEditable ? (
        <InputGroup
          horizontal
          fontLevel={4}
          label={icon}
          placeholder="type title"
          noWrap
          value={group.name}
          onChange={onChangeAttributeName(grIndex)}
        />
      ) : (
        <BodyText level={6} fontFamily="Roboto" customClass="text-overflow">
          {group.name}
        </BodyText>
      );
    }

    const haveOptionAttr =
      group.attributes.some((el) => el.type === 'Options') || group?.steps?.length;

    /// highlighted specification attribute option type is selected
    const attributeSelected: string[] = [];
    group.attributes.forEach((grpAttr) => {
      if (grpAttr.type === 'Options') {
        grpAttr.basis_options?.forEach((optAttr) => {
          if (optAttr.isChecked && optAttr.value_1) {
            const conversionText = getConversionText({
              value_1: optAttr.value_1,
              unit_1: optAttr.unit_1,
              value_2: optAttr.value_2,
              unit_2: optAttr.unit_2,
            });
            attributeSelected.push(conversionText);
          }
        });
      }
    });
    const attributeSelectedContent = attributeSelected.join('; ');

    return (
      <div className={styles.attrGroupTitle}>
        {!isPublicPage && activeKey === 'specification' && haveOptionAttr ? (
          <div className="flex-between">
            <div className="flex-start">
              <CustomCheckbox
                options={[{ label: '', value: grIndex }]}
                selected={
                  // attributeGroup.some((gr) => gr.isChecked && gr.id === group.id)
                  group.isChecked && isAttributeGroupSelected
                    ? [{ label: group.name, value: grIndex }]
                    : []
                }
                onChange={() => {
                  onCheckedSpecification(grIndex, !isTiscAdmin);

                  if (curAttributeSelect.groupId && curAttributeSelect.attribute?.id) {
                    setCurAttributeSelect(ATTRIBUTE_SELECTED_DEFAULT_VALUE);
                  }
                }}
                // disabled={attributeGroup.some((gr) => !gr.isChecked && gr.id === group.id)}
                disabled={!group.isChecked}
                checkboxClass={styles.customLabel}
              />
              <RobotoBodyText level={6}>{group.name}</RobotoBodyText>
            </div>
            {showAttributeOptionSelected && attributeSelected.length ? (
              <RobotoBodyText
                title={attributeSelectedContent}
                level={6}
                customClass="attributeSelected"
              >
                {attributeSelectedContent}
              </RobotoBodyText>
            ) : null}
          </div>
        ) : (
          <BodyText level={6} fontFamily="Roboto" customClass="text-overflow">
            {group.name}
          </BodyText>
        )}
      </div>
    );
  };

  const renderAttributeRowItem = (attribute: ProductAttributeProps, attrIndex: number) => {
    if (isEditable) {
      if (!attribute && !attrGroupItem.steps?.length) {
        // return null;
      }

      return (
        <ProductAttributeSubItem
          key={attribute.id}
          attributeGroup={attributeGroup}
          attributeGroupIndex={groupIndex}
          attributeItemIndex={attrIndex}
          attributes={attributes ?? []}
          onItemChange={onChangeAttributeItem(groupIndex)}
          onDelete={deleteAttributeItem(groupIndex, attrIndex)}
          activeKey={activeKey}
          attributeGroupKey={attributeGroupKey}
        />
      );
    }

    let chosenOption: SpecificationAttributeBasisOptionProps | undefined;
    if (groupIndex !== -1) {
      const curAttribute = attributeGroup[groupIndex]?.attributes?.[attrIndex];

      chosenOption = curAttribute.basis_options?.find((el) => el.isChecked === true);
    }

    if (attribute.type !== 'Options') {
      return (
        <tr className={styles.attributeSubItem} key={attribute.id}>
          <td className={styles.attributeName}>
            <div className={`${styles.content} ${styles.attribute} attribute-type`}>
              <BodyText
                level={4}
                customClass={styles.content_type}
                title={capitalize(attribute.name)}
              >
                {attribute.name}
              </BodyText>
            </div>
          </td>

          <td className={styles.attributeDescription}>
            {attribute.conversion ? (
              <ConversionText
                conversion={attribute.conversion}
                firstValue={attribute.conversion_value_1}
                secondValue={attribute.conversion_value_2}
              />
            ) : (
              <GeneralText text={attribute.text} />
            )}
          </td>
        </tr>
      );
    }

    const renderAttributeOption = () => (
      <tr className={styles.attributeSubItem} key={attribute.id}>
        <td className={styles.attributeName}>
          <div className={`${styles.content} ${styles.attribute} attribute-type`}>
            <BodyText
              level={4}
              customClass={styles.content_type}
              title={capitalize(attribute.name)}
            >
              {attribute.name}
            </BodyText>
          </div>
        </td>

        <td className={styles.attributeDescription}>
          <AttributeOption
            title={attrGroupItem.name}
            isPublicPage={isPublicPage}
            attributeName={attribute.name}
            options={attribute.basis_options ?? []}
            chosenOption={
              chosenOption
                ? {
                    label: getConversionText(chosenOption as any),
                    value: chosenOption?.id,
                  }
                : undefined
            }
            setChosenOptions={async (option) => {
              if ((isTiscAdmin && isEditable) || !option || chosenOption?.id === option.value) {
                return;
              }

              setCurAttributeSelect({
                groupId: attrGroupItem.id || '',
                attribute: attribute,
              });

              // setCollapsible([]);

              const specificationGrp = await onSelectSpecificationOption(
                groupIndex,
                attribute.id,
                option.value.toString(),
              );

              setShowAttributeOptionSelected(!!specificationGrp?.haveCheckedOptionAttribute);
              setIsAttributeGroupSelected(!!specificationGrp?.haveCheckedAttributeGroup);
            }}
          />
        </td>
      </tr>
    );

    if (
      !attrGroupItem.selection ||
      (attrGroupItem.selection && attribute.id === curAttributeSelect.attribute?.id)
    ) {
      return renderAttributeOption();
    }

    return null;
  };

  return (
    <div key={groupIndex} style={{ marginBottom: 8, marginTop: isEditable ? undefined : 8 }}>
      <div className={styles.attributes}>
        <div className={styles.specification}>
          <CustomCollapse
            activeKey={curAttrGroupCollapseId?.[attributeGroupKey] === attrGroupItem.id ? '1' : ''}
            onChange={handleOnChangeCollapse}
            showActiveBoxShadow={!specifying}
            noBorder={noBorder}
            expandingHeaderFontStyle="bold"
            arrowAlignRight={specifying}
            className={isTiscAdmin ? undefined : styles.vendorSection}
            customHeaderClass={`${styles.productAttributeItem} ${
              specifying ? styles.specifying : ''
            }`}
            header={renderCollapseHeader(groupIndex)}
          >
            {isEditable && attributes ? (
              <SelectAttributesToGroupRow
                activeKey={activeKey}
                attributes={attributes}
                groupItem={attrGroupItem}
                groupIndex={groupIndex}
                productId={curProductId}
              />
            ) : null}

            {isPublicPage ? null : (
              <SelectAttributeSpecificationChoice
                activeKey={activeKey}
                attributeGroup={attributeGroup}
                groupIndex={groupIndex}
                productId={curProductId}
                isSpecifiedModal={!!isSpecifiedModal}
                curAttributeSelect={curAttributeSelect}
                setCurAttributeSelect={setCurAttributeSelect}
                collapsible={collapsible}
                setCollapsible={setCollapsible}
                onCheckedAttributeOption={setShowAttributeOptionSelected}
                onCheckedAttributeGroup={setIsAttributeGroupSelected}
              />
            )}

            {attributeGroupKey !== 'specification_attribute_groups' || !autoSteps.length ? null : (
              <>
                <table className={styles.table}>
                  <tbody>
                    {autoSteps.map((step, stepIndex) => {
                      return (
                        <React.Fragment key={step.id ?? stepIndex}>
                          <tr
                            key={stepIndex}
                            className={`${isPublicPage ? 'cursor-default' : 'cursor-pointer'} ${
                              styles.autoStepTr
                            }`}
                            onClick={
                              isPublicPage
                                ? undefined
                                : showTISCAutoSteps
                                ? handleOpenAutoStepModal(stepIndex)
                                : handleOpenPreSelectAutoStepModal(stepIndex)
                            }
                          >
                            <td style={{ width: '100%' }}>
                              <div className={`${isPublicPage ? '' : 'flex-between'}`}>
                                <div className="flex-start flex-grow text-overflow">
                                  <BodyText
                                    fontFamily="Cormorant-Garamond"
                                    level={4}
                                    style={{
                                      minWidth: 'fit-content',
                                      padding: '0 12px 1px 16px',
                                    }}
                                  >
                                    {step.order < 10 ? `0${step.order}` : step.order}
                                  </BodyText>
                                  <BodyText fontFamily="Cormorant-Garamond" level={4}>
                                    {step.name}
                                  </BodyText>
                                </div>

                                {isPublicPage ? null : (
                                  <div className="flex-start">
                                    <ActionRightLeftIcon style={{ marginLeft: 12 }} />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                          {isEditable ? (
                            <tr
                              className="border-bottom-light"
                              style={{ height: 2, width: '100%' }}
                            />
                          ) : null}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>

                {isEditable ? null : (
                  <div className={styles.stepImages}>
                    {autoSteps.map((step, stepIdx) =>
                      (step.options as OptionQuantityProps[])
                        .filter((el) => el.quantity > 0)
                        .map((option, optionIdx) => {
                          return (
                            <div key={option.id} className={styles.autoStepOption}>
                              <div className="step-info">
                                {option.image ? (
                                  <img className="step-image" src={showImageUrl(option.image)} />
                                ) : null}

                                <div className="step-text">
                                  <BodyText
                                    level={6}
                                    customClass="description"
                                    fontFamily="Roboto"
                                    color="white"
                                    style={{ whiteSpace: 'nowrap' }}
                                  >
                                    {step.order < 10 ? `0${step.order}` : step.order} Step
                                  </BodyText>

                                  <BodyText
                                    level={6}
                                    customClass="description"
                                    fontFamily="Roboto"
                                    color="white"
                                  >
                                    {trimEnd(
                                      `${option.value_1} ${option.value_2} ${
                                        option.unit_1 || option.unit_2
                                          ? `- ${option.unit_1} ${option.unit_2}`
                                          : ''
                                      }`,
                                    )}
                                  </BodyText>
                                </div>
                              </div>

                              {optionIdx !==
                                (step.options as OptionQuantityProps[]).filter(
                                  (el) => el.quantity > 0,
                                ).length -
                                  1 || stepIdx === autoSteps.length - 1 ? null : (
                                <div className="plus-icon">
                                  <PlusIcon />
                                </div>
                              )}
                            </div>
                          );
                        }),
                    )}
                  </div>
                )}
              </>
            )}

            <div
              className={`${
                isSpecifiedModal
                  ? styles.paddingNone
                  : attrGroupItem?.attributes?.length
                  ? styles.paddingRounded
                  : ''
              } ${
                attrGroupItem.selection && !isTiscAdmin && !isPublicPage
                  ? styles.paddingWrapper
                  : styles.colorInput
              } ${styles.tableContent}`}
            >
              <table className={`${styles.table}`}>
                <tbody>
                  {attrGroupItem.attributes?.map((attribute, attrIndex) =>
                    renderAttributeRowItem(attribute, attrIndex),
                  )}
                </tbody>
              </table>
            </div>
          </CustomCollapse>
        </div>
      </div>

      {attributeGroupKey === 'specification_attribute_groups' || !isPublicPage ? (
        showTISCAutoSteps ? (
          <AutoStep
            attributeGroup={attributeGroup}
            attributes={attributes ?? []}
            visible={autoStepModal}
            setVisible={setAutoStepModal}
          />
        ) : (
          <PreSelectStep visible={autoStepModal} setVisible={setAutoStepModal} />
        )
      ) : null}
    </div>
  );
};
