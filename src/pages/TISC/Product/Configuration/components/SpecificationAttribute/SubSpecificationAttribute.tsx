import React, { useState, useEffect } from 'react';
// import { Title } from '@/components/Typography';
import InputGroup from '@/components/EntryForm/InputGroup';
import { CustomInput } from '@/components/Form/CustomInput';
import ConversionInput from '@/components/EntryForm/ConversionInput';
import Popover from '@/components/Modal/Popover';
import { ReactComponent as ActionRightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';
// import {showImageUrl} from '@/helper/utils';
import type { IAttributeSpecification, ISpecificationFormInput, ISubBasisOption } from '@/types';
// import { useDispatch } from 'react-redux';
// import { useAppSelector } from '@/reducers';
// import { setPartialProductDetail } from '@/reducers/product';
import styles from './styles/index.less';

interface ISubGeneralFeatureAttribute {
  attributes: IAttributeSpecification[];
  itemAttributes: ISpecificationFormInput['attributes'];
  item: ISpecificationFormInput['attributes'][0];
  onDelete?: () => void;
  onItemChange?: (data: ISpecificationFormInput['attributes']) => void;
  attributeIndex: number;
  attributeItemIndex: number;
}

const SubGeneralFeatureAttribute: React.FC<ISubGeneralFeatureAttribute> = (props) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<any>();
  const {
    itemAttributes,
    attributes,
    item,
    onDelete,
    onItemChange,
    attributeItemIndex,
    // attributeIndex,
  } = props;

  // const product = useAppSelector((state) => state.product);
  // const dispatch = useDispatch();
  // const {specification_attribute_groups} = product.details;

  // get current attribute
  let currentAttribute: any = {};
  attributes.forEach((attribute) => {
    attribute.subs?.map((sub) => {
      if (sub.basis_id === item.basis_id) {
        currentAttribute = sub;
      }
    });
  });
  /// basis of attribute
  const { basis } = currentAttribute;

  useEffect(() => {
    if (selected) {
      // const newAttributes = [...specification_attribute_groups];
      // const newItemAttributes = [...newAttributes[attributeIndex].attributes];
      // newItemAttributes[attributeItemIndex] = {
      //   ...newItemAttributes[attributeItemIndex],
      //   basis_value_id: selected.value,
      //   text: selected.label as string,
      // }
      // newAttributes[attributeIndex] = {
      //   ...newAttributes[attributeIndex],
      //   attributes: newItemAttributes
      // }
      // if (activeKey === 'feature') {
      //   dispatch(setPartialProductDetail({
      //     feature_attribute_groups: newAttributes
      //   }));
      // } else {
      //   dispatch(setPartialProductDetail({
      //     general_attribute_groups: newAttributes
      //   }));
      // }
    }
  }, [selected]);

  const onChangeAttributeItem = (
    key: number,
    data: Partial<ISpecificationFormInput['attributes'][0]>,
  ) => {
    const newGeneralAttributeItem = [...itemAttributes];
    newGeneralAttributeItem[key] = {
      ...newGeneralAttributeItem[key],
      ...data,
    };
    if (onItemChange) {
      onItemChange(newGeneralAttributeItem);
    }
  };

  const renderProductAttributeItem = () => {
    if (!basis) {
      return null;
    }
    let placeholder = 'type title';
    if (basis.type !== 'Conversions' && basis.type !== 'Text') {
      placeholder = basis.name;
    }
    if (basis?.type === 'Conversions') {
      return (
        <ConversionInput
          horizontal
          noWrap
          fontLevel={4}
          label={currentAttribute?.name ?? 'N/A'}
          conversionData={basis}
          deleteIcon
          onDelete={onDelete}
          conversionValue={{
            firstValue: item.conversion_value_1,
            secondValue: item.conversion_value_2,
          }}
          setConversionValue={(data) => {
            onChangeAttributeItem(attributeItemIndex, {
              conversion_value_1: data.firstValue,
              conversion_value_2: data.secondValue,
            });
          }}
        />
      );
    }

    return (
      <InputGroup
        horizontal
        fontLevel={4}
        label={currentAttribute?.name ?? 'N/A'}
        placeholder={placeholder}
        rightIcon={
          basis?.type === 'Options' ? (
            <ActionRightLeftIcon onClick={() => setVisible(true)} />
          ) : (
            false
          )
        }
        onRightIconClick={basis?.type === 'Options' ? () => setVisible(true) : undefined}
        deleteIcon
        onDelete={onDelete}
        noWrap
        value={item.text}
        onChange={(e) => {
          onChangeAttributeItem(attributeItemIndex, {
            text: e.target.value,
          });
        }}
      />
    );
  };

  const renderOptionLabel = (option: ISubBasisOption, index: number) => {
    return (
      <div className={styles.defaultOptionList}>
        <div className="group-option-name">
          <span className="value">{option.value_1}</span>
          <span>{option.unit_1}</span>
        </div>
        <div className="group-option-name">
          <span className="value">{option.value_2}</span>
          <span>{option.unit_2}</span>
        </div>
        <span className="product-id-label">Product ID:</span>
        <CustomInput
          placeholder="type here"
          className="product-id-input"
          fontLevel={6}
          // value={value}
          // onChange={(e) => setValue(e.target.value)}
          tabIndex={index}
        />
      </div>
    );
  };
  console.log(currentAttribute);
  return (
    <div style={{ width: '100%' }}>
      {renderProductAttributeItem()}
      <Popover
        title="OPTION"
        visible={visible}
        setVisible={setVisible}
        checkboxList={{
          heading: basis?.name ?? 'N/A',
          options:
            currentAttribute?.basis?.subs?.map((sub: any, index: number) => {
              return {
                label: renderOptionLabel(sub, index),
                value: sub.id,
              };
            }) ?? [],
        }}
        chosenValue={selected}
        setChosenValue={setSelected}
      />
    </div>
  );
};

export default SubGeneralFeatureAttribute;
