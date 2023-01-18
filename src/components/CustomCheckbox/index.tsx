import { FC, useEffect, useState } from 'react';

import { Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import { CheckboxValue, CustomCheckboxProps } from './types';

import { CustomInput } from '../Form/CustomInput';
import style from './styles/index.less';

export const CustomCheckbox: FC<CustomCheckboxProps> = ({
  direction,
  otherInput,
  clearOtherInput,
  inputPlaceholder = 'type here',
  options,
  onChange,
  isCheckboxList,
  selected,
  checkboxClass = '',
  heightItem = '32px',
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [randomId] = useState(Math.random().toString().replace(/[\D]+/g, ''));

  useEffect(() => {
    if (otherInput && clearOtherInput) {
      setInputValue('');
    }
  }, [otherInput && clearOtherInput]);

  const onChangeValue = (checkedValues: CheckboxValueType[]) => {
    const haveOtherInput = checkedValues.some((checkbox) => checkbox === 'other');

    const newCheckboxValue = checkedValues.map((value) =>
      value === 'other'
        ? { label: inputValue, value: 'other' }
        : options.filter((item) => item.value === value)[0],
    );
    if (inputValue && !haveOtherInput) {
      newCheckboxValue.push({ label: inputValue, value: 'other' });
    }
    if (onChange) {
      onChange(newCheckboxValue);
    }
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const haveOtherInput = selected?.some((checkbox) => checkbox.value === 'other') || false;

    let newData: CheckboxValue[] = selected || [];

    if (newValue && !haveOtherInput) {
      newData.push({ label: newValue, value: 'other' });
    } else {
      newData =
        selected?.map((itemCheckbox) => {
          if (itemCheckbox.value === 'other') {
            return { ...itemCheckbox, label: newValue };
          }
          return itemCheckbox;
        }) || [];
    }

    onChange?.(newData.filter((el) => el.label !== '') ?? []);
  };

  const getActiveClass = (option: CheckboxValue) => {
    if (selected?.find((itemSelected) => itemSelected.value == option.value)) {
      return 'item-option-checked';
    }
    return '';
  };

  return (
    <div
      className={`${style[`checkbox-${direction}`]} ${style['checkbox-list']} ${
        isCheckboxList && style['item-list-checkbox']
      } ${style['color-checkbox-checked']} ${checkboxClass}`}
      onClick={(e) => e.stopPropagation()}>
      <Checkbox.Group
        {...props}
        value={selected?.map((item) => item.value) ?? []}
        onChange={onChangeValue}>
        {options.map((option, index) => (
          <div key={index}>
            {isCheckboxList ? (
              <label
                className={`${style['item-wrapper']} ${'item-wrapper-custom'}`}
                style={{ minHeight: heightItem }}
                htmlFor={`${option.value}_${index}_${randomId}`}>
                <div
                  style={{ width: '100%', paddingRight: '16px' }}
                  className={`item-option-uncheck ${getActiveClass(option)}`}>
                  {option.label}
                </div>
                <Checkbox id={`${option.value}_${index}_${randomId}`} {...option} />
              </label>
            ) : (
              <div
                className={`${style['item-checkbox']} ${'item-wrapper-checkbox'}`}
                style={{ minHeight: heightItem }}>
                <Checkbox {...option} style={{ maxWidth: '100%' }}>
                  <span className={`item-option-uncheck ${getActiveClass(option)}`}>
                    {option.label}
                  </span>
                </Checkbox>
              </div>
            )}
          </div>
        ))}
        {otherInput ? (
          <div className={isCheckboxList && style['other-field-checkbox-list']}>
            <Checkbox value={'other'}>
              <div className={style['input-wrapper']} style={{ height: heightItem }}>
                Other
                <CustomInput
                  containerClass={style['other-input']}
                  placeholder={inputPlaceholder}
                  value={inputValue}
                  onChange={onChangeInputValue}
                />
              </div>
            </Checkbox>
          </div>
        ) : null}
      </Checkbox.Group>
    </div>
  );
};
