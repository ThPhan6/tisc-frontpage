import type { FC } from 'react';

import { Tooltip } from 'antd';

import { ReactComponent as QuestionIcon } from '@/assets/icons/question-icon.svg';

import type { FormGroupProps } from './types';

import { BodyText } from '../Typography';
import style from './styles/Form.less';

export const FormGroup: FC<FormGroupProps> = ({
  layout = 'horizontal',
  formClass,
  optional,
  required,
  tooltip,
  children,
  message,
  iconTooltip,
  customIcon,
  placement = 'top',
  label,
  labelColor = 'mono-color',
  lableFontSize = 3,
  onClick,
  messageType = 'normal',
  placementBottomWidth,
  ...props
}) => {
  const setFormLayout = () => {
    return style[`${layout}Layout`];
  };

  const classNameForm = `${setFormLayout()} ${formClass}`;
  return (
    <div className={classNameForm} {...props}>
      <label
        className={`${style.label} ${
          layout === 'horizontal' && style['label-margin']
        } ${labelColor}`}
        onClick={onClick}>
        <BodyText fontFamily="Cormorant-Garamond" level={lableFontSize} customClass={labelColor}>
          {label}
        </BodyText>
        {optional && (
          <BodyText
            customClass={`${style.optional} ${labelColor}`}
            fontFamily="Cormorant-Garamond"
            level={3}>
            (optional)
          </BodyText>
        )}
        {required && <span className={`${style.required} ${labelColor}`}>*</span>}
        {tooltip && (
          <Tooltip
            placement={placement}
            title={tooltip}
            overlayInnerStyle={
              placement === 'bottom'
                ? {
                    width: placementBottomWidth ? placementBottomWidth : '160px',
                  }
                : {}
            }>
            {iconTooltip ? (
              iconTooltip
            ) : (
              <QuestionIcon className={`${style['question-icon']} ${labelColor}`} />
            )}
          </Tooltip>
        )}
        {customIcon ? customIcon : null}
        <span className={`${style.colon} ${labelColor}`}>:</span>
      </label>
      <div className={style['children-wrapper']}>
        {children}
        {message && (
          <div className={style.message}>
            <BodyText fontFamily="Roboto" level={6} customClass={style[`${messageType}`]}>
              {message}
            </BodyText>
          </div>
        )}
      </div>
    </div>
  );
};
