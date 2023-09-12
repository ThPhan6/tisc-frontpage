import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

import { ReactComponent as ActionRightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';

import { getAutoStepData, getLinkedOptionByOptionIds } from '../../services';
import { useProductAttributeForm } from './hooks';
import { useScreen } from '@/helper/common';
import { useCheckPermission, useGetParamId, useQuery } from '@/helper/hook';
import { capitalize, flatMap, isUndefined, sortBy, unionBy, uniq } from 'lodash';

import {
  LinkedOptionDataProps,
  PickedOptionIdProps,
  setCurAttrGroupCollapse,
  setLinkedOptionData,
  setPartialProductDetail,
  setPickedOptionId,
  setSlide,
  setSlideBar,
} from '../../reducers';
import {
  AttributeSelectedProps,
  ProductAttributeFormInput,
  ProductAttributeProps,
  SpecificationAttributeBasisOptionProps,
} from '../../types';
import { AutoStepOnAttributeGroupBody, LinkedSubOptionProps } from '../../types/autoStep';
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

  const [step, setStep] = useState<number>(0);
  const [autoStepModal, setAutoStepModal] = useState<boolean>(false);

  const autoSteps: AutoStepOnAttributeGroupBody[] =
    sortBy(attributeGroup[groupIndex]?.steps, (o) => o.order) ?? [];

  /// for render UI
  const autoStepData = autoSteps.filter((el) => el.order % 2 !== 0);

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

  const handleOnChangeCollapse = (key: string | string[] | number) => {
    // onKeyChange(key);

    store.dispatch(
      setCurAttrGroupCollapse({
        [attributeGroupKey]:
          curAttrGroupCollapseId?.[attributeGroupKey] === attrGroupItem.id ? '' : attrGroupItem.id,
      }),
    );

    store.dispatch(closeProductFooterTab());
  };

  const handleOpenAutoStepModal = (index: number) => () => {
    if (!productId) {
      message.error('Product ID is required');
      return;
    }

    if (!curAttrGroupCollapseId) {
      message.error('Attribute Group ID is required');
      return;
    }

    const newSlideBars: string[] = [];

    /// set picked id for calling api
    const pickedIds: string[] = [];

    /// set up data to open modal based on each step
    const linkedOptionData: LinkedOptionDataProps[] = [];
    const pickedOptionIds: PickedOptionIdProps[] = [];

    autoSteps.forEach((el, stepIndex) => {
      /// set up slide bar
      newSlideBars.push(el.name);

      const optionIds = el.options.map((opt) => opt.id);

      const curIdx = stepIndex;
      const curStep = parseInt(String(curIdx / 2), 10);

      if (isUndefined(linkedOptionData[curStep])) {
        linkedOptionData[curStep] = { pickedData: [], linkedData: [] };
        pickedOptionIds[curStep] = { pickedIds: [], linkedIds: {} };
      }

      attributes?.forEach((attr) => {
        attr.subs.forEach((sub) => {
          (sub.basis?.subs as unknown as SubBasisOption[])?.forEach((item) => {
            if (optionIds.includes(item.id)) {
              /// picked data and ids
              if (stepIndex % 2 === 0) {
                pickedOptionIds[curStep].pickedIds.push(item.id);
                pickedIds.push(item.id);

                if (stepIndex === 0) {
                  linkedOptionData[curStep].pickedData.push({
                    id: sub.basis.id,
                    name: sub.basis.name,
                    subs:
                      (sub.basis?.subs as unknown as SubBasisOption[]).map((o) => ({
                        id: o.id,
                        image: o.image,
                        product_id: o.product_id,
                        unit_1: o.unit_1,
                        unit_2: o.unit_2,
                        value_1: o.value_1,
                        value_2: o.value_2,
                        replicate: o.replicate ?? 1,
                      })) ?? [],
                  });
                } else {
                  linkedOptionData[curStep].pickedData.push({
                    id: sub.basis.id,
                    name: sub.basis.name,
                    subs:
                      ((sub.basis?.subs as unknown as SubBasisOption[])
                        .map((o) =>
                          optionIds.includes(o.id)
                            ? {
                                id: o.id,
                                image: o.image,
                                product_id: o.product_id,
                                unit_1: o.unit_1,
                                unit_2: o.unit_2,
                                value_1: o.value_1,
                                value_2: o.value_2,
                                replicate: o.replicate ?? 1,
                              }
                            : undefined,
                        )
                        .filter(Boolean) as LinkedSubOptionProps[]) ?? [],
                  });
                }

                /// linked data and ids
              } else {
                if (!pickedOptionIds[curStep].linkedIds?.[item.id]) {
                  pickedOptionIds[curStep].linkedIds[item.id] = [];
                } else {
                  pickedOptionIds[curStep].linkedIds[item.id].push(item.id);
                }
              }
            }
          });
        });
      });
    });

    if (!pickedIds.length) {
      // message.error('Cannot open auto-step, some options might be deleted');
      // return;
    }

    const optionId = pickedOptionIds[index].pickedIds.join(',');

    console.log(linkedOptionData, '<<<----------- linkedOptionData');
    console.log(pickedOptionIds, '<<<----------- pickedOptionIds');

    const newData = linkedOptionData.map((el) => ({
      ...el,
      pickedData: unionBy(el.pickedData, (o) => o.id),
    }));

    if (index === 0) {
      getLinkedOptionByOptionIds(optionId).then((res) => {
        newData[index].linkedData = res;

        store.dispatch(setLinkedOptionData(newData));
      });
    } else {
      const exceptOptionIds = flatMap(
        pickedOptionIds.filter((_, curIdx) => curIdx < index).map((el) => el.pickedIds),
      ).join(',');

      getLinkedOptionByOptionIds(optionId, exceptOptionIds).then((res) => {
        newData[index].linkedData = res;

        store.dispatch(setLinkedOptionData(newData));
      });
    }

    store.dispatch(setSlideBar(uniq(newSlideBars)));
    store.dispatch(setPickedOptionId(pickedOptionIds));

    setStep(index);
    store.dispatch(setSlide(index));

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

  if (attributeGroupKey === 'specification_attribute_groups') {
    // console.log('attributeGroup', attributeGroup);
    // console.log(' attrGroupItem.id', attrGroupItem.id);
  }

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
              <table className={`${styles.table} `}>
                <tbody>
                  {autoStepData?.map((el, stepIndex) => {
                    let curStep = stepIndex;
                    ++curStep;

                    return (
                      <tr
                        key={stepIndex}
                        className={`cursor-pointer flex-between`}
                        onClick={handleOpenAutoStepModal(stepIndex)}
                      >
                        <td className="flex-start">
                          <BodyText fontFamily="Roboto" level={5}>
                            {curStep < 10 ? `0${curStep}` : curStep}
                          </BodyText>
                          <BodyText fontFamily="Roboto" level={5}>
                            {el.name}
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
        step={step}
        attributeGroup={attributeGroup}
        attributes={attributes ?? []}
        visible={autoStepModal}
        setVisible={setAutoStepModal}
      />
    </div>
  );
};
