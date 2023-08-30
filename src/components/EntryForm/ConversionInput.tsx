import { FC, ReactNode } from 'react';

import { Col, Row } from 'antd';

import { CustomInputProps } from '../Form/types';
import { MainContentProps } from './types';

import { BodyText } from '@/components/Typography';

import { MaskedNumberInput } from '../CustomNumberInput.tsx';
import TableContent from '../Table/TableContent';
import styles from './styles/InputGroup.less';
import { formatToConversionInputValue, useGeneralFeature } from './utils';

const ConversionContent: FC<MainContentProps> = ({ children, noWrap }) => (
  <Row className={styles.inputGroupContainer} gutter={0} align="middle" wrap={!noWrap}>
    {children}
  </Row>
);

export interface ConversionValue {
  firstValue: string;
  secondValue: string;
}

export interface ConversionValueItemProps {
  formula_1: number;
  formula_2: number;
  unit_1: string;
  unit_2: string;
}

interface ConversionInputProps extends CustomInputProps {
  horizontal?: boolean;
  required?: boolean;
  fontLevel?: 1 | 2 | 3 | 4 | 5;
  label?: string | ReactNode;
  noWrap?: boolean;
  conversionData: ConversionValueItemProps;
  placeholder1?: string;
  placeholder2?: string;
  deleteIcon?: boolean;
  onDelete?: () => void;
  conversionValue: ConversionValue;
  setConversionValue: (data: ConversionValue) => void;
  isTableFormat?: boolean;
  labelTitle?: string;
}

const ConversionInput: FC<ConversionInputProps> = ({
  label = '',
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
  labelTitle,
  ...props
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
      <BodyText level={fontLevel ?? 5} customClass="input-label" title={labelTitle}>
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
          <MaskedNumberInput
            {...props}
            decimalLimit={6}
            autoFocus
            value={conversionValue.firstValue}
            placeholder={placeholder1}
            onChange={(e) => {
              const firstValue = e.target.value.replace(/,/g, '');
              const secondValue = formatToConversionInputValue(
                Number(firstValue.replaceAll(',', '')) * Number(conversionData.formula_2),
              );
              setConversionValue({
                firstValue: firstValue,
                secondValue: secondValue,
              });
            }}
            fontLevel={fontSize}
            onClick={(e) => e.stopPropagation()}
            style={{ height: '22px', background: '#fff', marginTop: '2px' }}
          />
          <BodyText level={fontSize} fontFamily="Roboto" customClass="unit-input-label">
            {conversionData.unit_1}
          </BodyText>
        </div>
        <div className="double-input-group">
          <MaskedNumberInput
            {...props}
            decimalLimit={6}
            value={conversionValue.secondValue}
            placeholder={placeholder2}
            onChange={(e) => {
              const secondValue = e.target.value.replace(/,/g, '');
              const firstValue = formatToConversionInputValue(
                Number(secondValue.replaceAll(',', '')) * Number(conversionData.formula_1),
              );
              setConversionValue({
                firstValue: firstValue,
                secondValue: secondValue,
              });
            }}
            fontLevel={fontSize}
            onClick={(e) => e.stopPropagation()}
            style={{ height: '22px', background: '#fff', marginTop: '2px' }}
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
