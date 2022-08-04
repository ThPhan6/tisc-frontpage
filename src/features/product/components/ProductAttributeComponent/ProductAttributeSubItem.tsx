import React, { useState, useEffect } from 'react';
import { BodyText, Title } from '@/components/Typography';
import InputGroup from '@/components/EntryForm/InputGroup';
import ConversionInput from '@/components/EntryForm/ConversionInput';
import Popover from '@/components/Modal/Popover';
import { ReactComponent as ActionRightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';
import type { ProductAttributeFormInput, ProductAttributeProps } from '@/features/product/types';
import type { ProductAttributes, SubBasisOption } from '@/types';
import { useDispatch } from 'react-redux';
import { setPartialProductDetail } from '@/features/product/reducers';
import type { RadioValue } from '@/components/CustomRadio/types';
import { truncate } from 'lodash';
import { ProductInfoTab } from './types';
import { AttributeGroupKey } from './ProductAttributeItem';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { CustomInput } from '@/components/Form/CustomInput';
import { showImageUrl } from '@/helper/utils';
import styles from './ProductAttributeSubItem.less';

interface ProductAttributeSubItemProps {
  attributes: ProductAttributes[];
  itemAttributes: ProductAttributeProps[];
  item: ProductAttributeProps;
  onDelete?: () => void;
  onItemChange?: (data: ProductAttributeProps[]) => void;
  attributeIndex: number;
  attributeItemIndex: number;
  activeKey: ProductInfoTab;
  attributeGroup: ProductAttributeFormInput[];
  attributeGroupKey: AttributeGroupKey;
}

export const ProductAttributeSubItem: React.FC<ProductAttributeSubItemProps> = ({
  itemAttributes,
  attributes,
  item,
  onDelete,
  onItemChange,
  attributeItemIndex,
  attributeIndex,
  activeKey,
  attributeGroup,
  attributeGroupKey,
}) => {
  const dispatch = useDispatch();

  const isSpecification = activeKey === 'specification';

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
  const [selectedSpecified, setSelectedSpecified] = useState<CheckboxValue[]>(
    localAttribute?.basis_options?.map((opt) => {
      return {
        label: '',
        value: opt.id,
      };
    }) ?? [],
  );
  const [basisOptions, setBasisOptions] = useState<
    {
      id: string;
      option_code: string;
    }[]
  >(localAttribute?.basis_options ?? []);

  const selectedItem = isSpecification ? selectedSpecified : selected;
  const setSelectedItem = isSpecification ? setSelectedSpecified : setSelected;

  useEffect(() => {
    if (!selected || isSpecification) {
      return;
    }

    const newAttributes = [...attributeGroup];
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

    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newAttributes,
      }),
    );
  }, [selected, isSpecification]);

  useEffect(() => {
    if (!selectedSpecified || !isSpecification) {
      return;
    }

    const newAttributes = [...attributeGroup];
    const newItemAttributes = [...newAttributes[attributeIndex].attributes];

    const activeBasisOptions = selectedSpecified.map((itemSelected) => {
      const changedBasisOption = basisOptions.find((option) => option.id === itemSelected.value);
      if (changedBasisOption) {
        return changedBasisOption;
      }
      return {
        id: String(itemSelected.value),
        option_code: '',
      };
    });
    newItemAttributes[attributeItemIndex] = {
      ...newItemAttributes[attributeItemIndex],
      basis_options: activeBasisOptions,
      text:
        activeBasisOptions.length > 0
          ? `Selected ${activeBasisOptions.length} item${activeBasisOptions.length > 1 ? 's' : ''}`
          : '',
    };
    newAttributes[attributeIndex] = {
      ...newAttributes[attributeIndex],
      attributes: newItemAttributes,
    };

    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newAttributes,
      }),
    );
  }, [selectedSpecified, isSpecification]);

  const onChangeAttributeItem = (key: number, data: Partial<ProductAttributeProps>) => {
    if (onItemChange) {
      const newGeneralAttributeItem = [...itemAttributes];
      newGeneralAttributeItem[key] = {
        ...newGeneralAttributeItem[key],
        ...data,
      };
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
          basis?.type === 'Presets' || basis?.type === 'Options' ? (
            <ActionRightLeftIcon onClick={() => setVisible(true)} />
          ) : null
        }
        onRightIconClick={
          basis?.type === 'Presets' || basis?.type === 'Options'
            ? () => setVisible(true)
            : undefined
        }
        deleteIcon
        onDelete={() => {
          if (isSpecification) {
            setSelectedSpecified([]);
            setBasisOptions([]);
          }
          onDelete?.();
        }}
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

  const renderOptionLabel = (option: SubBasisOption, index: number) => {
    if (!option.image || option.image == '') {
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
            value={basisOptions[index]?.option_code ?? ''}
            onChange={(e) => {
              const newBasisOptions = [...basisOptions];
              newBasisOptions[index] = {
                id: option.id as string,
                option_code: e.target.value,
              };
              setBasisOptions(newBasisOptions);
            }}
            tabIndex={index}
          />
        </div>
      );
    }
    return (
      <div className={styles.defaultOptionImageList}>
        <img src={showImageUrl(option.image)} />
        <div className="option-image-list-wrapper">
          <BodyText level={6} fontFamily="Roboto" customClass="heading-option-group">
            {option.value_1} - {option.value_2}
          </BodyText>
          <div className="product-input-group">
            <span className="product-id-label">Product ID:</span>
            <CustomInput
              placeholder="type here"
              className="product-id-input"
              fontLevel={6}
              value={basisOptions[index]?.option_code ?? ''}
              onChange={(e) => {
                const newBasisOptions = [...basisOptions];
                newBasisOptions[index] = {
                  id: option.id as string,
                  option_code: e.target.value,
                };
                setBasisOptions(newBasisOptions);
              }}
              tabIndex={index}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      {renderProductAttributeItem()}
      <Popover
        title={isSpecification ? 'OPTION' : 'PRESET'}
        visible={visible}
        setVisible={setVisible}
        checkboxList={
          isSpecification
            ? {
                heading: basis?.name ?? 'N/A',
                customItemClass: styles.customItemClass,
                options:
                  currentAttribute?.basis?.subs?.map((sub: any, index: number) => {
                    return {
                      label: renderOptionLabel(sub, index),
                      value: sub.id,
                    };
                  }) ?? [],
              }
            : undefined
        }
        groupRadioList={
          isSpecification
            ? undefined
            : [
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
              ]
        }
        chosenValue={selectedItem}
        setChosenValue={setSelectedItem}
        className={styles.specificationOptionCheckbox}
      />
    </div>
  );
};
