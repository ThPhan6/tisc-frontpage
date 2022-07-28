import React, { useState, useEffect } from 'react';
import GeneralFeatureAttribute from './GeneralFeatureAttribute';
import SpecificationAttribute from './SpecificationAttribute';
import { CustomTabs } from '@/components/Tabs';
import { getAllAttribute } from '@/services';
import { AttributebyType } from '@/types';
import styles from '@/components/Product/styles/details.less';
import { LIST_TAB } from '../constants';
import type { ProductInfoTab } from '../types';
import ProductVendor from '@/components/Product/ProductVendor';
import DownloadAddContent from '@/components/Product/DownLoadAddContent';

interface ProductAttributeInterface {
  activeKey: ProductInfoTab;
  setActiveKey: (activeKey: ProductInfoTab) => void;
}

const ProductAttribute: React.FC<ProductAttributeInterface> = ({ activeKey, setActiveKey }) => {
  const [isReady, setIsReady] = useState(false);
  const [attribute, setAttribute] = useState<AttributebyType>({
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
        <SpecificationAttribute attributes={attribute.specification} />
      ) : (
        <ProductVendor>
          <DownloadAddContent />
        </ProductVendor>
      )}
    </div>
  );
};

export default ProductAttribute;
