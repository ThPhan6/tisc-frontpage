import React, { useEffect, useState } from 'react';
import styles from '../detail.less';
import { CustomTabs } from '@/components/Tabs';
import { DownloadContent } from './DownloadContent';
import { SpecificationAttribute } from './SpecificationAttribute';
import { GeneralFeatureAttribute } from './GeneralFeatureAttribute';
import { ProductInfoTab } from './types';
import { ProductVendor } from './ProductVendor';
import { getAllAttribute } from '@/services';
import { ProductAttributeByType } from '@/types';

const LIST_TAB = [
  { tab: 'GENERAL', key: 'general' },
  { tab: 'FEATURE', key: 'feature' },
  { tab: 'SPECIFICATION', key: 'specification' },
  { tab: 'VENDOR', key: 'vendor' },
];

interface ProductAttributeComponentProps {
  activeKey: ProductInfoTab;
  setActiveKey: (activeKey: ProductInfoTab) => void;
}

export const ProductAttributeComponent: React.FC<ProductAttributeComponentProps> = ({
  activeKey,
  setActiveKey,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [attribute, setAttribute] = useState<ProductAttributeByType>({
    general: [],
    feature: [],
    specification: [],
  });

  useEffect(() => {
    getAllAttribute().then((data) => {
      setAttribute(data);
      setTimeout(() => {
        setIsReady(true);
      }, 200);
    });
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <div className={styles.productTabContainer}>
      <CustomTabs
        listTab={LIST_TAB}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        onChange={(key) => setActiveKey(key as ProductInfoTab)}
        activeKey={activeKey}
      />
      {activeKey !== 'vendor' && activeKey !== 'specification' ? (
        <GeneralFeatureAttribute attributes={attribute[activeKey]} activeKey={activeKey} />
      ) : activeKey === 'specification' ? (
        <SpecificationAttribute />
      ) : (
        <ProductVendor>
          <DownloadContent />
        </ProductVendor>
      )}
    </div>
  );
};
