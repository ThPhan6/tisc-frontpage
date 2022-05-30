import { Radio, Space } from 'antd';
import { FC, useState } from 'react';
import { CustomRadioProps } from './types';
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
  ...props
}) => {
  const [radioValue, setRadioValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState('');

  const onChangeValue = (e: any) => {
    const newValue = {
      value: e.target.value,
      label: e.target.value === 'other' ? inputValue : e.target?.label || 'label ' + e.target.value,
    };
    if (onChange) {
      onChange({ ...newValue });
    }
    setRadioValue({ ...newValue });
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ value: 'other', label: e.target.value });
    }
    setRadioValue({
      value: 'other',
      label: e.target.value,
    });
    setInputValue(e.target.value);
  };

  return (
    <div
      className={classNames(
        style['radio-container'],
        style[`radio-${isRadioList ? 'vertical' : direction}`],
        isRadioList && style['radio-list'],
        containerClass,
      )}
    >
      <Radio.Group
        {...props}
        onChange={onChangeValue}
        value={radioValue?.value}
        defaultValue={defaultValue?.value}
      >
        <Space direction={isRadioList ? 'vertical' : direction}>
          {options.map((option, index) => (
            <div key={index} style={{ width: '100%' }}>
              {isRadioList ? (
                <div className={style['item-wrapper']}>
                  <span>{option.label}</span>
                  <Radio {...option} />
                </div>
              ) : (
                <Radio {...option}>{option.label}</Radio>
              )}
            </div>
          ))}
          {otherInput && (
            <div className={isRadioList && style['other-field-radio-list']}>
              <Radio value={'other'}>
                <div className={style['input-wrapper']}>
                  Other{' '}
                  <CustomInput
                    containerClass={style['other-inpdsadsasdsdsadsasdsut']}
                    placeholder={inputPlaceholder}
                    value={inputValue}
                    onChange={onChangeInputValue}
                    onClick={() =>
                      setRadioValue({
                        value: 'other',
                        label: inputValue,
                      })
                    }
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
