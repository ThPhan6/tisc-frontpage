import { FC } from 'react';

import { Switch } from 'antd';

import { cloneDeep } from 'lodash';

import { FeatureLabelPros } from '../types';
import store, { useAppSelector } from '@/reducers';

import { RobotoBodyText } from '@/components/Typography';

import styles from './ProductLabelSwitch.less';

interface ProductLabelSwitchPros {
  data: FeatureLabelPros;
  editable: boolean;
  onClick?: (data: FeatureLabelPros) => void;
}

export const ProductLabelSwitch: FC<ProductLabelSwitchPros> = ({ data, editable, onClick }) => {
  const feature_keys = Object.keys(data);
  const newData = cloneDeep(data);
  return (
    <div className={styles.featureContainer}>
      {feature_keys.map((key) => {
        return (
          <div className={styles.content}>
            <RobotoBodyText level={5} customClass="text">
              {data[key].name}
            </RobotoBodyText>
            <Switch
              size="default"
              checkedChildren="ON"
              unCheckedChildren="OFF"
              className="switchBtn"
              checked={data[key].value}
              onClick={(toggle, e) => {
                e.stopPropagation();
                if (!editable) return;
                newData[key].value = toggle;
                onClick?.(newData);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
