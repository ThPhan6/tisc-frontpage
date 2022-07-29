import React, { useState, useEffect } from 'react';
import { BodyText, MainTitle } from '@/components/Typography';
import InputGroup from '@/components/EntryForm/InputGroup';
import SubGeneralFeatureAttribute from './SubGeneralFeatureAttribute';
import Popover from '@/components/Modal/Popover';
import CustomCollapse from '@/components/Collapse';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { AttributeGeneralFeature, GeneralFeatureFormInput } from '@/types';
import { POPOVER_TITLE } from '../../constants';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setPartialProductDetail } from '@/reducers/product';
import type { CheckboxValue } from '@/components/CustomCheckbox/types';
import styles from '@/components/Product/styles/details.less';
import { map, upperCase } from 'lodash';

interface GeneralFeatureAttributeItemProps {
  attributes: AttributeGeneralFeature[];
  attributeItem: GeneralFeatureFormInput;
  onDelete?: () => void;
  onItemChange?: (data: GeneralFeatureFormInput['attributes']) => void;
  index: number;
  activeKey: 'general' | 'feature';
}

const GeneralFeatureAttributeItem: React.FC<GeneralFeatureAttributeItemProps> = (props) => {
  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { general_attribute_groups, feature_attribute_groups } = product.details;
  const { attributes, attributeItem, onDelete, onItemChange, index, activeKey } = props;
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
    if (selected) {
      let newAttributes = [...general_attribute_groups];
      if (activeKey === 'feature') {
        newAttributes = [...feature_attribute_groups];
      }
      newAttributes[index] = {
        ...newAttributes[index],
        attributes: selected.map((item, key: number) => {
          /// radio value
          let selectedAttribute: any = {};
          attributes.forEach((attr) => {
            attr.subs.forEach((sub) => {
              if (sub.id === item.value) {
                selectedAttribute = sub;
              }
            });
          });
          const previousData = newAttributes[index].attributes[key];
          const activeData = {
            text: '',
            conversion_value_1: '',
            conversion_value_2: '',
          };
          if (previousData && previousData.id === selectedAttribute.id) {
            activeData.text = previousData.text;
            activeData.conversion_value_1 = previousData.conversion_value_1;
            activeData.conversion_value_2 = previousData.conversion_value_2;
          }

          return {
            id: selectedAttribute.id,
            basis_id: selectedAttribute.basis_id,
            basis_value_id: '',
            type: selectedAttribute.basis?.type ?? 'Text',
            ...activeData,
          };
        }),
      };
      if (activeKey === 'feature') {
        dispatch(
          setPartialProductDetail({
            feature_attribute_groups: newAttributes,
          }),
        );
      } else {
        dispatch(
          setPartialProductDetail({
            general_attribute_groups: newAttributes,
          }),
        );
      }
    }
  }, [selected]);

  const deleteAttributeItem = (key: number) => {
    const newItemAttributes = attributeItem.attributes.filter((_attr, idx) => idx !== key);
    let newAttributes = [...general_attribute_groups];
    if (activeKey === 'feature') {
      newAttributes = [...feature_attribute_groups];
    }
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
    if (activeKey === 'feature') {
      dispatch(
        setPartialProductDetail({
          feature_attribute_groups: newAttributes,
        }),
      );
    } else {
      dispatch(
        setPartialProductDetail({
          general_attribute_groups: newAttributes,
        }),
      );
    }
  };
  const onChangeAttributeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newItemAttributes = { ...attributeItem };
    newItemAttributes.name = e.target.value;
    let newAttributes = [...general_attribute_groups];
    if (activeKey === 'feature') {
      newAttributes = [...feature_attribute_groups];
    }
    newAttributes[index] = newItemAttributes;
    if (activeKey === 'feature') {
      dispatch(
        setPartialProductDetail({
          feature_attribute_groups: newAttributes,
        }),
      );
    } else {
      dispatch(
        setPartialProductDetail({
          general_attribute_groups: newAttributes,
        }),
      );
    }
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
        defaultActiveKey={['1']}
        customHeaderClass={styles.productAttributeItem}
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
            <SubGeneralFeatureAttribute
              item={item}
              attributeItemIndex={key}
              attributeIndex={index}
              attributes={attributes}
              itemAttributes={attributeItem.attributes}
              onItemChange={onItemChange}
              onDelete={() => deleteAttributeItem(key)}
              activeKey={activeKey}
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

export default GeneralFeatureAttributeItem;
