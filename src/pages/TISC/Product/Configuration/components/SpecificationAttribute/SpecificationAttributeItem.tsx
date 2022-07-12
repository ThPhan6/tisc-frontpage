import React, { useState, useEffect } from 'react';
// import {useBoolean} from '@/helper/hook';
import { BodyText, MainTitle } from '@/components/Typography';
import InputGroup from '@/components/EntryForm/InputGroup';
import SubSpecificationAttribute from './SubSpecificationAttribute';
import Popover from '@/components/Modal/Popover';
// import { CustomInput } from '@/components/Form/CustomInput';
// import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { Collapse } from 'antd';
import { IAttributeSpecification, ISpecificationFormInput } from '@/types';
import { POPOVER_TITLE } from '../../constants';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setPartialProductDetail } from '@/reducers/product';

import styles from '../../styles/details.less';
import { map, upperCase } from 'lodash';
// import {createCollection, getCollectionByBrandId} from '@/services';
// import type {IBrandDetail, ICollection} from '@/types';

interface IGeneralFeatureAttributeItem {
  attributes: IAttributeSpecification[];
  attributeItem: ISpecificationFormInput;
  onDelete?: () => void;
  onItemChange?: (data: ISpecificationFormInput['attributes']) => void;
  index: number;
}

const GeneralFeatureAttributeItem: React.FC<IGeneralFeatureAttributeItem> = (props) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<any>();
  const [activeAttribute, setActiveAttribute] = useState(-1);
  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { specification_attribute_groups } = product.details;
  const { attributes, attributeItem, onDelete, onItemChange, index } = props;

  useEffect(() => {
    if (selected) {
      const newAttributes = [...specification_attribute_groups];
      newAttributes[activeAttribute] = {
        ...newAttributes[activeAttribute],
        attributes: selected.map((item: any, key: number) => {
          /// radio value
          let selectedAttribute: any = {};
          attributes.forEach((attr) => {
            attr.subs.forEach((sub) => {
              if (sub.id === item.value) {
                selectedAttribute = sub;
              }
            });
          });
          const previousData = newAttributes[activeAttribute][key];
          const activeData = {
            text: '',
            conversion_value_1: '',
            conversion_value_2: '',
            basis_options: [],
          };
          if (previousData && previousData.id === selectedAttribute.id) {
            activeData.text = previousData.text;
            activeData.conversion_value_1 = previousData.conversion_value_1;
            activeData.conversion_value_2 = previousData.conversion_value_2;
            activeData.basis_options = previousData.basis_options;
          }

          return {
            id: selectedAttribute.id,
            basis_id: selectedAttribute.basis_id,
            type: selectedAttribute.basis?.type ?? 'Text',
            ...activeData,
          };
        }),
      };
      dispatch(
        setPartialProductDetail({
          specification_attribute_groups: newAttributes,
        }),
      );
    }
  }, [selected]);

  const deleteAttributeItem = (key: number) => {
    const newItemAttributes = attributeItem.attributes.filter((_attr, idx) => idx !== key);
    const newAttributes = [...specification_attribute_groups];
    newAttributes[index] = {
      ...newAttributes[index],
      attributes: newItemAttributes,
    };
    dispatch(
      setPartialProductDetail({
        specification_attribute_groups: newAttributes,
      }),
    );
  };
  const onChangeAttributeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newItemAttributes = { ...attributeItem };
    newItemAttributes.name = e.target.value;
    const newAttributes = [...specification_attribute_groups];
    newAttributes[index] = newItemAttributes;
    dispatch(
      setPartialProductDetail({
        specification_attribute_groups: newAttributes,
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
      <Collapse
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
        expandIconPosition="right"
      >
        <Collapse.Panel
          key="1"
          className={styles.productAttributeItem}
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
            <div
              className="attribute-select-group-left"
              onClick={() => {
                setSelected(() => {
                  return attributeItem.attributes.map((attr) => {
                    return {
                      label: '',
                      value: attr.id,
                    };
                  });
                });
                setActiveAttribute(index);
                setVisible(true);
              }}
            >
              <MainTitle level={4} customClass="group-heading-text">
                {POPOVER_TITLE.specification}
              </MainTitle>
              <SingleRightIcon className="single-right-icon" />
            </div>
            <DeleteIcon className="delete-icon" onClick={onDelete} />
          </div>
          {attributeItem.attributes.map((item, key) => (
            <div className={styles.attributeSubItem} key={key}>
              <SubSpecificationAttribute
                item={item}
                attributeItemIndex={key}
                attributeIndex={index}
                attributes={attributes}
                itemAttributes={attributeItem.attributes}
                onItemChange={onItemChange}
                onDelete={() => deleteAttributeItem(key)}
              />
            </div>
          ))}
        </Collapse.Panel>
      </Collapse>
      <Popover
        title={upperCase(POPOVER_TITLE.specification)}
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
