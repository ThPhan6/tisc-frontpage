import { Input } from 'antd';
import type { FC } from 'react';
import style from './styles/Input.less';
import type { CustomInputProps } from './types';
import classNames from 'classnames';

export const CustomInput: FC<CustomInputProps> = ({
  theme = 'default',
  focusColor,
  borderBottomColor,
  containerClass,
  type,
  status,
  fromLandingPage,
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
    borderBottomColor && style[`${borderBottomColor}-border-bottom-color`],
    fromLandingPage && style[`${theme}-focus-normal`],
    status &&
      style[`${fromLandingPage ? (status === 'error' ? 'warning' : 'error') : status}-status`],
    style[`${theme}-theme`],
    setDisabled(),
  );

  const classNameInputAffix = classNames(
    style['input-affix'],
    borderBottomColor && style[`${borderBottomColor}-border-bottom-color-affix`],
    fromLandingPage && style[`${theme}-focus-normal-affix`],
    status &&
      style[
        `${fromLandingPage ? (status === 'error' ? 'warning' : 'error') : status}-status-affix`
      ],
    style[`${theme}-theme-affix`],
    setDisabled(),
  );

  const classNameInput = props.prefix || props.suffix ? classNameInputAffix : classNameInputDefault;

  return (
    <div className={classNames(classNameInput, containerClass)}>
      {type === 'password' ? (
        <Input.Password type={type} {...props} />
      ) : (
        <Input type={type} {...props} />
      )}
    </div>
  );
};
