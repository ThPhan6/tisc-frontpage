import { FC, useEffect, useState } from 'react';

import { getBrandSummary, getDesignFirmSummary } from '../services';

import { UserGroupProps } from '../types/common.types';
import { DataMenuSummaryProps } from '@/components/MenuSummary/types';

import { MenuSummary } from '@/components/MenuSummary';

import styles from '../styles/index.less';

const MenuHeaderSummary: FC<UserGroupProps> = ({ type }) => {
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);

  const fetchSummary = type === 'brand' ? getBrandSummary : getDesignFirmSummary;

  useEffect(() => {
    fetchSummary().then((data) => {
      if (data) {
        setSummaryData(data);
      }
    });
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
