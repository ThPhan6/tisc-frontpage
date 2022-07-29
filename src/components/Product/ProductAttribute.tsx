import { CustomTabs } from '@/components/Tabs';
import React from 'react';
import { LIST_TAB } from './constants';
import DownloadContent from './DownloadContent';
import GeneralFeatureAttribute from './GeneralFeatureAttribute';
import ProductVendor from './ProductVendor';
import SpecificationAttribute from './SpecificationAttribute';
import styles from './styles/details.less';
import type { ProductInfoTab } from './types';

interface ProductAttributeInterface {
  activeKey: ProductInfoTab;
  setActiveKey: (activeKey: ProductInfoTab) => void;
}

const ProductAttribute: React.FC<ProductAttributeInterface> = ({ activeKey, setActiveKey }) => {
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
        <GeneralFeatureAttribute activeKey={activeKey} />
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

export default ProductAttribute;
