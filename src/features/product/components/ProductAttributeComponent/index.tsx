import React, { useEffect, useState } from 'react';

import { getAllAttribute } from '@/services';

import { ProductInfoTab } from './types';
import { ProductAttributeByType } from '@/types';

import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from '../detail.less';
import { ProductAttributeContainer } from './ProductAttributeContainer';
import { ProductVendor } from './ProductVendor';

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

      <CustomTabPane active={activeKey === 'general'}>
        <ProductAttributeContainer attributes={attribute.general} activeKey={'general'} />
      </CustomTabPane>

      <CustomTabPane active={activeKey === 'feature'}>
        <ProductAttributeContainer attributes={attribute.feature} activeKey={'feature'} />
      </CustomTabPane>

      <CustomTabPane active={activeKey === 'specification'}>
        <ProductAttributeContainer
          attributes={attribute.specification}
          activeKey={'specification'}
        />
      </CustomTabPane>

      <CustomTabPane active={activeKey === 'vendor'}>
        <ProductVendor />
      </CustomTabPane>
    </div>
  );
};
