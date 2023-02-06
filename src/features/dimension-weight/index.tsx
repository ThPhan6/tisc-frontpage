import { FC, useEffect, useState } from 'react';

import { Switch } from 'antd';

import { validateFloatNumber } from '@/helper/utils';
import { cloneDeep } from 'lodash';

import { ProductInfoTab } from '../product/components/ProductAttributes/types';
import { DimensionWeightItem, ProductDimensionWeight } from './types';
import store from '@/reducers';
import { closeProductFooterTab, useCollapseGroupActiveCheck } from '@/reducers/active';

import CustomCollapse from '@/components/Collapse';
import ConversionInput, { ConversionValueItemProps } from '@/components/EntryForm/ConversionInput';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import { AttributeConversionText } from './AttributeConversionText';
import styles from './index.less';

interface DimensionWeightProps {
  data: ProductDimensionWeight;
  onChange?: (data: ProductDimensionWeight) => void;
  editable: boolean;
  isShow: boolean;
  isConversionText?: boolean;
  arrowAlignRight?: boolean;
  noPadding?: boolean;
  collapseStyles?: boolean;
  customClass?: string;
}

export const DimensionWeight: FC<DimensionWeightProps> = ({
  data,
  onChange,
  editable,
  isShow,
  isConversionText,
  arrowAlignRight,
  noPadding,
  collapseStyles = true,
  customClass = '',
}) => {
  const { curActiveKey, onKeyChange } = useCollapseGroupActiveCheck(
    'specification' as ProductInfoTab,
    0, // index 0 for Dimension & Weight group
  );

  const [diameterToggle, setDiameterToggle] = useState<boolean>(data.with_diameter);

  useEffect(() => {
    setDiameterToggle(data.with_diameter);
  }, [data.with_diameter]);

  const renderAttributeConversion = (conversionItem: DimensionWeightItem, index: number) => {
    const notIncluded =
      conversionItem.with_diameter !== null && conversionItem.with_diameter !== data.with_diameter;
    if (notIncluded) {
      return null;
    }

    const curItem: DimensionWeightItem =
      data.attributes.find((el) => el.id === conversionItem.id) || conversionItem;
    if (!curItem) {
      return null;
    }

    if (!editable && !conversionItem.conversion_value_1) {
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
    if (!curActiveKey && curActiveKey?.length === 0) return null;

    return (
      <div className="slice">
        <RobotoBodyText level={6} customClass="text">
          Product with diameter
        </RobotoBodyText>
        <div
          className={styles.switchBtn}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Switch
            size="small"
            checkedChildren="ON"
            unCheckedChildren="OFF"
            checked={diameterToggle}
            onClick={(toggle, e) => {
              e.stopPropagation();
              onChange?.({ ...data, with_diameter: toggle });
              setDiameterToggle(toggle);
            }}
            style={{ paddingTop: 1 }}
          />
        </div>
      </div>
    );
  };

  if (
    !isShow ||
    (!data && diameterToggle === undefined) ||
    (!editable &&
      !data.attributes.some(
        (el) =>
          (el.with_diameter === data.with_diameter || el.with_diameter === null) &&
          el.conversion_value_1,
      ))
  ) {
    return null;
  }

  return (
    <CustomCollapse
      activeKey={curActiveKey}
      onChange={(key) => {
        onKeyChange(key);
        store.dispatch(closeProductFooterTab());
      }}
      customHeaderClass={`${styles.dimensionCollapse} ${customClass} ${
        noPadding ? styles.noPadding : ''
      } ${isConversionText ? styles.dimensionWeightSpec : ''}`}
      showActiveBoxShadow={collapseStyles}
      expandingHeaderFontStyle="bold"
      arrowAlignRight={arrowAlignRight}
      noBorder={!collapseStyles}
      header={
        <div className="header" style={{ paddingLeft: noPadding ? 0 : undefined }}>
          <RobotoBodyText level={6} customClass="label">
            {data.name}
          </RobotoBodyText>
          {editable && curActiveKey?.length ? renderDiameterToggle() : null}
        </div>
      }
    >
      <table className={styles.tableContent}>
        <tbody>
          {data.attributes.map((conversionItem, index) =>
            isConversionText ? (
              <AttributeConversionText
                key={conversionItem.id || index}
                data={data}
                conversionItem={conversionItem}
              />
            ) : (
              renderAttributeConversion(conversionItem, index)
            ),
          )}
        </tbody>
      </table>
    </CustomCollapse>
  );
};
