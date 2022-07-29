import { Radio, Space } from 'antd';
import { FC } from 'react';
import { useState } from 'react';
import type { CustomRadioProps, RadioValue } from './types';
import style from './styles/index.less';
import { CustomInput } from '../Form/CustomInput';
import { uniqueId } from 'lodash';

export const CustomRadio: FC<CustomRadioProps> = ({
  direction = 'horizontal',
  options,
  defaultValue,
  isRadioList,
  otherInput,
  selected,
  onChange,
  inputPlaceholder = 'type here',
  containerClass,
  value,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [randomID] = useState(uniqueId('radio_'));
  const onChangeValue = (e: any) => {
    const newValue = {
      value: e.target.value,
      label: e.target.value === 'other' ? inputValue : e.target?.label || 'label ' + e.target.value,
    };
    if (onChange) {
      onChange({ ...newValue });
    }
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ ...selected, value: 'other', label: e.target.value });
    }
    setInputValue(e.target.value);
  };

  const renderActiveClass = (option: RadioValue) => {
    if (option.value == value) {
      return 'item-option-checked';
    }
    return '';
  };

  return (
    <div
      className={`
        ${style['radio-container']}
        ${style[`radio-${isRadioList ? 'vertical' : direction}`]}
        ${isRadioList ? style['radio-list'] : ''}
        ${containerClass}
      `}
    >
      <Radio.Group
        {...props}
        onChange={onChangeValue}
        value={value}
        defaultValue={defaultValue?.value}
      >
        <Space direction={isRadioList ? 'vertical' : direction}>
          {options.map((option, index) => (
            <label
              key={index}
              className={`
                ${style.panel_radio}
                ${option.customClass ? option.customClass : ''}
                radio-label
              `}
              htmlFor={`${randomID}_${option.value}_${index}`}
            >
              <div style={{ width: '100%' }}>
                {isRadioList ? (
                  <div className={style['item-wrapper']}>
                    <span className={renderActiveClass(option)}>{option.label}</span>
                    <Radio id={`${randomID}_${option.value}_${index}`} {...option} />
                  </div>
                ) : (
                  <Radio id={`${randomID}_${option.value}_${index}`} {...option}>
                    <span className={renderActiveClass(option)}>{option.label}</span>
                  </Radio>
                )}
              </div>
            </label>
          ))}
          {otherInput && (
            <div className={isRadioList ? style['other-field-radio-list'] : ''}>
              <Radio value={'other'}>
                <div className={style['input-wrapper']}>
                  Other{' '}
                  <CustomInput
                    containerClass={style['other-input']}
                    placeholder={inputPlaceholder}
                    value={inputValue}
                    onChange={onChangeInputValue}
                    onClick={() => {
                      if (onChange) {
                        onChange({ value: 'other', label: inputValue });
                      }
                    }}
                  />
                </div>
              </Radio>
            </div>
          )}
        </Space>
      </Radio.Group>
    </div>
  );
};
