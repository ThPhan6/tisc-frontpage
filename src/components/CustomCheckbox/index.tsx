import { Checkbox } from 'antd';
import { FC, useState } from 'react';
import { CustomCheckboxProps } from './types';
import style from './styles/index.less';
import classNames from 'classnames';
import { CustomInput } from '../Form/CustomInput';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

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
  const [checkboxValue, setCheckboxValue] = useState(defaultValue ? [defaultValue] : []);

  const onChangeValue = (checkedValues: CheckboxValueType[]) => {
    const newCheckboxValue = checkedValues.map((value) =>
      value === 'other'
        ? { label: inputValue, value: 'other' }
        : options.filter((item) => item.value === value)[0],
    );
    setCheckboxValue(newCheckboxValue);
    if (onChange) {
      onChange(newCheckboxValue);
    }
  };

  const handleClickInput = () => {
    const checkOtherInput =
      checkboxValue.filter((checkbox) => checkbox.value === 'other').length === 0;
    if (onChange && checkOtherInput) {
      onChange([...checkboxValue, { label: inputValue, value: 'other' }]);
    }
    if (checkOtherInput) {
      setCheckboxValue([...checkboxValue, { label: inputValue, value: 'other' }]);
    }
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const newData = checkboxValue.map((itemCheckbox) => {
      if (itemCheckbox.value === 'other') {
        return { ...itemCheckbox, label: e.target.value };
      }
      return itemCheckbox;
    });
    if (onChange) {
      onChange(newData);
    }
    setCheckboxValue(newData);
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
              <div className={style['item-checkbox']}>
                <Checkbox {...option}>{option.label}</Checkbox>
              </div>
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
