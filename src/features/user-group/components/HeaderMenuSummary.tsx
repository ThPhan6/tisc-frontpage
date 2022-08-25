import { FC, useEffect, useState } from 'react';

import { getBrandSummary, getSummary } from '../services';

import { UserGroupProps } from '../types/common.types';
import { DataMenuSummaryProps } from '@/components/MenuSummary/types';

import { MenuSummary } from '@/components/MenuSummary';

import styles from '../styles/index.less';

const HeaderMenuSummary: FC<UserGroupProps> = ({ type }) => {
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);

  useEffect(() => {
    if (type === 'brand')
      getBrandSummary().then((data) => {
        if (data) {
          setSummaryData(data);
        }
      });

    if (type === 'design') {
      getSummary().then((data) => {
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

export default HeaderMenuSummary;
