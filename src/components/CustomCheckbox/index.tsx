import { Checkbox } from 'antd';
import { FC, useState } from 'react';
import { CustomCheckboxProps } from './types';
import style from './styles/index.less';
import classNames from 'classnames';
import { CustomInput } from '../Form/CustomInput';

export const CustomCheckbox: FC<CustomCheckboxProps> = ({
  direction,
  checked,
  defaultChecked,
  otherInput,
  inputPlaceholder = 'type here',
  options,
  onChange,
  isCheckboxList,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
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
                />
              </div>
            </Checkbox>
          </div>
        )}
      </Checkbox.Group>
    </div>
  );
};
