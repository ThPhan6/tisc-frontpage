import { FC, useEffect, useState } from 'react';

import { Switch } from 'antd';

import { getDimensionWeightList } from './services';
import { validateFloatNumber } from '@/helper/utils';

import { DimensionWeightItem, ProductDimensionWeight } from './types';

import CustomCollapse from '@/components/Collapse';
import ConversionInput, {
  ConversionValue,
  ConversionValueItemProps,
} from '@/components/EntryForm/ConversionInput';
import { RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

interface DimensionWeightProps {
  data: ProductDimensionWeight;
  setData?: (data: ProductDimensionWeight) => void;
  editable: boolean;
  onChange?: (index: number, value: ConversionValue) => void;
  collapseStyles?: boolean;
  customClass?: string;
}

export const DimensionWeight: FC<DimensionWeightProps> = ({
  data,
  setData,
  editable,
  onChange,
  collapseStyles = true,
  customClass,
}) => {
  const [diameterToggle, setDiameterToggle] = useState<boolean | undefined>(undefined);
  const [activeCollapse, setActiveCollapse] = useState<boolean>(true);

  useEffect(() => {
    if (!editable) {
      setDiameterToggle(data?.with_diameter);
      return;
    }

    getDimensionWeightList().then((res) => {
      if (res) {
        let newData: ProductDimensionWeight = {
          id: res.id,
          name: res.name,
          with_diameter: res.with_diameter,
          attributes: res.attributes,
        };

        /// mapping data of attributes selected
        const newAttribute: DimensionWeightItem[] = res.attributes;
        if (data?.attributes?.length) {
          for (const elements of newAttribute) {
            const selectedAttribute = data.attributes.find(
              (item) =>
                item.id === elements.id && item.conversion_value_1 && item.conversion_value_2,
            );

            if (selectedAttribute) {
              elements.conversion_value_1 = selectedAttribute.conversion_value_1;
              elements.conversion_value_2 = selectedAttribute.conversion_value_2;
            }
          }

          newData = {
            ...newData,
            id: data.id,
            with_diameter: data.with_diameter,
            attributes: newAttribute,
          };
        }

        // update data
        setData?.(newData);
        ///
        setDiameterToggle(newData.with_diameter);
      }
    });
  }, []);

  const renderAttributeConversion = (conversionItem: DimensionWeightItem, index: number) => {
    const conversionValue: ConversionValueItemProps = {
      formula_1: conversionItem.conversion?.formula_1 || 0,
      formula_2: conversionItem.conversion?.formula_2 || 0,
      unit_1: conversionItem.conversion?.unit_1 || '',
      unit_2: conversionItem.conversion?.unit_2 || '',
    };

    return (
      <ConversionInput
        key={conversionItem.id || index}
        noWrap
        horizontal
        isTableFormat
        fontLevel={4}
        label={<RobotoBodyText level={6}>{conversionItem.name} :</RobotoBodyText>}
        conversionData={conversionValue}
        inputValidation={validateFloatNumber}
        placeholder1="type number"
        placeholder2="type number"
        disabled={!editable}
        conversionValue={{
          firstValue: String(conversionItem.conversion_value_1),
          secondValue: String(conversionItem.conversion_value_2),
        }}
        setConversionValue={(value) => onChange?.(index, value)}
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
            checked={diameterToggle}
            onClick={(toggle, e) => {
              e.stopPropagation();
              setDiameterToggle(toggle);
              setData?.({ ...data, with_diameter: toggle });
            }}
          />
        </div>
      </div>
    );
  };

  if (!data && diameterToggle === undefined) {
    return null;
  }

  return (
    <CustomCollapse
      customHeaderClass={`${styles.dimensionCollapse} ${customClass}`}
      showActiveBoxShadow={collapseStyles}
      noBorder={!collapseStyles}
      defaultActiveKey={['1']}
      onChange={() => setActiveCollapse(!activeCollapse)}
      header={
        <div className="header">
          <RobotoBodyText level={6} customClass="label">
            {data.name}
          </RobotoBodyText>
          {editable ? renderDiameterToggle() : null}
        </div>
      }>
      <table className={styles.tableContent}>
        <tbody>
          {data.attributes?.map((attribute, index) => {
            if (attribute.with_diameter === diameterToggle || attribute.with_diameter === null) {
              return renderAttributeConversion(attribute, index);
            }
          })}
        </tbody>
      </table>
    </CustomCollapse>
  );
};
