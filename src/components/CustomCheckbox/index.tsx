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
  defaultValue,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [checkboxValue, setChecboxValue] = useState(defaultValue ? [defaultValue] : []);

  console.log('checkboxValue', checkboxValue);
  const onChangeValue = (checkedValues: any) => {
    const checkbox_value = checkedValues.map((value: string) =>
      value === 'other'
        ? { value: 'other', label: inputValue, checked: true }
        : options.filter((item) => item.value === value)[0],
    );
    setChecboxValue(checkbox_value);
    if (onChange) {
      onChange({ ...checkbox_value });
    }
  };

  const handleClickInput = () => {
    const checkOtherInput =
      checkboxValue.filter((checkbox) => checkbox.value === 'other').length === 0;
    if (checkOtherInput) {
      setChecboxValue([...checkboxValue, { value: 'other', label: inputValue, checked: true }]);
    }
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) {
      onChange({ value: 'other', label: e.target.value });
    }
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
      <Checkbox.Group
        {...props}
        value={checkboxValue.map((checkbox) => checkbox.value)}
        onChange={onChangeValue}
      >
        {options.map((option, index) => (
          <div key={index}>
            {isCheckboxList ? (
              <div className={style['item-wrapper']}>
                <span>{option.label}</span>
                <Checkbox {...option} />
              </div>
            ) : (
              <Checkbox {...option}>{option.label}</Checkbox>
            )}
          </div>
        ))}
        {otherInput && (
          <div className={isCheckboxList && style['other-field-checkbox-list']}>
            <Checkbox value={'other'}>
              <div className={style['input-wrapper']}>
                Other
                <CustomInput
                  containerClass={style['other-input']}
                  placeholder={inputPlaceholder}
                  value={inputValue}
                  onChange={onChangeInputValue}
                  onClick={handleClickInput}
                />
              </div>
            </Checkbox>
          </div>
        )}
      </Checkbox.Group>
    </div>
  );
};
