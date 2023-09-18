import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

import { ReactComponent as ActionRightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';

import { getAutoStepData, getLinkedOptionByOptionIds } from '../../services';
import { useProductAttributeForm } from './hooks';
import { useScreen } from '@/helper/common';
import { useCheckPermission, useGetParamId, useQuery } from '@/helper/hook';
import { capitalize, isUndefined, sortBy, uniq } from 'lodash';

import {
  LinkedOptionDataProps,
  OptionSelectedProps,
  PickedOptionIdProps,
  setCurAttrGroupCollapse,
  setLinkedOptionData,
  setOptionsSelected,
  setPartialProductDetail,
  setPickedOptionId,
  setSlide,
  setSlideBar,
  setStep,
} from '../../reducers';
import {
  AttributeSelectedProps,
  ProductAttributeFormInput,
  ProductAttributeProps,
  SpecificationAttributeBasisOptionProps,
} from '../../types';
import {
  AutoStepOnAttributeGroupResponse,
  LinkedOptionProps,
  OptionReplicateResponse,
} from '../../types/autoStep';
import { ActiveKeyType } from './types';
import store, { useAppSelector } from '@/reducers';
import { closeProductFooterTab } from '@/reducers/active';
import { SubBasisOption } from '@/types';

import CustomCollapse from '@/components/Collapse';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import InputGroup from '@/components/EntryForm/InputGroup';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import { AutoStep } from '../AutoStep/AutoStep';
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

  // const [randomId] = useState<number>(Math.random());

  // const {
  //   curActiveKey,
  //   onKeyChange,
  //   curActive: attrGroupCollapseId,
  // } = useCollapseGroupActiveCheck(
  //   activeKey,
  //   randomId, // groupIndex + 1, // Spare index 0 for Dimension & Weight group
  //   attrGroupItem.id,
  // );

  const {
    attributeGroupKey,
    onChangeAttributeItem,
    onChangeAttributeName,
    deleteAttributeItem,
    onCheckedSpecification,
    onSelectSpecificationOption,
  } = useProductAttributeForm(activeKey, curProductId, { isSpecifiedModal });

  const isTiscAdmin = useCheckPermission(['TISC Admin', 'Consultant Team']);
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

  const [autoStepModal, setAutoStepModal] = useState<boolean>(false);

  const autoSteps: AutoStepOnAttributeGroupResponse[] =
    sortBy(attributeGroup[groupIndex]?.steps, (o) => o.order) ?? [];

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
    if (
      curAttrGroupCollapseId?.['specification_attribute_groups'] === '' ||
      curAttrGroupCollapseId?.['specification_attribute_groups']?.indexOf('new') !== -1 ||
      attributeGroupKey !== 'specification_attribute_groups'
    ) {
      return;
    }

    const currentAttributeGroupId = curAttrGroupCollapseId['specification_attribute_groups'];

    getAutoStepData(productId, currentAttributeGroupId).then((res) => {
      const newSpecificationAttributeGroup = [...specification_attribute_groups].map((el) =>
        el.id === currentAttributeGroupId ? { ...el, steps: res } : el,
      );

      store.dispatch(
        setPartialProductDetail({
          specification_attribute_groups: newSpecificationAttributeGroup,
        }),
      );
    });
  }, [curAttrGroupCollapseId?.['specification_attribute_groups']]);

  const handleOnChangeCollapse = () => {
    // onKeyChange(key);

    store.dispatch(
      setCurAttrGroupCollapse({
        [attributeGroupKey]:
          curAttrGroupCollapseId?.[attributeGroupKey] === attrGroupItem.id ? '' : attrGroupItem.id,
      }),
    );

    store.dispatch(closeProductFooterTab());
  };

  // set picked data when open auto-step
  const getGroupOptions = (options: OptionReplicateResponse[]) => {
    const b: LinkedOptionProps[] = [];

    options.forEach((el) => {
      const index = b.findIndex((c) => c.id === el.sub_id);

      if (index > -1) {
        b[index].subs = b[index].subs.concat(el);
      } else {
        b.push({
          id: el.sub_id,
          name: el.sub_name,
          subs: [el],
        });
      }
    });

    return b;
  };

  const handleOpenAutoStepModal =
    (step: AutoStepOnAttributeGroupResponse, stepIndex: number) => async () => {
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
      const pickedOptionId: PickedOptionIdProps = {};
      const optionsSelected: OptionSelectedProps = {};

      const firstStep = autoSteps[0];
      const optionIds = firstStep.options.map((opt) => opt.id);

      let newOptions: LinkedOptionProps | undefined;
      ///* mapping from attribute to get step 1 data
      attributes?.forEach((attr) => {
        if (newOptions) {
          return;
        }

        attr.subs.forEach((el) => {
          if (newOptions) {
            return;
          }

          el.basis.subs.forEach((sub) => {
            if (newOptions) {
              return;
            }

            if (optionIds.includes(sub.id)) {
              newOptions = {
                id: el.basis.id,
                name: el.basis.name,
                subs: (el.basis.subs as unknown as SubBasisOption[]).map((item) => ({
                  ...item,
                  replicate: item.replicate ?? 1,
                  sub_id: el.basis.id,
                  sub_name: el.basis.name,
                  pre_option: undefined,
                })),
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
          name: autoStep.name,
          options: autoStep.options,
        };

        //
        if (index >= autoSteps.length - 1) {
          const options = getGroupOptions(autoStep.options);
          linkedOptionData[index] = { pickedData: options, linkedData: [] };

          return;
        }

        // add all option ID of previous step to prevent duplicate next step
        if (index <= curIndex && curIndex !== 0) {
          exceptOptionIds = exceptOptionIds.concat(autoStep.options.map((option) => option.id));
        }

        // set other picked data
        const options = getGroupOptions(autoStep.options);
        if (index !== 0) {
          linkedOptionData[index] = { pickedData: options, linkedData: [] };
        }

        const nextStep = autoSteps[index + 1];

        // save highlight left panel
        pickedOptionId[index] = nextStep.options[0].pre_option || nextStep.options[0].id;

        // handle get the ID of previous active option on left panel
        if (index === curIndex) {
          if (nextStep) {
            optionId = nextStep.options[0].pre_option || nextStep.options[0].id;
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

        newLinkedOptionData[curIndex].linkedData = linkedDataResponse.map((el) => ({
          ...el,
          subs: el.subs.map((item) => ({
            ...item,
            subs: item.subs.map((sub) => ({
              ...sub,
              sub_id: item.id,
              sub_name: item.name,
              pre_option: optionId,
            })),
          })),
        }));
      }

      store.dispatch(setLinkedOptionData(newLinkedOptionData));

      store.dispatch(setOptionsSelected(optionsSelected));

      store.dispatch(setPickedOptionId(pickedOptionId));

      store.dispatch(setSlideBar(uniq(newSlideBars)));

      store.dispatch(setSlide(curIndex));

      store.dispatch(setStep(curIndex));

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

    const haveOptionAttr = group.attributes.some((el) => el.type === 'Options');

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
                  attributeGroup.some((gr) => gr.isChecked && gr.id === group.id) &&
                  isAttributeGroupSelected
                    ? [{ label: group.name, value: grIndex }]
                    : []
                }
                onChange={() => {
                  onCheckedSpecification(grIndex, !isTiscAdmin);

                  if (curAttributeSelect.groupId && curAttributeSelect.attribute?.id) {
                    setCurAttributeSelect(ATTRIBUTE_SELECTED_DEFAULT_VALUE);
                  }
                }}
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
    if (isTiscAdmin && isEditable) {
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
              if ((isTiscAdmin && isEditable) || !option) {
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
            // keyCollapse={curAttrGroupCollapseId}
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
                onCheckedAttributeOption={(isAttrOptChecked) => {
                  setShowAttributeOptionSelected(isAttrOptChecked);
                }}
                onCheckedAttributeGroup={(isAttrGrpChecked) => {
                  setIsAttributeGroupSelected(isAttrGrpChecked);
                }}
              />
            )}

            <div
              className={`${
                isSpecifiedModal
                  ? styles.paddingNone
                  : attrGroupItem?.attributes?.length || attrGroupItem?.steps?.length
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
                  {autoSteps?.map((step, stepIndex) => {
                    let curStep = stepIndex;
                    ++curStep;

                    return (
                      <tr
                        key={stepIndex}
                        className={`cursor-pointer flex-between`}
                        onClick={handleOpenAutoStepModal(step, stepIndex)}
                      >
                        <td className="flex-start">
                          <BodyText fontFamily="Roboto" level={5}>
                            {curStep < 10 ? `0${curStep}` : curStep}
                          </BodyText>
                          <BodyText fontFamily="Roboto" level={5}>
                            {step.name}
                          </BodyText>
                        </td>
                        <td className="flex-start">
                          <ActionRightLeftIcon />
                        </td>
                      </tr>
                    );
                  })}

                  {attrGroupItem.attributes?.map((attribute, attrIndex) =>
                    renderAttributeRowItem(attribute, attrIndex),
                  )}
                </tbody>
              </table>
            </div>
          </CustomCollapse>
        </div>
      </div>

      <AutoStep
        attributeGroup={attributeGroup}
        attributes={attributes ?? []}
        visible={autoStepModal}
        setVisible={setAutoStepModal}
      />
    </div>
  );
};
