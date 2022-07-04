import { Radio, Space } from 'antd';
import { FC, useEffect, useRef } from 'react';
import { useState } from 'react';
import type { CustomRadioProps } from './types';
import style from './styles/index.less';
import classNames from 'classnames';
import { CustomInput } from '../Form/CustomInput';

export const CustomRadio: FC<CustomRadioProps> = ({
  direction = 'horizontal',
  options,
  defaultValue,
  isRadioList,
  otherInput,
  onChange,
  inputPlaceholder = 'type here',
  containerClass,
  value,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOverflow, setIsOverflow] = useState<boolean>(false);
  const radioGroup: any = useRef();

  useEffect(() => {
    const updateSize = () => {
      const parentWidth = radioGroup.current.offsetWidth;
      const childrenWidth = radioGroup.current.children[0].offsetWidth;
      setIsOverflow(childrenWidth > parentWidth ? true : false);
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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
      onChange({ value: 'other', label: e.target.value });
    }
    setInputValue(e.target.value);
  };

  return (
    <div
      className={classNames(
        style['radio-container'],
        style[`radio-${isRadioList ? 'vertical' : direction}`],
        isRadioList ? style['radio-list'] : '',
        containerClass,
      )}
      style={{
        boxShadow: isOverflow === true ? 'none' : '',
        borderBottomColor: isOverflow === true ? 'transparent' : '',
        borderBottom: isOverflow === true ? 'none' : '',
      }}
    >
      <Radio.Group
        {...props}
        onChange={onChangeValue}
        value={value}
        defaultValue={defaultValue?.value}
        ref={radioGroup}
      >
        <Space direction={isRadioList ? 'vertical' : direction}>
          {options.map((option, index) => (
            <label key={index} className={style.panel_radio} htmlFor={`${option.value}_${index}`}>
              <div style={{ width: '100%' }}>
                {isRadioList ? (
                  <div className={style['item-wrapper']}>
                    <span>{option.label}</span>
                    <Radio id={`${option.value}_${index}`} {...option} />
                  </div>
                ) : (
                  <Radio id={`${option.value}_${index}`} {...option}>
                    {option.label}
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
