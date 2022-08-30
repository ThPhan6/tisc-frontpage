import type { FC, ReactNode } from 'react';

import { Col, Row } from 'antd';

import type { SubBasisConversion } from '@/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import styles from './styles/InputGroup.less';
import { useGeneralFeature } from './utils';

interface ConversionValue {
  firstValue: string;
  secondValue: string;
}

interface ConversionInputProps {
  horizontal?: boolean;
  required?: boolean;
  fontLevel?: 1 | 2 | 3 | 4 | 5;
  label?: string | ReactNode;
  noWrap?: boolean;
  conversionData: SubBasisConversion;
  placeholder1?: string;
  placeholder2?: string;
  deleteIcon?: boolean | ReactNode;
  onDelete?: () => void;
  conversionValue: ConversionValue;
  setConversionValue: (data: ConversionValue) => void;
}

const ConversionInput: FC<ConversionInputProps> = ({
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
  const { span_4, span_20, hasFontLevel, hasDeleteIcon } = useGeneralFeature(
    noWrap,
    fontLevel,
    deleteIcon,
    onDelete,
  );
  return (
    <Row className={styles.inputGroupContainer} gutter={0} align="middle" wrap={noWrap}>
      <Col span={horizontal ? span_4 : 24} className="input-label-container">
        <BodyText level={fontLevel ?? 5} customClass="input-label">
          {label}
          {required ? <span className={styles.required}>*</span> : ''}
          {required ? <span>:</span> : ''}
        </BodyText>
      </Col>
      <Col className={styles.doubleinputGroupContent} span={horizontal ? span_20 : 24}>
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
              fontLevel={hasFontLevel}
              className="first-input-box"
              onClick={(e) => e.stopPropagation()}
              autoWidth
              defaultWidth={30}
            />
            <BodyText level={hasFontLevel} fontFamily="Roboto" customClass="unit-input-label">
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
              fontLevel={hasFontLevel}
              className="first-input-box"
              onClick={(e) => e.stopPropagation()}
              autoWidth
              defaultWidth={30}
            />
            <BodyText level={hasFontLevel} fontFamily="Roboto" customClass="unit-input-label">
              {conversionData.unit_2}
            </BodyText>
          </div>
        </div>
        {deleteIcon ? hasDeleteIcon : null}
      </Col>
    </Row>
  );
};

export default ConversionInput;
