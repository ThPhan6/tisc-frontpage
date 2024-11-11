import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ReactComponent as ActionRightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';

import { capitalize } from 'lodash';

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

import { AttributeOptionLabel } from './CommonAttribute';
import styles from './ProductAttributeSubItem.less';

interface Props {
  attributes: ProductAttributes[];
  onDelete?: () => void;
  onItemChange?: (data: ProductAttributeProps[]) => void;
  attributeGroupIndex: number;
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

export const getConversionText = (content: {
  value_1: string;
  unit_1?: string;
  value_2?: string;
  unit_2?: string;
}) => {
  if (!content) {
    return '';
  }

  const valueUnit_1 = `${content.value_1}${content.unit_1 ? ' ' + content.unit_1 : ''}`;
  const valueUnit_2 = `${content.value_2}${content.unit_2 ? ' ' + content.unit_2 : ''}`;
  const hyphen = content.value_1 && content.value_2 ? ' - ' : '';

  return `${valueUnit_1}${hyphen}${valueUnit_2}`;
};

export const ProductAttributeSubItem: React.FC<Props> = ({
  onDelete,
  onItemChange,
  attributeGroup,
  attributeGroupIndex,
  attributeItemIndex,
  attributes,
  activeKey,
  attributeGroupKey,
}) => {
  const dispatch = useDispatch();

  const isSpecification = activeKey === 'specification';

  const attributeItems = attributeGroup[attributeGroupIndex].attributes;
  const attributeItem = attributeGroup[attributeGroupIndex].attributes[attributeItemIndex];

  const [visible, setVisible] = useState<boolean>(false);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const [curAttributeData, setCurAttributeData] = useState<any>();
  /// using for option have type Text and Conversion
  const [selected, setSelected] = useState<RadioValue>({
    label: attributeItem?.text ?? '',
    value: attributeItem?.basis_value_id ?? '',
  });

  /// current basis option select
  const [basisOptionSelected, setBasisOptionSelected] = useState<CheckboxValue[]>([]);

  /// basis option selected
  const [basisOptions, setBasisOptions] = useState<SubBasisOption[]>([]);

  const [chosenValue, setChosenValue] = useState<any>(
    isSpecification
      ? /// using for basis option selected, type is Option
        basisOptionSelected.map((opt) => ({
          value: opt.value,
          label: String(opt.label),
        }))
      : /// another sub selected, type are Text and Conversion
        {
          value: selected.value,
          label: selected.label,
        },
  );

  useEffect(() => {
    setBasisOptionSelected(
      attributeItem?.basis_options?.map((opt) => ({
        label: opt.option_code,
        value: opt.id,
      })) ?? [],
    );

    let currentAttribute = {} as any;
    // get current attribute
    attributes.forEach((attribute) => {
      attribute.subs?.forEach((sub) => {
        if (sub.id === attributeItem.id) {
          /// add option_code field to currentAttribute has type Option,
          const subBasisOption = sub.basis.subs?.map((subBasis) => {
            if (sub.basis.type !== 'Options') {
              return subBasis;
            }

            /// mapping data from attribute data selected to all attributes existed
            if (attributeItem.basis_options?.some((opt) => opt.id === subBasis.id)) {
              return {
                ...subBasis,
                option_code:
                  attributeItem.basis_options.find((opt) => opt.id === subBasis.id)?.option_code ||
                  subBasis.product_id,
              };
            } else {
              return {
                ...subBasis,
                option_code: subBasis.product_id,
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
    setCurAttributeData(currentAttribute);

    setBasisOptions(currentAttribute.basis?.subs);

    if (!isSpecification) {
      const foundSub = currentAttribute.basis?.subs?.find(
        (sub) =>
          attributeItem.text.includes(sub.value_1) && attributeItem.text.includes(sub.value_2),
      );
      const mappedSelected = { label: attributeItem?.text ?? '', value: foundSub?.id ?? '' };
      setSelected(mappedSelected);
      setChosenValue(mappedSelected);
    }
  }, []);

  useEffect(() => {
    if (!selected || isSpecification) {
      return;
    }

    const newAttributes = [...attributeGroup];
    const newItemAttributes = [...newAttributes[attributeGroupIndex].attributes];

    newItemAttributes[attributeItemIndex] = {
      ...newItemAttributes[attributeItemIndex],
      basis_value_id: String(selected.value),
      text: selected.label as string,
    };

    newAttributes[attributeGroupIndex] = {
      ...newAttributes[attributeGroupIndex],
      attributes: newItemAttributes,
    };

    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newAttributes,
      }),
    );
  }, [selected, isSpecification]);

  useEffect(() => {
    if (!basisOptionSelected || !isSpecification) {
      return;
    }

    const newAttributes = [...attributeGroup];
    const newItemAttributes = [...newAttributes[attributeGroupIndex].attributes];

    const activeBasisOptions = basisOptionSelected.map((itemSelected) => {
      const changedBasisOption = basisOptions?.find((option) => option?.id === itemSelected.value);

      if (changedBasisOption) {
        return {
          ...changedBasisOption,
        };
      }

      return {
        ...(changedBasisOption as any),
        id: itemSelected.value as string,
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

    newAttributes[attributeGroupIndex] = {
      ...newAttributes[attributeGroupIndex],
      attributes: newItemAttributes,
    };

    /// update attribute basis option selected
    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newAttributes,
      }),
    );
  }, [basisOptionSelected, isSpecification]);

  const onChangeAttributeItem = (key: number, data: Partial<ProductAttributeProps>) => {
    if (onItemChange) {
      const newGeneralAttributeItem = [...attributeItems];
      newGeneralAttributeItem[key] = {
        ...newGeneralAttributeItem[key],
        ...data,
      };

      onItemChange(newGeneralAttributeItem);
    }
  };

  const getAttributeTextSelected = () => {
    if (
      attributeItem.type !== 'Options' ||
      (attributeItem.type === 'Options' &&
        attributeItem.basis_options?.length &&
        attributeItem.text)
    ) {
      return attributeItem.text;
    }

    return '';
  };

  const renderProductAttributeItem = () => {
    if (!curAttributeData?.basis) {
      return null;
    }

    let placeholder = 'type title';
    if (curAttributeData.basis.type !== 'Conversions' && curAttributeData.basis.type !== 'Text') {
      placeholder = curAttributeData.basis.name;
    }

    if (curAttributeData?.basis?.type === 'Conversions') {
      return (
        <ConversionInput
          horizontal
          isTableFormat
          noWrap
          autoWidth
          defaultWidth={
            attributeItem.conversion_value_1.length * 10 ||
            attributeItem.conversion_value_2.length * 10 ||
            30
          }
          fontLevel={4}
          label={curAttributeData?.name ?? 'N/A'}
          labelTitle={capitalize(curAttributeData?.name)}
          conversionData={curAttributeData?.basis}
          deleteIcon
          onDelete={onDelete}
          conversionValue={{
            firstValue: attributeItem.conversion_value_1,
            secondValue: attributeItem.conversion_value_2,
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
        autoResize={curAttributeData.basis.type === 'Text'}
        fontLevel={4}
        containerClass={styles.containerClass}
        label={curAttributeData?.name ?? 'N/A'}
        labelTitle={capitalize(curAttributeData?.name)}
        placeholder={placeholder}
        rightIcon={
          curAttributeData?.basis?.type === 'Presets' ||
          curAttributeData?.basis?.type === 'Options' ? (
            <ActionRightLeftIcon onClick={() => setVisible(true)} />
          ) : null
        }
        onRightIconClick={
          curAttributeData?.basis?.type === 'Presets' || curAttributeData?.basis?.type === 'Options'
            ? () => setVisible(true)
            : undefined
        }
        deleteIcon
        onDelete={() => {
          if (isSpecification) {
            setBasisOptionSelected([]);
            setBasisOptions([]);
          }
          onDelete?.();
        }}
        noWrap
        value={getAttributeTextSelected()}
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
      <div className="flex-start">
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

            // dont update current basis option select,
            // disable check
            setFirstLoad(false);

            // update data
            setBasisOptions(newBasisOptions);
          }}
        />
      </div>
    );
  };

  return (
    <>
      {renderProductAttributeItem()}

      <Popover
        title={isSpecification ? 'COMPONENTS' : 'PRESET'}
        width={1152}
        secondaryModal
        visible={visible}
        setVisible={setVisible}
        className={styles.specificationOptionCheckbox}
        chosenValue={chosenValue}
        forceUpdateCurrentValue={firstLoad}
        setChosenValue={(valueSelected) => {
          if (!valueSelected || !String(valueSelected?.label)) {
            return;
          }

          const currentAttributeItemSelect = curAttributeData?.basis?.subs?.find(
            (sub: any) => sub.id === valueSelected.value,
          );

          const attributeContent: string = getConversionText(currentAttributeItemSelect);

          if (isSpecification) {
            setBasisOptionSelected(
              valueSelected?.map((opt: CheckboxValue) => ({
                ...opt,
                label: attributeContent,
              })),
            );
          } else {
            setSelected({
              value: valueSelected.value,
              label: attributeContent,
            });
          }
        }}
        checkboxList={
          isSpecification
            ? {
                // heading: curAttributeData?.basis?.name ?? 'N/A',
                heading: (
                  <Title
                    level={7}
                    customClass={`preset-option-heading text-capitalize ${styles.presetOptionTitle}`}
                  >
                    {curAttributeData?.basis?.name ?? 'N/A'}
                  </Title>
                ),
                customItemClass: styles.customItemClass,
                isSelectAll: true,
                options:
                  basisOptions?.map((sub: any, index: number) => {
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
                      level={7}
                      customClass={`preset-option-heading text-capitalize ${styles.presetOptionTitle}`}
                    >
                      {curAttributeData?.basis?.name ?? 'N/A'}
                    </Title>
                  ),
                  options:
                    curAttributeData?.basis?.subs
                      ?.sort((a: any, b: any) => {
                        const nameA = a?.value_1?.toUpperCase();
                        const nameB = b?.value_1?.toUpperCase();
                        if (nameA < nameB) {
                          return -1;
                        }
                        if (nameA > nameB) {
                          return 1;
                        }

                        return 0;
                      })
                      ?.map((sub: any, index: number) => {
                        return {
                          value: sub.id,
                          label: <AttributeOptionLabel option={sub} key={index} />,
                        };
                      }) ?? [],
                },
              ]
        }
      />
    </>
  );
};
