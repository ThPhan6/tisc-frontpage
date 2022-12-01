import { FC, useEffect, useState } from 'react';

import { getAllCustomResource } from '../../services';

import { RadioValue } from '@/components/CustomRadio/types';
import { CustomResourceType } from '@/pages/Designer/CustomResource/type';

import Popover from '@/components/Modal/Popover';

import styles from './index.less';

export interface BrandCompanyModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: RadioValue;
  setChosenValue: (value: any) => void;
}

export const BrandCompanyModal: FC<BrandCompanyModalProps> = ({
  visible,
  setVisible,
  chosenValue,
  setChosenValue,
}) => {
  const [data, setData] = useState<RadioValue[]>([]);

  useEffect(() => {
    getAllCustomResource(CustomResourceType.Brand).then((res) => {
      if (res) {
        setData(res.map((item) => ({ value: item.id, label: item.name })));
      }
    });
  }, []);

  return (
    <Popover
      title="SELECT BRAND"
      className={styles.paddingLeftName}
      visible={visible}
      setVisible={setVisible}
      chosenValue={
        chosenValue
          ? {
              value: chosenValue.value,
              label: chosenValue.label,
            }
          : undefined
      }
      setChosenValue={(selected) => {
        setChosenValue(selected);
      }}
      groupRadioList={[{ options: data }]}
    />
  );
};
