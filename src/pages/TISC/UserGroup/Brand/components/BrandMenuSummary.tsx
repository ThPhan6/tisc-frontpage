import { useEffect, useState } from 'react';

import { getBrandSummary } from '@/services';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';

import { MenuSummary } from '@/components/MenuSummary';

import styles from '../styles/index.less';

const BrandMenuSummary = () => {
  const [brandData, setbrandData] = useState<DataMenuSummaryProps[]>([]);

  useEffect(() => {
    getBrandSummary().then((data) => {
      if (data) {
        setbrandData(data);
      }
    });
  }, []);

  return (
    <MenuSummary
      containerClass={styles.customMenuSummary}
      menuSummaryData={brandData}
      typeMenu="brand"
    />
  );
};

export default BrandMenuSummary;
