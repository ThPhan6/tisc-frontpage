import React, { useState, useEffect } from 'react';
import { BodyText } from '@/components/Typography';
import InputGroup from '@/components/EntryForm/InputGroup';
import { CustomInput } from '@/components/Form/CustomInput';
import ConversionInput from '@/components/EntryForm/ConversionInput';
import Popover from '@/components/Modal/Popover';
import { ReactComponent as ActionRightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';
import { showImageUrl } from '@/helper/utils';
import type { IAttributeSpecification, ISpecificationFormInput, ISubBasisOption } from '@/types';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setPartialProductDetail } from '@/reducers/product';
import type { CheckboxValue } from '@/components/CustomCheckbox/types';
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
  const {
    itemAttributes,
    attributes,
    item,
    onDelete,
    onItemChange,
    attributeItemIndex,
    attributeIndex,
  } = props;

  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { specification_attribute_groups } = product.details;
  // get current attribute data
  let currentAttribute: any = {};
  attributes.forEach((attribute) => {
    attribute.subs?.map((sub) => {
      if (sub.id === item.id) {
        currentAttribute = sub;
      }
    });
  });

  /// basis of attribute data
  const { basis } = currentAttribute;
  /// global state of current attribute
  const localAttribute = itemAttributes.find((attr) => currentAttribute.id === attr.id);
  /// default state
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<CheckboxValue[]>(
    localAttribute?.basis_options.map((opt) => {
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
  useEffect(() => {
    if (selected) {
      const newAttributes = [...specification_attribute_groups];
      const newItemAttributes = [...newAttributes[attributeIndex].attributes];
      const activeBasisOptions = selected.map((itemSelected: any) => {
        const changedBasisOption = basisOptions.find((option) => option.id === itemSelected.value);
        if (changedBasisOption) {
          return changedBasisOption;
        }
        return {
          id: itemSelected.value,
          option_code: '',
        };
      });
      newItemAttributes[attributeItemIndex] = {
        ...newItemAttributes[attributeItemIndex],
        basis_options: activeBasisOptions,
        text:
          activeBasisOptions.length > 0
            ? `Selected ${activeBasisOptions.length} item${
                activeBasisOptions.length > 1 ? 's' : ''
              }`
            : '',
      };
      newAttributes[attributeIndex] = {
        ...newAttributes[attributeIndex],
        attributes: newItemAttributes,
      };
      dispatch(
        setPartialProductDetail({
          specification_attribute_groups: newAttributes,
        }),
      );
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
        onDelete={() => {
          setSelected([]);
          setBasisOptions([]);
          if (onDelete) {
            onDelete();
          }
        }}
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
        title="OPTION"
        visible={visible}
        setVisible={setVisible}
        checkboxList={{
          heading: basis?.name ?? 'N/A',
          customItemClass: styles.customItemClass,
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
