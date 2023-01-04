import { FC, useEffect, useState } from 'react';

import { getBrandSummary, getDesignFirmSummary } from '../services';

import { UserGroupProps } from '../types/common.types';
import { DataMenuSummaryProps } from '@/components/MenuSummary/types';

import { MenuSummary } from '@/components/MenuSummary';

import styles from '../styles/index.less';

const MenuHeaderSummary: FC<UserGroupProps> = ({ type }) => {
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);

  const workspace = location.pathname.indexOf('dashboard') !== -1;

  useEffect(() => {
    if (type === 'brand') {
      getBrandSummary(workspace).then((data) => {
        if (data) {
          setSummaryData(data);
        }
      });
    } else {
      getDesignFirmSummary().then((data) => {
        if (data) {
          setSummaryData(data);
        }
      });
    }
  }, []);

  return (
    <MenuSummary
      containerClass={styles.customMenuSummary}
      menuSummaryData={summaryData}
      typeMenu="brand"
    />
  );
};

export default MenuHeaderSummary;
