import { Input } from 'antd';
import type { FC } from 'react';
import styles from './styles/Input.less';
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
  required = false,
  ...props
}) => {
  const setDisabled = () => {
    if (props.disabled) {
      switch (theme) {
        case 'dark':
          return styles[`disabled-dark-theme${props.prefix || props.suffix ? '-affix' : ''}`];
        default:
          return styles[`disabled-default-theme${props.prefix || props.suffix ? '-affix' : ''}`];
      }
    }
  };

  const classNameInputDefault = classNames(
    styles.input,
    borderBottomColor && styles[`${borderBottomColor}-border-bottom-color`],
    fromLandingPage && styles[`${theme}-focus-normal`],
    status &&
      styles[`${fromLandingPage ? (status === 'error' ? 'warning' : 'error') : status}-status`],
    styles[`${theme}-theme`],
    setDisabled(),
  );

  const classNameInputAffix = classNames(
    styles['input-affix'],
    required && styles['required-input-affix'],
    borderBottomColor && styles[`${borderBottomColor}-border-bottom-color-affix`],
    fromLandingPage && styles[`${theme}-focus-normal-affix`],
    status &&
      styles[
        `${fromLandingPage ? (status === 'error' ? 'warning' : 'error') : status}-status-affix`
      ],
    styles[`${theme}-theme-affix`],
    setDisabled(),
  );

  const classNameInput = props.prefix || props.suffix ? classNameInputAffix : classNameInputDefault;

  return (
    <div className={classNames(classNameInput, containerClass)}>
      {type === 'password' ? (
        <div className={required && !(props.prefix || props.suffix) && styles['required-input']}>
          <Input.Password type={type} {...props} />
        </div>
      ) : (
        <div className={required && !(props.prefix || props.suffix) && styles['required-input']}>
          <Input type={type} {...props} />
        </div>
      )}
    </div>
  );
};
