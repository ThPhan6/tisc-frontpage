import { FC, useEffect, useState } from 'react';

import { Switch } from 'antd';

import { getDimensionWeightList } from './services';
import { validateFloatNumber } from '@/helper/utils';

// import { setPartialProductDetail } from '../product/reducers';
import { ProductDimensionWeight } from './types';

// import store from '@/reducers';
import CustomCollapse from '@/components/Collapse';
import ConversionInput, { ConversionItemValue } from '@/components/EntryForm/ConversionInput';
import { RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

const DEFAULT_STATE: ProductDimensionWeight = {
  id: '',
  name: '',
  with_diameter: true,
  attributes: [],
};

interface DimensionWeightProps {
  value?: any;
  onChange?: (data: ProductDimensionWeight) => void;
  type?: string;
  customClass?: string;
}

const ConversionInputItem: FC<{
  data: ProductDimensionWeight;
  setData: (data: ProductDimensionWeight) => void;
  index: number;
}> = ({ data, setData, index }) => {
  const conversionItem = data.attributes[index];

  console.log(data.attributes[index]);

  const conversionValueItem: ConversionItemValue = {
    formula_1: Number(conversionItem.conversion?.formula_1),
    formula_2: Number(conversionItem.conversion?.formula_2),
    unit_1: conversionItem.conversion?.unit_1 || '',
    unit_2: conversionItem.conversion?.unit_2 || '',
  };

  return (
    <ConversionInput
      key={index}
      noWrap
      horizontal
      isTableFormat
      fontLevel={4}
      label={<RobotoBodyText level={6}>{conversionItem.name} :</RobotoBodyText>}
      conversionData={conversionValueItem}
      inputValidation={validateFloatNumber}
      placeholder1="type number"
      placeholder2="type number"
      conversionValue={{
        firstValue: conversionItem.conversion_value_1,
        secondValue: conversionItem.conversion_value_2,
      }}
      setConversionValue={(conversionValue) => {
        console.log('conversionValue', conversionValue);

        const newAttributeData = [...data.attributes];
        newAttributeData[index] = {
          ...newAttributeData[index],
          conversion_value_1: conversionValue.firstValue,
          conversion_value_2: conversionValue.secondValue,
        };

        const newData: ProductDimensionWeight = {
          ...data,
          attributes: newAttributeData,
        };

        // store.dispatch(
        //   setPartialProductDetail({
        //     dimension_and_weight: newData,
        //   }),
        // );
        setData(newData);
      }}
    />
  );
};

export const DimensionWeight: FC<DimensionWeightProps> = ({ customClass = '' }) => {
  const [diameterToogle, setDiameterToogle] = useState<boolean>();
  const [activeCollapse, setActiveCollapse] = useState<boolean>(true);

  const [data, setData] = useState<ProductDimensionWeight>(DEFAULT_STATE);

  // get list dimension weight data
  useEffect(() => {
    getDimensionWeightList().then((res) => {
      if (res) {
        setData(res);
        setDiameterToogle(res.with_diameter);
      }
    });
  }, []);

  console.log('data', data);

  return (
    <CustomCollapse
      customHeaderClass={`${styles.dimensionCollapse} ${customClass}`}
      showActiveBoxShadow
      defaultActiveKey={['1']}
      onChange={() => setActiveCollapse(!activeCollapse)}
      header={
        <div className={styles.header}>
          <RobotoBodyText level={6} customClass="label">
            {data.name}
          </RobotoBodyText>
          {activeCollapse ? (
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
                  defaultChecked={diameterToogle}
                  onClick={(_c, e) => {
                    e.stopPropagation();
                    setDiameterToogle(!diameterToogle);
                    // store.dispatch(
                    //   setPartialProductDetail({
                    //     dimension_and_weight: {
                    //       ...data,
                    //       with_diameter: diameterToogle ? true : false,
                    //     },
                    //   }),
                    // );
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      }>
      <table className={styles.tableContent}>
        <tbody>
          {data.attributes.map((attribute, index) => {
            if (attribute.with_diameter === diameterToogle || attribute.with_diameter === null) {
              return <ConversionInputItem data={data} setData={setData} index={index} />;
            }
          })}
        </tbody>
      </table>
    </CustomCollapse>
  );
};
