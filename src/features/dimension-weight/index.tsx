import { useState } from 'react';

import { Switch } from 'antd';

import { DimensionWeightConversion } from './types';

import CustomCollapse from '@/components/Collapse';
import ConversionInput from '@/components/EntryForm/ConversionInput';
import { RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

export const productWithDiameterData: DimensionWeightConversion[] = [
  {
    id: '1',
    name: 'Overal Length : ',
    formula_1: 1,
    formula_2: 22222222222222222222,
    unit_1: 'mm',
    unit_2: 'in',
  },
  {
    id: '2',
    name: 'Overal Diameter : ',
    formula_1: 11111111111111111111111111111,
    formula_2: 22,
    unit_1: 'mm',
    unit_2: 'in',
  },
  {
    id: '3',
    name: 'Total Weight : ',
    formula_1: 11,
    formula_2: 22,
    unit_1: 'kg',
    unit_2: 'lb',
  },
];

export const productWithNoneDiameterData: DimensionWeightConversion[] = [
  {
    id: '1',
    name: 'Overal Length : ',
    formula_1: 1,
    formula_2: 2,
    unit_1: 'mm',
    unit_2: 'in',
  },
  {
    id: '2',
    name: 'Overal Width : ',
    formula_1: 1,
    formula_2: 2,
    unit_1: 'mm',
    unit_2: 'in',
  },
  {
    id: '3',
    name: 'Overal Height : ',
    formula_1: 11,
    formula_2: 22,
    unit_1: 'mm',
    unit_2: 'in',
  },
  {
    id: '4',
    name: 'Total Weight : ',
    formula_1: 11,
    formula_2: 22,
    unit_1: 'kg',
    unit_2: 'lb',
  },
];

export const DimensionWeight = () => {
  const [diameterToogle, setDiameterToogle] = useState<boolean>(true);
  const [activeCollapse, setActiveCollapse] = useState<boolean>(true);

  const renderConversionIpout = (basisData: DimensionWeightConversion) => {
    return (
      <ConversionInput
        noWrap
        horizontal
        fontLevel={4}
        label={basisData.name}
        conversionData={basisData}
        placeholder1="type number"
        placeholder2="type number"
        conversionValue={{
          firstValue: String(basisData.formula_1),
          secondValue: String(basisData.formula_1),
        }}
        setConversionValue={() => {
          // onChangeAttributeItem(attributeItemIndex, {
          //   conversion_value_1: data.firstValue,
          //   conversion_value_2: data.secondValue,
          // });
        }}
      />
    );
  };

  return (
    <CustomCollapse
      customHeaderClass={styles.dimensionCollapse}
      showActiveBoxShadow
      defaultActiveKey={['1']}
      onChange={() => setActiveCollapse(!activeCollapse)}
      header={
        <div className="header">
          <RobotoBodyText level={6} customClass="label">
            Dimension & Weight
          </RobotoBodyText>
          {activeCollapse ? (
            <div className="slice">
              <RobotoBodyText level={6} fontFamily="Roboto" customClass="text">
                Product with diameter
              </RobotoBodyText>
              <Switch
                size="small"
                checkedChildren="On"
                unCheckedChildren="Off"
                defaultChecked
                onClick={(_c, e) => {
                  e.stopPropagation();
                  setDiameterToogle(!diameterToogle);
                }}
              />
            </div>
          ) : null}
        </div>
      }>
      {diameterToogle
        ? productWithDiameterData.map((basis) => renderConversionIpout(basis))
        : productWithNoneDiameterData.map((basis) => renderConversionIpout(basis))}
    </CustomCollapse>
  );
};
