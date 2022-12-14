import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ReactComponent as ActionRightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';

import { truncate } from 'lodash';

import { AttributeGroupKey, ProductInfoTab } from './types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import type { RadioValue } from '@/components/CustomRadio/types';
import { setPartialProductDetail } from '@/features/product/reducers';
import type { ProductAttributeFormInput, ProductAttributeProps } from '@/features/product/types';
import type { ProductAttributes, SubBasisOption } from '@/types';

import ConversionInput from '@/components/EntryForm/ConversionInput';
import InputGroup from '@/components/EntryForm/InputGroup';
import { CustomInput } from '@/components/Form/CustomInput';
import Popover from '@/components/Modal/Popover';
import { Title } from '@/components/Typography';

import { AttributeOptionLabel } from './AttributeComponent';
import styles from './AttributeItem.less';

interface Props {
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

const getBasisOptionsText = (activeBasisOptions: { id: string; option_code: string }[]) => {
  if (activeBasisOptions.length > 0) {
    return `Selected ${activeBasisOptions.length} item${activeBasisOptions.length > 1 ? 's' : ''}`;
  }
  return '';
};

export const ProductAttributeSubItem: React.FC<Props> = ({
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
    attribute.subs?.forEach((sub) => {
      if (sub.id === item.id) {
        const subBasisOption = sub.basis.subs?.map((subBasis) => {
          if (sub.basis.type !== 'Options') {
            return subBasis;
          }

          if (item.basis_options?.some((opt) => opt.id === subBasis.id)) {
            return {
              ...subBasis,
              option_code: item.basis_options.find((opt) => opt.id === subBasis.id)?.option_code,
            };
          } else {
            return {
              ...subBasis,
              option_code: '',
            };
          }
        });

        const newSub = {
          ...sub,
          basis: {
            ...sub.basis,
            subs: subBasisOption,
          },
        };

        currentAttribute = newSub;
      }
    });
  });

  /// basis of attribute
  const { basis } = currentAttribute;

  /// default state
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<RadioValue>({
    label: item?.text ?? '',
    value: item?.basis_value_id ?? '',
  });

  /// current basis option select
  const [selectedSpecified, setSelectedSpecified] = useState<CheckboxValue[]>(
    item?.basis_options?.map((opt) => {
      return {
        label: opt.option_code,
        value: opt.id,
      };
    }) ?? [],
  );

  /// basis option selected
  const [basisOptions, setBasisOptions] = useState<SubBasisOption[]>(
    currentAttribute.basis.subs ?? [],
  );

  const chosenValue = isSpecification
    ? /// using for basis option selected, type is Option
      selectedSpecified.map((opt) => ({
        value: opt.value,
        label: String(opt.label),
      }))
    : /// another sub selected, type are Text and Conversion
      {
        value: selected.value,
        label: selected.label,
      };

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
      const changedBasisOption = basisOptions.find((option) => option?.id === itemSelected.value);
      if (changedBasisOption) {
        return {
          id: changedBasisOption.id || '',
          option_code: changedBasisOption.option_code || '',
        };
      }

      return {
        id: itemSelected.value as string,
        option_code: '',
      };
    });

    newItemAttributes[attributeItemIndex] = {
      ...newItemAttributes[attributeItemIndex],
      basis_options: activeBasisOptions,
      text:
        newItemAttributes[attributeItemIndex].type === 'Options'
          ? getBasisOptionsText(activeBasisOptions)
          : newItemAttributes[attributeItemIndex].text,
    };
    newAttributes[attributeIndex] = {
      ...newAttributes[attributeIndex],
      attributes: newItemAttributes,
    };

    /// update attribute basis option selected
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
          isTableFormat
          noWrap
          autoWidth
          defaultWidth={
            item.conversion_value_1.length * 10 || item.conversion_value_2.length * 10 || 30
          }
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
        isTableFormat
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

  const renderSubBasisOption = (index: number, option: SubBasisOption) => {
    return (
      <>
        <span className="product-id-label">Product ID:</span>
        <CustomInput
          placeholder="type here"
          className="product-id-input"
          fontLevel={6}
          tabIndex={index}
          value={option.option_code}
          onChange={(e) => {
            const newBasisOptions = [...basisOptions];
            newBasisOptions[index] = {
              ...newBasisOptions[index],
              option_code: e.target.value,
            };

            // update data
            setBasisOptions(newBasisOptions);
          }}
        />
      </>
    );
  };

  return (
    <>
      {renderProductAttributeItem()}

      <Popover
        title={isSpecification ? 'OPTION' : 'PRESET'}
        visible={visible}
        setVisible={setVisible}
        className={styles.specificationOptionCheckbox}
        chosenValue={chosenValue}
        forceUpdateCurrentValue={false}
        setChosenValue={(valueSelected) => {
          if (!valueSelected || !String(valueSelected?.label)) {
            return;
          }

          if (isSpecification) {
            setSelectedSpecified(
              valueSelected?.map((opt: CheckboxValue) => ({
                ...opt,
                label: String(opt.label),
              })),
            );
          } else {
            setSelected(valueSelected);
          }
        }}
        checkboxList={
          isSpecification
            ? {
                heading: basis?.name ?? 'N/A',
                customItemClass: styles.customItemClass,
                options:
                  basisOptions.map((sub: any, index: number) => {
                    return {
                      value: sub.id,
                      label: (
                        <AttributeOptionLabel option={sub} key={index}>
                          {renderSubBasisOption(index, sub)}
                        </AttributeOptionLabel>
                      ),
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
                    <Title
                      level={8}
                      customClass={`preset-option-heading ${styles.presetOptionTitle}`}>
                      {basis?.name ?? 'N/A'}
                    </Title>
                  ),
                  options:
                    basis?.subs?.map((sub: any) => {
                      return {
                        label: sub.value_1,
                        value: sub.id,
                      };
                    }) ?? [],
                },
              ]
        }
      />
    </>
  );
};
