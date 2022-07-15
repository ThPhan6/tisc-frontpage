// import {useState, useEffect} from 'react';
import type { ReactNode, FC } from 'react';
import { BodyText } from '@/components/Typography';
import { CustomInput } from '@/components/Form/CustomInput';
import type { InputProps } from 'antd';
import { Row, Col } from 'antd';
import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';
import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';
import styles from './styles/InputGroup.less';

interface IInputGroup extends InputProps {
  horizontal?: boolean;
  rightIcon?: boolean | ReactNode;
  deleteIcon?: boolean | ReactNode;
  onDelete?: () => void;
  onRightIconClick?: () => void;
  required?: boolean;
  fontLevel?: 1 | 2 | 3 | 4 | 5;
  label?: string | ReactNode;
  noWrap?: boolean;
  hasPadding?: boolean;
  hasHeight?: boolean;
  colorPrimaryDark?: boolean;
  colorRequired?: string;
}

const InputGroup: FC<IInputGroup> = ({
  label,
  horizontal,
  fontLevel,
  readOnly,
  noWrap,
  hasPadding,
  hasHeight,
  colorPrimaryDark,
  required,
  colorRequired,
  rightIcon,
  onRightIconClick,
  deleteIcon,
  onDelete,
  value,
  ...props
}) => {
  return (
    <Row
      className={`${styles.inputGroupContainer} ${hasHeight && styles.heightInputGroup}`}
      gutter={0}
      align="middle"
      wrap={noWrap ? false : true}
    >
      <Col span={horizontal ? (noWrap ? undefined : 4) : 24} className="input-label-container">
        <BodyText level={fontLevel ?? 5} customClass="input-label">
          {label}
          {required ? (
            <span
              className={`${colorRequired === 'tertiary' && styles.requiredColorTertiary} ${
                styles.required
              }`}
            >
              *
            </span>
          ) : (
            ''
          )}
          {required ? <span className={styles.colon}>:</span> : ''}
        </BodyText>
      </Col>
      <Col className={styles.inputGroupContent} span={horizontal ? (noWrap ? undefined : 20) : 24}>
        <CustomInput
          {...props}
          value={value}
          fontLevel={fontLevel ? ((fontLevel + 2) as 7) : 7}
          readOnly={rightIcon || readOnly ? true : false}
          className={`input-box ${hasPadding ? 'has-padding' : ''} ${
            colorPrimaryDark ? 'color-primary-dark' : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        />
        {rightIcon ? (
          rightIcon === true ? (
            <SingleRightFormIcon onClick={onRightIconClick} />
          ) : (
            rightIcon
          )
        ) : null}
        {value && deleteIcon ? (
          deleteIcon === true ? (
            <RemoveIcon onClick={onDelete} className="delete-action-input-group" />
          ) : (
            deleteIcon
          )
        ) : null}
      </Col>
    </Row>
  );
};

export default InputGroup;
