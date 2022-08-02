import React, { useState, useEffect } from 'react';
import { Title } from '@/components/Typography';
import InputGroup from '@/components/EntryForm/InputGroup';
import ConversionInput from '@/components/EntryForm/ConversionInput';
import Popover from '@/components/Modal/Popover';
import { ReactComponent as ActionRightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';
import type { GeneralFeatureFormInput } from '@/features/product/types';
import type { AttributeGeneralFeature } from '@/types';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setPartialProductDetail } from '@/features/product/reducers';
import type { RadioValue } from '@/components/CustomRadio/types';
import { truncate } from 'lodash';

interface GeneralFeatureAttributeSubItemProps {
  attributes: AttributeGeneralFeature[];
  itemAttributes: GeneralFeatureFormInput['attributes'];
  item: GeneralFeatureFormInput['attributes'][0];
  onDelete?: () => void;
  onItemChange?: (data: GeneralFeatureFormInput['attributes']) => void;
  attributeIndex: number;
  attributeItemIndex: number;
  activeKey: 'general' | 'feature';
}

const GeneralFeatureAttributeSubItem: React.FC<GeneralFeatureAttributeSubItemProps> = (props) => {
  const {
    itemAttributes,
    attributes,
    item,
    onDelete,
    onItemChange,
    attributeItemIndex,
    attributeIndex,
    activeKey,
  } = props;

  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { general_attribute_groups, feature_attribute_groups } = product.details;

  // get current attribute
  let currentAttribute = {} as any;
  attributes.forEach((attribute) => {
    attribute.subs?.map((sub) => {
      if (sub.id === item.id) {
        currentAttribute = sub;
      }
    });
  });
  /// basis of attribute
  const { basis } = currentAttribute;
  /// global state of current attribute
  const localAttribute = itemAttributes.find((attr) => currentAttribute.id === attr.id);

  /// default state
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<RadioValue>({
    label: localAttribute?.text ?? '',
    value: localAttribute?.basis_value_id ?? '',
  });

  useEffect(() => {
    if (selected) {
      let newAttributes = [...general_attribute_groups];
      if (activeKey === 'feature') {
        newAttributes = [...feature_attribute_groups];
      }
      const newItemAttributes = [...newAttributes[attributeIndex].attributes];
      newItemAttributes[attributeItemIndex] = {
        ...newItemAttributes[attributeItemIndex],
        basis_value_id: String(selected.value),
        text: selected.label as string,
      };
      newAttributes[attributeIndex] = {
        ...newAttributes[attributeIndex],
        attributes: newItemAttributes,
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

  const onChangeAttributeItem = (
    key: number,
    data: Partial<GeneralFeatureFormInput['attributes'][0]>,
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
          label={currentAttribute?.name ? truncate(currentAttribute.name, { length: 20 }) : 'N/A'}
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
        label={currentAttribute?.name ? truncate(currentAttribute.name, { length: 20 }) : 'N/A'}
        placeholder={placeholder}
        rightIcon={
          basis?.type === 'Presets' ? (
            <ActionRightLeftIcon onClick={() => setVisible(true)} />
          ) : (
            false
          )
        }
        onRightIconClick={basis?.type === 'Presets' ? () => setVisible(true) : undefined}
        deleteIcon
        onDelete={onDelete}
        noWrap
        value={item.text}
        onChange={(e) => {
          onChangeAttributeItem(attributeItemIndex, {
            text: e.target.value,
          });
        }}
        forceDisplayDeleteIcon
      />
    );
  };
  return (
    <div style={{ width: '100%' }}>
      {renderProductAttributeItem()}
      <Popover
        title="PRESET"
        visible={visible}
        setVisible={setVisible}
        groupRadioList={[
          {
            heading: (
              <Title level={8} customClass="preset-option-heading">
                {basis?.name ?? 'N/A'}
              </Title>
            ),
            options:
              currentAttribute?.basis?.subs?.map((sub: any) => {
                return {
                  label: sub.value_1,
                  value: sub.id,
                };
              }) ?? [],
          },
        ]}
        chosenValue={selected}
        setChosenValue={setSelected}
      />
    </div>
  );
};

export default GeneralFeatureAttributeSubItem;
