import { Input } from 'antd';
import { FC } from 'react';
import style from './styles/Input.less';
import { CustomInputProps } from './types';
import classNames from 'classnames';

export const CustomInput: FC<CustomInputProps> = ({
  theme = 'default',
  focusColor,
  borderBottomColor,
  containerClass,
  ...props
}) => {
  const setDisabled = () => {
    if (props.disabled) {
      switch (theme) {
        case 'dark':
          return style[`disabled-dark-theme${props.prefix || props.suffix ? '-affix' : ''}`];
        default:
          return style[`disabled-default-theme${props.prefix || props.suffix ? '-affix' : ''}`];
      }
    }
  };

  const classNameInputDefault = classNames(
    style.input,
    focusColor && style[`${focusColor}-focus`],
    borderBottomColor && style[`${borderBottomColor}-border-bottom-color`],
    style[`${theme}-theme`],
    setDisabled(),
  );

  const classNameInputAffix = classNames(
    style['input-affix'],
    borderBottomColor && style[`${borderBottomColor}-border-bottom-color-affix`],
    focusColor && style[`${focusColor}-focus-affix`],
    style[`${theme}-theme-affix`],
    setDisabled(),
  );

  const classNameInput = props.prefix || props.suffix ? classNameInputAffix : classNameInputDefault;

  return (
    <div className={classNames(classNameInput, containerClass)}>
      <Input {...props} />
    </div>
  );
};
