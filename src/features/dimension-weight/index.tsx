import { FC, useState } from 'react';

import { Switch } from 'antd';

import { validateFloatNumber } from '@/helper/utils';
import { cloneDeep } from 'lodash';

import { DimensionWeightItem, ProductDimensionWeight } from './types';

import { ConversionText } from '../product/components/ProductAttributes/AttributeComponent';
import CustomCollapse from '@/components/Collapse';
import ConversionInput, { ConversionValueItemProps } from '@/components/EntryForm/ConversionInput';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

interface DimensionWeightProps {
  data: ProductDimensionWeight;
  onChange?: (data: ProductDimensionWeight) => void;
  editable: boolean;
  viewOnly?: boolean;
  noPadding?: boolean;
  collapseStyles?: boolean;
  customClass?: string;
}

export const DimensionWeight: FC<DimensionWeightProps> = ({
  data,
  onChange,
  editable,
  viewOnly,
  noPadding,
  collapseStyles = true,
  customClass,
}) => {
  const [activeCollapse, setActiveCollapse] = useState<boolean>(true);
  const withDiameter = data.with_diameter || undefined;

  const renderAttributeConversionText = (conversionItem: DimensionWeightItem) => {
    if (!conversionItem.conversion_value_1) {
      return null;
    }
    return (
      <tr>
        <td style={{ height: 36, width: '25%', textTransform: 'capitalize', paddingBottom: 0 }}>
          <div className={`${styles.content} ${styles.attribute} attribute-type`}>
            <BodyText fontFamily="Cormorant-Garamond" level={4}>
              {conversionItem.name} :
            </BodyText>
          </div>
        </td>
        <td style={{ width: '75%', paddingBottom: 0 }}>
          <ConversionText
            conversion={conversionItem.conversion}
            firstValue={conversionItem.conversion_value_1}
            secondValue={conversionItem.conversion_value_2}
          />
        </td>
      </tr>
    );
  };

  const renderAttributeConversion = (conversionItem: DimensionWeightItem, index: number) => {
    const notIncluded =
      conversionItem.with_diameter !== null && conversionItem.with_diameter !== data.with_diameter;
    if (notIncluded) {
      return null;
    }

    const curItem: DimensionWeightItem =
      data.attributes.find((el) => el.id === conversionItem.id) || conversionItem;
    if (!curItem || !curItem.conversion_value_1) {
      return null;
    }

    const conversionValue: ConversionValueItemProps = {
      formula_1: curItem.conversion?.formula_1 || 0,
      formula_2: curItem.conversion?.formula_2 || 0,
      unit_1: curItem.conversion?.unit_1 || '',
      unit_2: curItem.conversion?.unit_2 || '',
    };

    return (
      <ConversionInput
        key={curItem.id || index}
        noWrap
        horizontal
        isTableFormat
        fontLevel={4}
        label={
          <BodyText fontFamily="Cormorant-Garamond" level={4}>
            {curItem.name} :
          </BodyText>
        }
        conversionData={conversionValue}
        inputValidation={validateFloatNumber}
        placeholder1="type number"
        placeholder2="type number"
        disabled={!editable}
        setConversionValue={(value) => {
          if (onChange) {
            const newAttributes = cloneDeep(data.attributes);

            newAttributes[index].conversion_value_1 = value.firstValue;
            newAttributes[index].conversion_value_2 = value.secondValue;

            onChange({
              ...data,
              attributes: newAttributes,
            });
          }
        }}
        conversionValue={{
          firstValue: String(curItem.conversion_value_1),
          secondValue: String(curItem.conversion_value_2),
        }}
      />
    );
  };

  const renderDiameterToggle = () => {
    if (!activeCollapse) return null;

    return (
      <div className="slice">
        <RobotoBodyText level={6} fontFamily="Roboto" customClass="text">
          Product with diameter
        </RobotoBodyText>
        <div
          className={styles.switchBtn}
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <Switch
            size="small"
            checkedChildren="ON"
            unCheckedChildren="OFF"
            checked={withDiameter}
            onClick={(toggle, e) => {
              e.stopPropagation();
              onChange?.({ ...data, with_diameter: toggle });
            }}
            style={{ paddingTop: 1 }}
          />
        </div>
      </div>
    );
  };

  if (
    (!data && withDiameter === undefined) ||
    (viewOnly && data.attributes.every((el) => !el.conversion_value_1))
  ) {
    return null;
  }

  return (
    <CustomCollapse
      customHeaderClass={`${styles.dimensionCollapse} ${customClass} ${
        noPadding ? styles.noPadding : ''
      }`}
      showActiveBoxShadow={collapseStyles}
      noBorder={!collapseStyles}
      defaultActiveKey={['1']}
      onChange={() => setActiveCollapse(!activeCollapse)}
      header={
        <div className="header" style={{ paddingLeft: noPadding ? 0 : undefined }}>
          <RobotoBodyText level={6} customClass="label">
            {data.name}
          </RobotoBodyText>
          {editable ? renderDiameterToggle() : null}
        </div>
      }>
      <table className={styles.tableContent}>
        <tbody>
          {data.attributes.map(
            viewOnly ? renderAttributeConversionText : renderAttributeConversion,
          )}
        </tbody>
      </table>
    </CustomCollapse>
  );
};
