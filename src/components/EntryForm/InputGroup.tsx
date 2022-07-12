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
}

const InputGroup: FC<IInputGroup> = ({
  label,
  horizontal,
  rightIcon,
  required,
  fontLevel,
  readOnly,
  noWrap,
  onRightIconClick,
  deleteIcon,
  onDelete,
  ...props
}) => {
  return (
    <Row
      className={styles.inputGroupContainer}
      gutter={0}
      align="middle"
      wrap={noWrap ? false : true}
    >
      <Col span={horizontal ? (noWrap ? undefined : 4) : 24} className="input-label-container">
        <BodyText level={fontLevel ?? 5} customClass="input-label">
          {label}
          {required ? <span className={styles.required}>*</span> : ''}
          {required ? <span>:</span> : ''}
        </BodyText>
      </Col>
      <Col className={styles.inputGroupContent} span={horizontal ? (noWrap ? undefined : 20) : 24}>
        <CustomInput
          {...props}
          fontLevel={fontLevel ? ((fontLevel + 2) as 7) : 7}
          readOnly={rightIcon || readOnly ? true : false}
          className="input-box"
          style={{
            cursor: onRightIconClick ? 'pointer' : 'auto',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onRightIconClick) {
              onRightIconClick();
            }
          }}
        />
        {rightIcon ? (
          rightIcon === true ? (
            <SingleRightFormIcon onClick={onRightIconClick} />
          ) : (
            rightIcon
          )
        ) : null}
        {deleteIcon ? (
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
