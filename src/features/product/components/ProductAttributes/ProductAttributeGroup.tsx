import { FC, useEffect, useState } from 'react';

import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';

import { useProductAttributeForm } from './hooks';
import { useScreen } from '@/helper/common';
import { useCheckPermission, useQuery } from '@/helper/hook';

import {
  AttributeSelectedProps,
  ProductAttributeFormInput,
  ProductAttributeProps,
  SpecificationAttributeBasisOptionProps,
} from '../../types';
import { ActiveKeyType } from './types';
import store from '@/reducers';
import { closeProductFooterTab, useCollapseGroupActiveCheck } from '@/reducers/active';

import CustomCollapse from '@/components/Collapse';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import InputGroup from '@/components/EntryForm/InputGroup';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import { AttributeOption, ConversionText, GeneralText } from './AttributeComponent';
import { ProductAttributeSubItem, getConversionText } from './AttributeItem';
import { ProductAttributeContainerProps } from './ProductAttributeContainer';
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
}) => {
  const isTablet = useScreen().isTablet;
  const { curActiveKey, onKeyChange } = useCollapseGroupActiveCheck(
    activeKey,
    groupIndex + 1, // Spare index 0 for Dimension & Weight group
  );

  const isTiscAdmin = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const isEditable = isTiscAdmin && !isTablet;

  const signature = useQuery().get('signature') ?? '';
  const isPublicPage = signature ? true : false;

  const [curAttributeSelect, setCurAttributeSelect] = useState<AttributeSelectedProps>(
    ATTRIBUTE_SELECTED_DEFAULT_VALUE,
  );

  /// for specification choice attribute
  const [collapsible, setCollapsible] = useState<ActiveKeyType>([]);

  const {
    onChangeAttributeItem,
    onChangeAttributeName,
    deleteAttributeItem,
    onCheckedSpecification,
    attributeGroupKey,
    onSelectSpecificationOption,
  } = useProductAttributeForm(activeKey, curProductId, { isSpecifiedModal });

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

  const renderCollapseHeader = (grIndex: number) => {
    const group = attributeGroup[grIndex];
    if (isTiscAdmin) {
      return isEditable ? (
        <InputGroup
          horizontal
          fontLevel={4}
          label={<ScrollIcon />}
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

    const haveOptionAttr = group.attributes.find((el) => el.type === 'Options');

    const attributeSelected: string[] = [];

    group.attributes.forEach((grpAttr) => {
      if (grpAttr.type === 'Options') {
        grpAttr.basis_options?.forEach((optAttr) => {
          if (optAttr.isChecked) {
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
                  attributeGroup.some((gr) => gr.isChecked && gr.id === group.id)
                    ? [{ label: group.name, value: grIndex }]
                    : []
                }
                onChange={() => {
                  onCheckedSpecification(grIndex, isTiscAdmin ? false : true);

                  if (curAttributeSelect.groupId && curAttributeSelect.attribute?.id) {
                    setCurAttributeSelect(ATTRIBUTE_SELECTED_DEFAULT_VALUE);
                  }
                }}
                checkboxClass={styles.customLabel}
              />
              <RobotoBodyText level={6}>{group.name}</RobotoBodyText>
            </div>
            <RobotoBodyText
              title={attributeSelectedContent}
              level={6}
              customClass={'attributeSelected'}
            >
              {attributeSelectedContent}
            </RobotoBodyText>
          </div>
        ) : (
          <BodyText level={6} fontFamily="Roboto" customClass="text-overflow">
            {group.name}
          </BodyText>
        )}
      </div>
    );
  };

  const renderAttributeRowItem = (
    attribute: ProductAttributeProps,
    attrIndex: number,
    groupName: string,
    isSpecificationOptionSelection?: boolean,
  ) => {
    if (isTiscAdmin && isEditable) {
      if (!attributes) {
        return null;
      }

      return (
        <ProductAttributeSubItem
          key={attribute.id}
          attributeGroup={attributeGroup}
          attributeGroupIndex={groupIndex}
          attributeItemIndex={attrIndex}
          attributesData={attributes}
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
              <BodyText level={4} customClass={styles.content_type}>
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
            <BodyText level={4} customClass={styles.content_type}>
              {attribute.name}
            </BodyText>
          </div>
        </td>

        <td className={styles.attributeDescription}>
          <AttributeOption
            title={groupName}
            isPublicPage={isPublicPage}
            attributeName={attribute.name}
            options={attribute.basis_options ?? []}
            chosenOption={
              chosenOption
                ? {
                    label: getConversionText(chosenOption),
                    value: chosenOption?.id,
                  }
                : undefined
            }
            setChosenOptions={(option) => {
              if (isTiscAdmin && isEditable) {
                return;
              }
              if (option?.value) {
                setCurAttributeSelect({
                  groupId: attrGroupItem.id || '',
                  attribute: attribute,
                });

                setCollapsible([]);

                onSelectSpecificationOption(
                  groupIndex,
                  attribute.id,
                  isTiscAdmin ? false : true,
                  option.value.toString(),
                );
              }
            }}
          />
        </td>
      </tr>
    );

    if (
      !isSpecificationOptionSelection ||
      (isSpecificationOptionSelection && attribute.id === curAttributeSelect.attribute?.id)
    ) {
      return renderAttributeOption();
    }
  };

  return (
    <div key={groupIndex} style={{ marginBottom: 8, marginTop: isEditable ? undefined : 8 }}>
      <div className={styles.attributes}>
        <div className={styles.specification}>
          <CustomCollapse
            activeKey={curActiveKey}
            onChange={(key) => {
              onKeyChange(key);
              store.dispatch(closeProductFooterTab());
            }}
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
              />
            )}

            {attrGroupItem.attributes.length ? (
              <div
                className={`${isSpecifiedModal ? styles.paddingNone : styles.paddingRounded} ${
                  attrGroupItem.selection && !isTiscAdmin && !isPublicPage
                    ? styles.paddingWrapper
                    : styles.colorInput
                }`}
              >
                <table className={styles.table}>
                  <tbody>
                    {attrGroupItem.attributes.map((attribute, attrIndex) =>
                      renderAttributeRowItem(
                        attribute,
                        attrIndex,
                        attrGroupItem.name,
                        attrGroupItem.selection,
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            ) : null}
          </CustomCollapse>
        </div>
      </div>
    </div>
  );
};
