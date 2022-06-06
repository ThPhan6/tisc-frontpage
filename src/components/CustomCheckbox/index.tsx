import { Checkbox } from 'antd';
import { FC, useState } from 'react';
import { CustomCheckboxProps } from './types';
import style from './styles/index.less';
import classNames from 'classnames';
import { CustomInput } from '../Form/CustomInput';

export const CustomCheckbox: FC<CustomCheckboxProps> = ({
  direction,
  otherInput,
  inputPlaceholder = 'type here',
  options,
  onChange,
  isCheckboxList,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [checkboxValue, setChecboxValue] = useState({ value: '', label: '', checked: false });
  const isChecked = false;
  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecboxValue({
      value: 'other',
      label: e.target.value,
      checked: e.target.checked,
    });
    setInputValue(e.target.value);
  };
  const onChangeValue = (e: any) => {
    const newValue = {
      value: e.target.value,
      label: e.target.value === 'other' ? inputValue : e.target?.label || 'label ' + e.target.value,
      checked: e.target.checked,
    };
    setChecboxValue({ ...newValue });
  };
  return (
    <div
      className={classNames(
        style[`checkbox-${direction}`],
        style['checkbox-list'],
        isCheckboxList && style['item-list-checkbox'],
        style['color-checkbox-checked'],
      )}
    >
      <Checkbox.Group {...props}>
        {options.map((option, index) => (
          <div key={index}>
            {isCheckboxList ? (
              <div className={style['item-wrapper']}>
                <span>{option.label}</span>
                <Checkbox {...option} checked={checkboxValue.checked} onChange={onChangeValue} />
              </div>
            ) : (
              <Checkbox {...option} onChange={onChangeValue}>
                {option.label}
              </Checkbox>
            )}
          </div>
        ))}
        {otherInput && (
          <div className={isCheckboxList && style['other-field-checkbox-list']}>
            <Checkbox value={'other'} onChange={onChangeValue}>
              <div className={style['input-wrapper']}>
                Other
                <CustomInput
                  containerClass={style['other-input']}
                  placeholder={inputPlaceholder}
                  value={inputValue}
                  onChange={onChangeInputValue}
                  onClick={() =>
                    setChecboxValue({
                      value: 'other',
                      label: inputValue,
                      checked: !isChecked,
                    })
                  }
                />
              </div>
            </Checkbox>
          </div>
        )}
      </Checkbox.Group>
    </div>
  );
};
