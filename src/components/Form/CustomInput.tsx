import { Input } from 'antd';
import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import styles from './styles/Input.less';
import type { CustomInputProps } from './types';
import { isUndefined } from 'lodash';

export const CustomInput: FC<CustomInputProps> = ({
  theme = 'default',
  focusColor,
  borderBottomColor,
  containerClass,
  type,
  status,
  fontLevel,
  fromLandingPage,
  required = false,
  autoWidth,
  defaultWidth,
  maxWords,
  ...props
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const span: any = useRef();
  useEffect(() => {
    if (autoWidth && defaultWidth) {
      let textWidth = span.current.offsetWidth;
      if (textWidth < defaultWidth) {
        textWidth = defaultWidth;
      } else {
        textWidth += 4;
      }
      setWidth(textWidth);
    }
  }, [props.value]);

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
  const setFontLevel = () => {
    if (fontLevel) {
      return styles[`bodyText${fontLevel}`];
    }
    return '';
  };

  const classNameInputDefault = `
    ${styles.input}
    ${borderBottomColor ? styles[`${borderBottomColor}-border-bottom-color`] : ''}
    ${fromLandingPage ? styles[`${theme}-focus-normal`] : ''}
    ${
      status &&
      styles[`${fromLandingPage ? (status === 'error' ? 'warning' : 'error') : status}-status`]
    }
    ${styles[`${theme}-theme`]}
    ${setDisabled()}
  `;

  const classNameInputAffix = `
    ${styles['input-affix']}
    ${required && styles['required-input-affix']}
    ${borderBottomColor ? styles[`${borderBottomColor}-border-bottom-color-affix`] : ''}
    ${fromLandingPage ? styles[`${theme}-focus-normal-affix`] : ''}
    ${
      status
        ? styles[
            `${fromLandingPage ? (status === 'error' ? 'warning' : 'error') : status}-status-affix`
          ]
        : ''
    }
    ${styles[`${theme}-theme-affix`]}
    ${setDisabled()}
  `;

  const classNameInput = props.prefix || props.suffix ? classNameInputAffix : classNameInputDefault;

  return (
    <div className={`${classNameInput}  ${containerClass}`} style={{ width: '100%' }}>
      {type === 'password' ? (
        <div
          style={{ width: '100%' }}
          className={required && !(props.prefix || props.suffix) ? styles['required-input'] : ''}
        >
          <Input.Password type={type} {...props} />
        </div>
      ) : (
        <div
          style={{ width: '100%' }}
          className={required && !(props.prefix || props.suffix) ? styles['required-input'] : ''}
        >
          {autoWidth ? (
            <span className={`${styles.hiddenSpan} ${setFontLevel()}`} ref={span}>
              {props.value}
            </span>
          ) : null}
          <Input
            type={type}
            {...props}
            onChange={(e) => {
              if (maxWords) {
                const text = e.target.value;
                const textLength = text.split(' ').length;
                if (textLength > maxWords) {
                  return false;
                }
              }
              if (props.onChange) {
                props.onChange(e);
              }
              return true;
            }}
            className={`${setFontLevel()}  ${props.className ?? ''}`}
            style={
              autoWidth
                ? {
                    ...props.style,
                    width: isUndefined(width) ? '100%' : width,
                  }
                : props.style
            }
          />
        </div>
      )}
    </div>
  );
};
