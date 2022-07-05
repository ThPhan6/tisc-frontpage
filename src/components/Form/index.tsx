import type { FC } from 'react';
import { BodyText } from '../Typography';
import style from './styles/Form.less';
import type { FormGroupProps } from './types';
import { ReactComponent as QuestionIcon } from '../../assets/icons/question-icon.svg';
import { Tooltip } from 'antd';

export const FormGroup: FC<FormGroupProps> = ({
  layout = 'horizontal',
  formClass,
  optional,
  required,
  tooltip,
  children,
  message,
  label,
  messageType = 'normal',
  iconTooltip,
  ...props
}) => {
  const setFormLayout = () => {
    return style[`${layout}Layout`];
  };

  const classNameForm = `${setFormLayout()} ${formClass}`;
  return (
    <div className={classNameForm} {...props}>
      <label className={`${style.label} ${layout === 'horizontal' && style['label-margin']}`}>
        <BodyText fontFamily="Cormorant-Garamond" level={3}>
          {label}
        </BodyText>
        {optional && (
          <BodyText customClass={style.optional} fontFamily="Cormorant-Garamond" level={3}>
            (optional)
          </BodyText>
        )}
        {required && <span className={style.required}>*</span>}
        {tooltip && (
          <Tooltip placement="top" title={tooltip}>
            {iconTooltip ? iconTooltip : <QuestionIcon className={style['question-icon']} />}
          </Tooltip>
        )}
        <span className={style.colon}>:</span>
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
