import type { ReactNode, FC } from 'react';
import { BodyText } from '@/components/Typography';
import { CustomInput } from '@/components/Form/CustomInput';
import { Row, Col } from 'antd';
import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';
import styles from './styles/InputGroup.less';
import type { ISubBasisConversion } from '@/types';

interface IConversionValue {
  firstValue: string;
  secondValue: string;
}

interface IConversionInput {
  horizontal?: boolean;
  required?: boolean;
  fontLevel?: 1 | 2 | 3 | 4 | 5;
  label?: string | ReactNode;
  noWrap?: boolean;
  conversionData: ISubBasisConversion;
  placeholder1?: string;
  placeholder2?: string;
  deleteIcon?: boolean | ReactNode;
  onDelete?: () => void;
  conversionValue: IConversionValue;
  setConversionValue: (data: IConversionValue) => void;
}

const ConversionInput: FC<IConversionInput> = ({
  label,
  horizontal,
  required,
  fontLevel,
  noWrap,
  conversionData,
  placeholder1,
  placeholder2,
  deleteIcon,
  onDelete,
  conversionValue,
  setConversionValue,
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
      <Col
        className={styles.doubleinputGroupContent}
        span={horizontal ? (noWrap ? undefined : 20) : 24}
      >
        <div className="double-input-group-wrapper">
          <div className="double-input-group">
            <CustomInput
              value={conversionValue.firstValue}
              placeholder={placeholder1}
              onChange={(e) => {
                const firstValue = e.target.value;
                const secondValue = parseFloat(firstValue) * conversionData.formula_2;
                setConversionValue({
                  firstValue: firstValue,
                  secondValue: isNaN(secondValue) ? '' : secondValue.toString(),
                });
              }}
              fontLevel={fontLevel ? ((fontLevel + 2) as 7) : 7}
              className="first-input-box"
              onClick={(e) => e.stopPropagation()}
              autoWidth
              defaultWidth={30}
            />
            <BodyText
              level={fontLevel ? ((fontLevel + 2) as 7) : 7}
              fontFamily="Roboto"
              customClass="first-input-label"
            >
              {conversionData.unit_1}
            </BodyText>
          </div>
          <div className="double-input-group">
            <CustomInput
              value={conversionValue.secondValue}
              placeholder={placeholder2}
              onChange={(e) => {
                const secondValue = e.target.value;
                const firstValue = parseFloat(secondValue) * conversionData.formula_1;
                setConversionValue({
                  firstValue: isNaN(firstValue) ? '' : firstValue.toString(),
                  secondValue: secondValue,
                });
              }}
              fontLevel={fontLevel ? ((fontLevel + 2) as 7) : 7}
              className="first-input-box"
              onClick={(e) => e.stopPropagation()}
              autoWidth
              defaultWidth={30}
            />
            <BodyText
              level={fontLevel ? ((fontLevel + 2) as 7) : 7}
              fontFamily="Roboto"
              customClass="first-input-label"
            >
              {conversionData.unit_2}
            </BodyText>
          </div>
        </div>
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

export default ConversionInput;
