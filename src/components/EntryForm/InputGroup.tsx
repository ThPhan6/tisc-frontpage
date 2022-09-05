import type { FC, ReactNode } from 'react';

import { Col, Row } from 'antd';

import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';

import type { CustomInputProps } from '@/components/Form/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import styles from './styles/InputGroup.less';
import { useGeneralFeature } from './utils';

interface InputGroupProps extends CustomInputProps {
  horizontal?: boolean;
  rightIcon?: boolean | ReactNode;
  deleteIcon?: boolean;
  onDelete?: () => void;
  onRightIconClick?: () => void;
  required?: boolean;
  fontLevel?: 1 | 2 | 3 | 4 | 5;
  label?: string | ReactNode;
  noWrap?: boolean;
  hasPadding?: boolean;
  hasHeight?: boolean;
  colorPrimaryDark?: boolean;
  colorRequired?: 'tertiary' | 'primary-dark';
  hasBoxShadow?: boolean;
  message?: string;
  messageType?: 'normal' | 'warning' | 'error';
  forceDisplayDeleteIcon?: boolean;
}

const InputGroup: FC<InputGroupProps> = ({
  label,
  horizontal,
  fontLevel,
  readOnly,
  noWrap,
  hasPadding,
  hasHeight,
  colorPrimaryDark,
  required,
  colorRequired = 'tertiary',
  rightIcon,
  onRightIconClick,
  deleteIcon,
  onDelete,
  value,
  hasBoxShadow,
  message,
  messageType = 'normal',
  disabled,
  forceDisplayDeleteIcon,
  ...props
}) => {
  const { labelSpan, inputSpan, fontSize, iconDelete } = useGeneralFeature(
    noWrap,
    fontLevel,
    deleteIcon,
    onDelete,
  );
  return (
    <Row
      className={`
        ${styles.inputGroupContainer}
        ${hasHeight ? styles.heightInputGroup : ''}
      `}
      gutter={0}
      align="middle"
      wrap={noWrap ? false : true}>
      <Col span={horizontal ? labelSpan : 24} className="input-label-container">
        <BodyText level={fontLevel ?? 5} customClass="input-label">
          {label}
          {required ? (
            <span
              className={`${
                colorRequired === 'tertiary'
                  ? styles.requiredColorTertiary
                  : styles.requiredColorPrimaryDark
              }
              ${styles.required}`}>
              *
            </span>
          ) : (
            ''
          )}
          {required ? <span className={styles.colon}>:</span> : ''}
        </BodyText>
      </Col>
      <Col
        className={`
          ${styles.inputGroupContent}
          ${hasBoxShadow ? styles.boxShadow : ''}
        `}
        span={horizontal ? inputSpan : 24}>
        <CustomInput
          {...props}
          value={value}
          fontLevel={fontSize}
          readOnly={rightIcon || readOnly ? true : false}
          className={`input-box ${hasPadding ? 'has-padding' : ''} ${
            colorPrimaryDark ? 'color-primary-dark' : ''
          }`}
          style={{
            cursor: onRightIconClick && !disabled ? 'pointer' : 'auto',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onRightIconClick && !disabled && !readOnly) {
              onRightIconClick();
            }
          }}
        />
        {rightIcon ? (
          rightIcon === true ? (
            <SingleRightFormIcon
              onClick={onRightIconClick}
              className={disabled ? styles.iconDisabled : ''}
            />
          ) : (
            rightIcon
          )
        ) : null}
        {(forceDisplayDeleteIcon || value) && iconDelete}
      </Col>
      {message ? (
        <div className={styles.message}>
          <BodyText fontFamily="Roboto" level={6} customClass={messageType}>
            {message}
          </BodyText>
        </div>
      ) : null}
    </Row>
  );
};

export default InputGroup;
