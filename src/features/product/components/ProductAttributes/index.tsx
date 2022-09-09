import { FC } from 'react';

import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';

import { useProductAttributeForm } from './hooks';
import { useCheckPermission } from '@/helper/hook';

import { ProductAttributeProps } from '../../types';
import { ProductInfoTab } from '../ProductAttributeComponent/types';
import { ProductAttributes } from '@/types';

import CustomCollapse from '@/components/Collapse';
import InputGroup from '@/components/EntryForm/InputGroup';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, MainTitle } from '@/components/Typography';

import {
  AttributeOption,
  ConversionText,
  GeneralText,
} from '../ProductAttributeComponent/AttributeComponent';
import styles from '../detail.less';
import { AttributeItem } from './AttributeItem';
import { SelectAttributesToGroupRow } from './AttributesToGroupSelection';

interface Props {
  attributes?: ProductAttributes[];
  activeKey: ProductInfoTab;
}

export const ProductAttributeContainer: FC<Props> = ({ activeKey, attributes }) => {
  const isTiscAdmin = useCheckPermission('TISC Admin');
  const {
    onChangeAttributeItem,
    addNewProductAttribute,
    onChangeAttributeName,
    deleteAttributeItem,
    attributeGroup,
    attributeGroupKey,
  } = useProductAttributeForm(activeKey);

  const renderCollapseHeader = (groupIndex: number) => {
    return (
      <InputGroup
        horizontal
        fontLevel={4}
        label={<ScrollIcon />}
        placeholder="type title"
        noWrap
        defaultValue={attributeGroup[groupIndex].name}
        onChange={onChangeAttributeName(groupIndex)}
      />
    );
  };

  const renderAttributeRowItem = (
    attribute: ProductAttributeProps,
    attrIndex: number,
    groupIndex: number,
    groupName: string,
  ) => {
    if (isTiscAdmin) {
      if (!attributes) {
        return;
      }
      return (
        <div className={styles.attributeSubItem} key={attribute.id}>
          <AttributeItem
            item={attribute}
            attributeItemIndex={attrIndex}
            attributeIndex={groupIndex}
            attributes={attributes}
            itemAttributes={attributeGroup[groupIndex].attributes}
            onItemChange={onChangeAttributeItem(groupIndex)}
            onDelete={deleteAttributeItem(groupIndex, attrIndex)}
            activeKey={activeKey}
            attributeGroup={attributeGroup}
            attributeGroupKey={attributeGroupKey}
          />
        </div>
      );
    }

    return (
      <tr key={attribute.id}>
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
              attributeName={attribute.name}
              options={attribute.basis_options ?? []}
            />
          ) : (
            <GeneralText text={attribute.text} />
          )}
        </td>
      </tr>
    );
  };

  return (
    <>
      {isTiscAdmin ? (
        <div className={styles.addAttributeBtn} onClick={addNewProductAttribute}>
          <MainTitle level={4} customClass="add-attribute-text">
            Add Attribute
          </MainTitle>
          <CustomPlusButton size={18} />
        </div>
      ) : null}

      {attributeGroup.map((group, groupIndex) => {
        const attrGroupItem = attributeGroup[groupIndex];
        console.log('render', attributeGroup);
        return (
          <div style={{ marginBottom: 8 }}>
            <CustomCollapse
              defaultActiveKey={'1'}
              customHeaderClass={styles.productAttributeItem}
              header={renderCollapseHeader(groupIndex)}>
              {isTiscAdmin && attributes ? (
                <SelectAttributesToGroupRow
                  activeKey={activeKey}
                  attributes={attributes}
                  groupItem={attrGroupItem}
                  groupIndex={groupIndex}
                />
              ) : null}

              {attrGroupItem.attributes.length ? (
                <table className={styles.table}>
                  <tbody>
                    {attrGroupItem.attributes.map((attribute, attrIndex) =>
                      renderAttributeRowItem(attribute, attrIndex, groupIndex, attrGroupItem.name),
                    )}
                  </tbody>
                </table>
              ) : null}
            </CustomCollapse>
          </div>
        );
      })}
    </>
  );
};
