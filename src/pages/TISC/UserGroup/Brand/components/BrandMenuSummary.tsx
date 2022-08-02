import { MenuSummary } from '@/components/MenuSummary';
import { getBrandSummary } from '@/services';
import { useEffect, useState } from 'react';
import styles from '../styles/index.less';

const BrandMenuSummary = () => {
  const [brandData, setbrandData] = useState<any[]>([]);

  useEffect(() => {
    getBrandSummary().then((data) => {
      if (data) {
        console.log(data);

        setbrandData([]);
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
