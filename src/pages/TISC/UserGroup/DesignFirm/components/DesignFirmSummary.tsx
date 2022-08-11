import { MenuSummary } from '@/components/MenuSummary';
import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import { getSummary } from '@/services';
import { useEffect, useState } from 'react';
import styles from '../styles/index.less';

const DesignFirmSummary = () => {
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);

  useEffect(() => {
    getSummary().then((data) => {
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

export default DesignFirmSummary;
