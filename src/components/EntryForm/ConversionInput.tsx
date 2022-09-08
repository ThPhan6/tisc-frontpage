import type { FC, ReactNode } from 'react';

import { Col, Row } from 'antd';

import { MainContentProps } from './types';
import type { SubBasisConversion } from '@/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import TableContent from '../Table/TableContent';
import styles from './styles/InputGroup.less';
import { useGeneralFeature } from './utils';

const ConversionContent: FC<MainContentProps> = ({ children, noWrap }) => (
  <Row className={styles.inputGroupContainer} gutter={0} align="middle" wrap={!noWrap}>
    {children}
  </Row>
);

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
  deleteIcon?: boolean;
  onDelete?: () => void;
  conversionValue: ConversionValue;
  setConversionValue: (data: ConversionValue) => void;
  isTableFormat?: boolean;
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
  isTableFormat,
}) => {
  const { labelSpan, inputSpan, fontSize, iconDelete } = useGeneralFeature(
    noWrap,
    fontLevel,
    deleteIcon,
    onDelete,
    horizontal,
  );

  const renderLabel = () => (
    <Col span={labelSpan} className="input-label-container">
      <BodyText level={fontLevel ?? 5} customClass="input-label">
        {label}
        {required ? <span className={styles.required}>*</span> : ''}
        {required ? <span>:</span> : ''}
      </BodyText>
    </Col>
  );

  const renderInput = () => (
    <Col className={styles.doubleinputGroupContent} span={inputSpan}>
      <div className="double-input-group-wrapper">
        <div className="double-input-group">
          <CustomInput
            autoFocus
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
            fontLevel={fontSize}
            className="first-input-box"
            onClick={(e) => e.stopPropagation()}
            autoWidth
            defaultWidth={30}
          />
          <BodyText level={fontSize} fontFamily="Roboto" customClass="unit-input-label">
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
            fontLevel={fontSize}
            className="first-input-box"
            onClick={(e) => e.stopPropagation()}
            autoWidth
            defaultWidth={30}
          />
          <BodyText level={fontSize} fontFamily="Roboto" customClass="unit-input-label">
            {conversionData.unit_2}
          </BodyText>
        </div>
      </div>
      {iconDelete}
    </Col>
  );

  if (isTableFormat) {
    return (
      <TableContent
        textLeft={<ConversionContent noWrap={noWrap}>{renderLabel()}</ConversionContent>}
        textRight={<ConversionContent noWrap={noWrap}>{renderInput()}</ConversionContent>}
      />
    );
  }

  return (
    <ConversionContent noWrap={noWrap}>
      {renderLabel()}
      {renderInput()}
    </ConversionContent>
  );
};

export default ConversionInput;
