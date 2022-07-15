import React, { useState, useEffect } from 'react';
import GeneralFeatureAttribute from './GeneralFeatureAttribute';
import SpecificationAttribute from './SpecificationAttribute';
import ProductVendor from './ProductVendor';
import { CustomTabs } from '@/components/Tabs';
import { getAllAttribute } from '@/services';
import { IAttributebyType } from '@/types';
import styles from '../styles/details.less';
import { LIST_TAB } from '../constants';
import type { ACTIVE_KEY } from '../types';

interface ProductAttributeInterface {
  activeKey: ACTIVE_KEY;
  setActiveKey: (activeKey: ACTIVE_KEY) => void;
}

const ProductAttribute: React.FC<ProductAttributeInterface> = ({ activeKey, setActiveKey }) => {
  const [isReady, setIsReady] = useState(false);
  const [attribute, setAttribute] = useState<IAttributebyType>({
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
        onChange={(key) => setActiveKey(key as ACTIVE_KEY)}
        activeKey={activeKey}
      />
      {activeKey !== 'vendor' && activeKey !== 'specification' ? (
        <GeneralFeatureAttribute attributes={attribute[activeKey]} activeKey={activeKey} />
      ) : activeKey === 'specification' ? (
        <SpecificationAttribute attributes={attribute.specification} />
      ) : (
        <ProductVendor />
      )}
    </div>
  );
};

export default ProductAttribute;
