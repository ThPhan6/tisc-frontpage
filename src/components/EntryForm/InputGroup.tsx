import type { FC, ReactNode } from 'react';

import { Col, Row } from 'antd';

import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';

import { BodyTextProps, CustomTypography } from '../Typography/types';
import { MainContentProps } from './types';
import type { CustomInputProps } from '@/components/Form/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import { CustomTextArea } from '../Form/CustomTextArea';
import TableContent from '../Table/TableContent';
import styles from './styles/InputGroup.less';
import { useGeneralFeature } from './utils';

const InputGroupContent: FC<MainContentProps> = ({ children, hasHeight, noWrap, customClass }) => (
  <Row
    className={`${styles.inputGroupContainer} ${
      hasHeight ? styles.heightInputGroup : ''
    } ${customClass}`}
    gutter={0}
    align="middle"
    wrap={!noWrap}
  >
    {children}
  </Row>
);

export interface InputGroupProps extends Omit<CustomInputProps, 'title'> {
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
  isTableFormat?: boolean;
  labelColor?: CustomTypography['color'];
  autoResize?: boolean;
  inputTitle?: string;
  inputClass?: string;
  customClass?: string;
  labelTitle?: string;
  labelProps?: BodyTextProps;
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
  isTableFormat,
  labelColor = 'mono-color',
  autoResize,
  inputTitle,
  inputClass = '',
  labelTitle,
  customClass,
  labelProps,
  ...props
}) => {
  const { labelSpan, inputSpan, fontSize, iconDelete } = useGeneralFeature(
    noWrap,
    fontLevel,
    deleteIcon,
    onDelete,
    horizontal,
  );

  const renderLabel = () => {
    return (
      <Col span={labelSpan} className="input-label-container">
        <BodyText
          level={fontLevel ?? 5}
          customClass={`${'input-label'} ${labelColor}`}
          title={labelTitle}
          {...labelProps}
        >
          {label}
          {required ? (
            <span
              className={`${
                colorRequired === 'tertiary'
                  ? styles.requiredColorTertiary
                  : styles.requiredColorPrimaryDark
              } ${styles.required}`}
            >
              *
            </span>
          ) : (
            ''
          )}
          {required ? <span className={styles.colon}>:</span> : ''}
        </BodyText>
      </Col>
    );
  };

  const renderInput = () => {
    return (
      <Col
        className={`${styles.inputGroupContent} ${hasBoxShadow ? styles.boxShadow : ''}`}
        span={inputSpan}
      >
        {autoResize ? (
          <CustomTextArea
            value={value}
            customClass={`${styles.customTextArea} `}
            autoResize
            {...props}
          />
        ) : (
          <CustomInput
            {...props}
            title={inputTitle}
            value={value}
            fontLevel={fontSize}
            readOnly={rightIcon || readOnly ? true : false}
            className={`input-box ${hasPadding ? 'has-padding' : ''} ${
              colorPrimaryDark ? 'color-primary-dark' : ''
            } ${inputClass}`}
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
        )}

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
    );
  };

  const renderMessage = () => {
    return message ? (
      <div className={`${styles.message} input-message`}>
        <BodyText fontFamily="Roboto" level={6} customClass={messageType}>
          {message}
        </BodyText>
      </div>
    ) : null;
  };

  if (isTableFormat) {
    return (
      <TableContent
        textLeft={
          <InputGroupContent hasHeight={hasHeight} noWrap={noWrap}>
            {renderLabel()}
          </InputGroupContent>
        }
        textRight={
          <InputGroupContent hasHeight={hasHeight} noWrap={noWrap}>
            {renderInput()}
          </InputGroupContent>
        }
      />
    );
  }

  return (
    <InputGroupContent hasHeight={hasHeight} noWrap={noWrap} customClass={customClass}>
      {renderLabel()}
      {renderInput()}
      {renderMessage()}
    </InputGroupContent>
  );
};

export default InputGroup;
