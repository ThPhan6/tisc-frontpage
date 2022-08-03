import React, { useState, useEffect } from 'react';
import { BodyText, MainTitle } from '@/components/Typography';
import InputGroup from '@/components/EntryForm/InputGroup';
import Popover from '@/components/Modal/Popover';
import CustomCollapse from '@/components/Collapse';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ProductAttributeFormInput, ProductAttributeProps } from '@/features/product/types';
import { useDispatch } from 'react-redux';
import { setPartialProductDetail } from '@/features/product/reducers';
import type { CheckboxValue } from '@/components/CustomCheckbox/types';
import styles from '../detail.less';
import { map, upperCase } from 'lodash';
import { ProductAttributes, ProductSubAttributes } from '@/types';
import { ProductAttributeSubItem } from './ProductAttributeSubItem';
import { ProductInfoTab } from './types';

const POPOVER_TITLE = {
  general: 'Select General Attributes',
  feature: 'Select Feature Attributes',
  specification: 'Select Specification',
};

export type AttributeGroupKey =
  | 'general_attribute_groups'
  | 'feature_attribute_groups'
  | 'specification_attribute_groups';

export interface ProductAttributeItemProps {
  attributes: ProductAttributes[];
  attributeGroup: ProductAttributeFormInput[];
  attributeGroupKey: AttributeGroupKey;
  onDelete?: () => void;
  onItemChange?: (data: ProductAttributeProps[]) => void;
  index: number;
  activeKey: ProductInfoTab;
}

const ProductAttributeItem: React.FC<ProductAttributeItemProps> = ({
  attributes,
  attributeGroup,
  attributeGroupKey,
  onDelete,
  onItemChange,
  index,
  activeKey,
}) => {
  const dispatch = useDispatch();

  const attributeItem = attributeGroup[index];
  const isSpecification = activeKey === 'specification';

  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<CheckboxValue[]>(
    attributeItem.attributes.map((attr) => {
      return {
        label: '',
        value: attr.id,
      };
    }),
  );

  useEffect(() => {
    if (!selected) {
      return;
    }

    const newAttributes = [...attributeGroup];
    newAttributes[index] = {
      ...newAttributes[index],
      attributes: selected.map((item, key: number) => {
        /// radio value
        let selectedAttribute: ProductSubAttributes | undefined;
        attributes.forEach((attr) => {
          attr.subs.forEach((sub) => {
            if (sub.id === item.value) {
              selectedAttribute = sub;
            }
          });
        });

        const previousData = newAttributes[index].attributes[key];

        const activeData: any = {
          text: '',
          conversion_value_1: '',
          conversion_value_2: '',
        };

        if (previousData && previousData.id === selectedAttribute?.id) {
          activeData.text = previousData.text;
          activeData.conversion_value_1 = previousData.conversion_value_1;
          activeData.conversion_value_2 = previousData.conversion_value_2;
          if (isSpecification) {
            activeData.basis_options = previousData.basis_options;
          }
        }

        const newAttribute: ProductAttributeProps = {
          id: selectedAttribute?.id || '',
          basis_id: selectedAttribute?.basis_id || '',
          basis_value_id: '',
          type: selectedAttribute?.basis?.type ?? 'Text',
          ...activeData,
        };

        return newAttribute;
      }),
    };

    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newAttributes,
      }),
    );
  }, [selected]);

  const deleteAttributeItem = (key: number) => () => {
    const newAttributes = [...attributeGroup];
    const newItemAttributes = attributeItem.attributes.filter((_attr, idx) => idx !== key);

    newAttributes[index] = {
      ...newAttributes[index],
      attributes: newItemAttributes,
    };

    /// reset selected
    setSelected(
      newAttributes[index].attributes.map((attr) => {
        return {
          label: '',
          value: attr.id,
        };
      }),
    );
    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newAttributes,
      }),
    );
  };

  const onChangeAttributeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAttributes = [...attributeGroup];
    const newItemAttributes = { ...attributeItem };

    newItemAttributes.name = e.target.value;
    newAttributes[index] = newItemAttributes;

    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newAttributes,
      }),
    );
  };

  const renderCheckBoxLabel = (item: any) => {
    const { basis } = item;
    ///
    let description = '';
    /// must found basis
    if (basis && basis.id) {
      description = basis.name;
      if (!description) {
        /// only conversion don't have name
        description = `${basis.name_1} - ${basis.name_2}`;
      }
      if (basis && basis.type !== 'Conversions' && basis.type !== 'Text') {
        /// count subs
        description += ` (${basis.subs?.length ?? 0})`;
      }
    }

    return (
      <div className={styles.attributeItemCheckBox}>
        <BodyText level={3} customClass="attribute-name">
          {item.name}
        </BodyText>
        <BodyText level={5} fontFamily="Roboto" customClass="attribute-description">
          {description}
        </BodyText>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <CustomCollapse
        defaultActiveKey={'1'}
        customHeaderClass={styles.productAttributeItem}
        expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
        expandIconPosition="right"
        header={
          <InputGroup
            horizontal
            fontLevel={4}
            label={<ScrollIcon />}
            placeholder="type title"
            noWrap
            value={attributeItem.name}
            onChange={onChangeAttributeName}
          />
        }
      >
        <div className="attribute-select-group">
          <div className="attribute-select-group-left" onClick={() => setVisible(true)}>
            <MainTitle level={4} customClass="group-heading-text">
              {POPOVER_TITLE[activeKey]}
            </MainTitle>
            <SingleRightIcon className="single-right-icon" />
          </div>
          <DeleteIcon className="delete-icon" onClick={onDelete} />
        </div>

        {attributeItem.attributes.map((item, key) => (
          <div className={styles.attributeSubItem} key={key}>
            <ProductAttributeSubItem
              item={item}
              attributeItemIndex={key}
              attributeIndex={index}
              attributes={attributes}
              itemAttributes={attributeItem.attributes}
              onItemChange={onItemChange}
              onDelete={deleteAttributeItem(key)}
              activeKey={activeKey}
              attributeGroup={attributeGroup}
              attributeGroupKey={attributeGroupKey}
            />
          </div>
        ))}
      </CustomCollapse>

      <Popover
        title={upperCase(POPOVER_TITLE[activeKey])}
        visible={visible}
        setVisible={setVisible}
        dropdownCheckboxList={map(attributes, (item) => {
          return {
            name: item.name,
            options: item.subs.map((sub) => {
              return {
                label: renderCheckBoxLabel(sub),
                value: sub.id,
              };
            }),
          };
        })}
        dropdownCheckboxTitle={(data) => data.name}
        chosenValue={selected}
        setChosenValue={setSelected}
      />
    </div>
  );
};

export default ProductAttributeItem;
