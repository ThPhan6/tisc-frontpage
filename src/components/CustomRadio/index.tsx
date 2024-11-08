import { FC, useEffect, useState } from 'react';

import { Radio, Space } from 'antd';

import { uniqueId } from 'lodash';

import type { CustomRadioProps, RadioValue } from './types';

import { CustomInput } from '../Form/CustomInput';
import style from './styles/index.less';

export const CustomRadio: FC<CustomRadioProps> = ({
  direction = 'horizontal',
  options,
  defaultValue,
  isRadioList,
  otherInput,
  clearOtherInput,
  selected,
  onChange,
  inputPlaceholder = 'type here',
  containerClass,
  value,
  containerStyle,
  noPaddingLeft,
  otherStickyBottom,
  stickyTopItem,
  optionStyle,
  disabled,
  additionalOtherClass = '',
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [randomID] = useState(uniqueId('radio_'));

  useEffect(() => {
    if (otherInput && clearOtherInput) {
      setInputValue('');
    }
  }, [otherInput && clearOtherInput]);

  const onChangeValue = (e: any) => {
    const newValue = {
      value: e.target.value,
      label: e.target.value === 'other' ? inputValue : e.target?.label || 'label ' + e.target.value,
    };
    onChange?.({ ...newValue });
    if (isRadioList) {
      setInputValue('');
    }
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ ...selected, value: 'other', label: e.target.value });
    setInputValue(e.target.value);
  };

  const getActiveClass = (option: RadioValue) => {
    if (option.value == value) {
      return 'item-option-checked';
    }
    return 'item-option-uncheck';
  };

  const renderOption = (option: RadioValue, index: number) => {
    return (
      <label
        key={index}
        className={`${style.panel_radio} ${disabled ? 'cursor-default' : 'cursor-pointer'} ${
          option.customClass ? option.customClass : ''
        } radio-label`}
        htmlFor={`${randomID}_${option.value}_${index}`}
        style={optionStyle}
      >
        <div style={{ width: '100%', paddingTop: 10 }}>
          {isRadioList ? (
            <div className={style['item-wrapper']}>
              <span className={getActiveClass(option)}>{option.label}</span>
              <Radio id={`${randomID}_${option.value}_${index}`} {...option} />
            </div>
          ) : (
            <Radio id={`${randomID}_${option.value}_${index}`} {...option}>
              <span className={getActiveClass(option)}>{option.label}</span>
            </Radio>
          )}
        </div>
      </label>
    );
  };

  return (
    <div
      className={`${style['radio-container']} ${
        style[`radio-${isRadioList ? 'vertical' : direction}`]
      } ${isRadioList ? style['radio-list'] : ''} ${noPaddingLeft ? style.noPaddingLeft : ''} ${
        containerClass || ''
      }`}
      style={containerStyle}
    >
      <Radio.Group
        {...props}
        style={{ width: '100%' }}
        onChange={onChangeValue}
        value={value}
        disabled={disabled}
        defaultValue={defaultValue?.value}
      >
        <Space
          direction={isRadioList ? 'vertical' : direction}
          className={`${otherStickyBottom ? style.stickyBottom : ''} ${
            stickyTopItem ? style.stickyTopItem : ''
          }`}
        >
          {options.map((option, index) => {
            if (stickyTopItem && index === 0) {
              return (
                <div key={index} className={`${style.topItem} flex-start`}>
                  {renderOption(option, index)}
                </div>
              );
            }
            return renderOption(option, index);
          })}

          {otherInput && (
            <div className={`${isRadioList ? style['other-field-radio-list'] : ''}`}>
              <Radio value={'other'}>
                <div className={`${style['input-wrapper']} ${additionalOtherClass}`}>
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
