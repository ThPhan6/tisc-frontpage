import { FC, forwardRef, useEffect, useRef, useState } from 'react';

import { Input, InputRef } from 'antd';

import { isUndefined, trimStart } from 'lodash';

import type { CustomInputProps } from './types';

import { RobotoBodyText } from '../Typography';
import styles from './styles/Input.less';

export const CustomInput: FC<CustomInputProps> = forwardRef<InputRef, CustomInputProps>(
  (
    {
      theme = 'default',
      focusColor,
      borderBottomColor,
      containerClass,
      containerStyles,
      type,
      status,
      fontLevel,
      fromLandingPage,
      required = false,
      autoWidth,
      defaultWidth,
      maxWords,
      inputValidation,
      message,
      messageType,
      additionalInputClass = '',
      ...props
    },
    ref,
  ) => {
    // styles
    const themeName = props.prefix || props.suffix ? '-affix' : '';
    const landingPageStatus = fromLandingPage ? (status === 'error' ? 'warning' : 'error') : status;
    const requiredClassname =
      required && !(props.prefix || props.suffix) ? styles['required-input'] : '';

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
    const [cursor, setCursor] = useState<number | null>(null);
    const defaultRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (
        defaultRef.current &&
        defaultRef.current.tagName === 'INPUT' &&
        'setSelectionRange' in defaultRef.current
      ) {
        defaultRef.current.setSelectionRange(cursor, cursor);
      }
    }, [defaultRef, cursor, props.value]);
    const getDisabledTheme = () => {
      if (props.disabled) {
        switch (theme) {
          case 'dark':
            return styles[`disabled-dark-theme${themeName}`];
          default:
            return styles[`disabled-default-theme${themeName}`];
        }
      }
      return '';
    };
    const setFontLevel = () => {
      if (fontLevel) {
        return styles[`bodyText${fontLevel}`];
      }
      return '';
    };

    const classNameInputDefault = `${styles.inputDefault} ${
      borderBottomColor ? styles[`${borderBottomColor}-border-bottom-color`] : ''
    } ${fromLandingPage ? styles[`${theme}-focus-normal`] : ''} ${
      status ? styles[`${landingPageStatus}-status`] : ''
    } ${styles[`${theme}-theme`]} ${getDisabledTheme()}`;

    const classNameInputAffix = `${styles['input-affix']} ${
      required ? styles['required-input-affix'] : ''
    } ${borderBottomColor ? styles[`${borderBottomColor}-border-bottom-color-affix`] : ''} ${
      fromLandingPage ? styles[`${theme}-focus-normal-affix`] : ''
    } ${status ? styles[`${landingPageStatus}-status-affix`] : ''} ${
      styles[`${theme}-theme-affix`]
    } ${getDisabledTheme()}`;

    const classNameInput =
      props.prefix || props.suffix ? classNameInputAffix : classNameInputDefault;

    return (
      <div
        className={`${classNameInput ?? ''} ${containerClass}`}
        style={{ width: '100%', ...containerStyles }}
      >
        {type === 'password' ? (
          <div style={{ width: '100%' }} className={requiredClassname}>
            <Input.Password type={type} {...props} />
          </div>
        ) : (
          <div style={{ width: '100%' }} className={requiredClassname}>
            {autoWidth ? (
              <span className={`${styles.hiddenSpan} ${setFontLevel()}`} ref={span}>
                {props.value}
              </span>
            ) : null}
            <Input
              ref={ref || defaultRef}
              type={type}
              {...props}
              onChange={(e) => {
                setCursor(e.target.selectionStart);
                if (inputValidation) {
                  if (!inputValidation(e.target.value)) {
                    return false;
                  }
                }
                if (maxWords) {
                  const text = e.target.value;
                  const textLength = text.split(' ').length;
                  if (textLength > maxWords) {
                    return false;
                  }
                }
                /// trim prefix of input
                e.target.value = trimStart(e.target.value ?? '');
                if (props.onChange) {
                  props.onChange(e);
                }
                return true;
              }}
              className={`${setFontLevel()} ${props.className ?? ''} ${additionalInputClass}`}
              style={
                autoWidth
                  ? {
                      ...props.style,
                      width: isUndefined(width) ? '100%' : width,
                    }
                  : props.style
              }
            />
            {message ? (
              <div className={styles.message}>
                <RobotoBodyText level={6} customClass={messageType}>
                  {message}
                </RobotoBodyText>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  },
);
