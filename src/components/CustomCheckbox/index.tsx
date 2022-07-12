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
  selected,
  checkboxClass,
  heightItem = '32px',
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [randomId] = useState(
    Math.random()
      .toString()
      .replace(/[^0-9]+/g, ''),
  );

  const onChangeValue = (checkedValues: CheckboxValueType[]) => {
    const newCheckboxValue = checkedValues.map((value) =>
      value === 'other'
        ? { label: inputValue, value: 'other' }
        : options.filter((item) => item.value === value)[0],
    );
    if (onChange) {
      onChange(newCheckboxValue);
    }
  };

  const handleClickInput = () => {
    const checkOtherInput = selected?.filter((checkbox) => checkbox.value === 'other').length === 0;
    if (onChange && checkOtherInput) {
      onChange([...selected, { label: inputValue, value: 'other' }]);
    }
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const newData = selected?.map((itemCheckbox) => {
      if (itemCheckbox.value === 'other') {
        return { ...itemCheckbox, label: e.target.value };
      }
      return itemCheckbox;
    });
    if (onChange) {
      onChange(newData ?? []);
    }
  };

  return (
    <div
      className={classNames(
        style[`checkbox-${direction}`],
        style['checkbox-list'],
        isCheckboxList && style['item-list-checkbox'],
        style['color-checkbox-checked'],
        checkboxClass,
      )}
    >
      <Checkbox.Group
        {...props}
        value={selected?.map((item) => item.value) ?? []}
        onChange={onChangeValue}
      >
        {options.map((option, index) => (
          <div key={index}>
            {isCheckboxList ? (
              <label
                className={classNames(style['item-wrapper'], 'item-wrapper-custom')}
                style={{ height: heightItem }}
                htmlFor={`${option.value}_${index}_${randomId}`}
              >
                <div style={{ width: '100%' }}>{option.label}</div>
                <Checkbox id={`${option.value}_${index}_${randomId}`} {...option} />
              </label>
            ) : (
              <div
                className={classNames(style['item-checkbox'], 'item-wrapper-checkbox')}
                style={{ height: heightItem }}
              >
                <Checkbox {...option}>{option.label}</Checkbox>
              </div>
            )}
          </div>
        ))}
        {otherInput && (
          <div className={isCheckboxList && style['other-field-checkbox-list']}>
            <Checkbox value={'other'}>
              <div className={style['input-wrapper']} style={{ height: heightItem }}>
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
