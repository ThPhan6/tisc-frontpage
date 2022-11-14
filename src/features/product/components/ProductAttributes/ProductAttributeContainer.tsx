import { FC } from 'react';

import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';

import { useProductAttributeForm } from './hooks';
import { useCheckPermission, useGetParamId, useQuery } from '@/helper/hook';

import { setPartialProductDetail } from '../../reducers';
import { ProductAttributeProps, SpecificationAttributeBasisOptionProps } from '../../types';
import { ProductInfoTab } from './types';
import { DimensionWeightItem } from '@/features/dimension-weight/types';
import store from '@/reducers';
import { ProductAttributes } from '@/types';

import CustomCollapse from '@/components/Collapse';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import InputGroup from '@/components/EntryForm/InputGroup';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import { AttributeOption, ConversionText, GeneralText } from './AttributeComponent';
import { ProductAttributeSubItem } from './AttributeItem';
import { SelectAttributesToGroupRow } from './SelectAttributesToGroupRow';
import styles from './index.less';
import { DimensionWeight } from '@/features/dimension-weight';

interface Props {
  attributes?: ProductAttributes[];
  activeKey: ProductInfoTab;
  specifying?: boolean;
  noBorder?: boolean;
  isSpecifiedModal?: boolean;
  productId?: string;
}

export const ProductAttributeContainer: FC<Props> = ({
  activeKey,
  attributes,
  specifying,
  noBorder,
  productId,
  isSpecifiedModal,
}) => {
  const productIdParam = useGetParamId();
  const isTiscAdmin = useCheckPermission('TISC Admin');

  const signature = useQuery().get('signature') ?? '';
  const isPublicPage = signature ? true : false;

  const curProductId = productId ?? productIdParam;
  const {
    onChangeAttributeItem,
    addNewProductAttribute,
    onChangeAttributeName,
    deleteAttributeItem,
    onCheckedSpecification,
    attributeGroup,
    attributeGroupKey,
    onSelectSpecificationOption,
    dimensionWeightData,
    onChangeDimensionWeight,
  } = useProductAttributeForm(activeKey, curProductId, isSpecifiedModal);

  const renderCollapseHeader = (groupIndex: number) => {
    const group = attributeGroup[groupIndex];
    if (isTiscAdmin) {
      return (
        <InputGroup
          horizontal
          fontLevel={4}
          label={<ScrollIcon />}
          placeholder="type title"
          noWrap
          defaultValue={group.name}
          onChange={onChangeAttributeName(groupIndex)}
        />
      );
    }

    const haveOptionAttr = group.attributes.some((el) => el.type === 'Options');

    return (
      <div className={styles.attrGroupTitle}>
        {!isPublicPage && activeKey === 'specification' && haveOptionAttr ? (
          <CustomCheckbox
            options={[{ label: group.name, value: groupIndex }]}
            selected={
              attributeGroup.some((gr) => gr.isChecked && gr.id === group.id)
                ? [{ label: group.name, value: groupIndex }]
                : []
            }
            onChange={() => onCheckedSpecification(groupIndex, isTiscAdmin ? false : true)}
            checkboxClass={styles.customLabel}
          />
        ) : (
          <BodyText level={6} fontFamily="Roboto" customClass="text-overflow">
            {group.name}
          </BodyText>
        )}
      </div>
    );
  };

  const renderAttributeRowItem = (
    attribute: ProductAttributeProps | DimensionWeightItem,
    attrIndex: number,
    groupName: string,
    groupIndex?: number,
  ) => {
    if (isTiscAdmin) {
      if (!attributes) {
        return null;
      }

      return (
        <ProductAttributeSubItem
          item={attribute as ProductAttributeProps}
          attributeItemIndex={attrIndex}
          attributeIndex={groupIndex}
          attributes={attributes}
          itemAttributes={attributeGroup[groupIndex].attributes}
          onItemChange={onChangeAttributeItem(groupIndex)}
          onDelete={deleteAttributeItem(groupIndex, attrIndex)}
          activeKey={activeKey}
          attributeGroup={attributeGroup}
          attributeGroupKey={attributeGroupKey}
          key={attribute.id}
        />
      );
    }

    let chosenOption: SpecificationAttributeBasisOptionProps | undefined;
    if (groupIndex) {
      const curAttribute = attributeGroup[groupIndex]?.attributes?.[attrIndex];
      chosenOption = curAttribute.basis_options?.find((el) => el.isChecked === true);
    }

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
          ) : attribute.type === 'Options' ? (
            <AttributeOption
              title={groupName}
              isPublicPage={isPublicPage}
              attributeName={attribute.name}
              options={attribute.basis_options ?? []}
              chosenOption={
                chosenOption
                  ? {
                      label: `${chosenOption.value_1 ?? ''} ${chosenOption.unit_1 ?? ''} - ${
                        chosenOption.value_2 ?? ''
                      } ${chosenOption.unit_2 ?? ''}`,
                      value: chosenOption?.id,
                    }
                  : undefined
              }
              setChosenOptions={(option) => {
                if (groupIndex) {
                  onSelectSpecificationOption(
                    groupIndex,
                    attribute.id,
                    isTiscAdmin ? false : true,
                    option?.value?.toString() || undefined,
                  );
                }
              }}
            />
          ) : (
            <GeneralText text={attribute.text} />
          )}
        </td>
      </tr>
    );
  };

  const renderDimensionWeight = () => {
    if (activeKey !== 'specification' || (!dimensionWeightData.attributes.length && !isTiscAdmin))
      return null;

    if (isTiscAdmin) {
      return (
        <DimensionWeight
          customClass={styles.marginTopSpace}
          collapseStyles={!isSpecifiedModal}
          editable={isTiscAdmin}
          data={dimensionWeightData}
          setData={(data) => {
            store.dispatch(
              setPartialProductDetail({
                dimension_and_weight: data,
              }),
            );
          }}
          onChange={onChangeDimensionWeight}
        />
      );
    }

    return (
      <CustomCollapse
        defaultActiveKey={'1'}
        showActiveBoxShadow={!specifying}
        noBorder={noBorder}
        customHeaderClass={`${styles.productAttributeItem} ${styles.marginTopSpace} ${
          specifying ? styles.specifying : ''
        }`}
        header={
          <div className={styles.attrGroupTitle}>
            <RobotoBodyText level={6}>{dimensionWeightData.name}</RobotoBodyText>
          </div>
        }>
        <table className={styles.table}>
          <tbody>
            {dimensionWeightData.attributes.map((attribute, attrIndex) =>
              renderAttributeRowItem(attribute, attrIndex, dimensionWeightData.name),
            )}
          </tbody>
        </table>
      </CustomCollapse>
    );
  };

  return (
    <>
      {renderDimensionWeight()}

      {isTiscAdmin ? (
        <CustomPlusButton
          size={18}
          label="Add Attribute"
          onClick={addNewProductAttribute}
          customClass={styles.paddingSpace}
        />
      ) : null}

      {attributeGroup.map((_group, groupIndex) => {
        const attrGroupItem = attributeGroup[groupIndex];
        return (
          <div key={groupIndex} style={{ marginBottom: 8, marginTop: isTiscAdmin ? undefined : 8 }}>
            <div className={styles.attributes}>
              <div className={styles.specification}>
                <CustomCollapse
                  defaultActiveKey={'1'}
                  showActiveBoxShadow={!specifying}
                  noBorder={noBorder}
                  className={isTiscAdmin ? undefined : styles.vendorSection}
                  customHeaderClass={`${styles.productAttributeItem} ${
                    specifying ? styles.specifying : ''
                  }`}
                  header={renderCollapseHeader(groupIndex)}>
                  {isTiscAdmin && attributes ? (
                    <SelectAttributesToGroupRow
                      activeKey={activeKey}
                      attributes={attributes}
                      groupItem={attrGroupItem}
                      groupIndex={groupIndex}
                      productId={curProductId}
                    />
                  ) : null}

                  {attrGroupItem.attributes.length ? (
                    <table className={styles.table}>
                      <tbody>
                        {attrGroupItem.attributes.map((attribute, attrIndex) =>
                          renderAttributeRowItem(
                            attribute,
                            attrIndex,
                            attrGroupItem.name,
                            groupIndex,
                          ),
                        )}
                      </tbody>
                    </table>
                  ) : null}
                </CustomCollapse>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
