import React, { useEffect, useState } from 'react';

import { QUERY_KEY } from '@/constants/util';

import { useGetQueryFromOriginURL } from '@/helper/hook';
import { getAllAttribute } from '@/services';

import { ProductInfoTab } from './types';
import { TabItem } from '@/components/Tabs/types';
import store, { useAppSelector } from '@/reducers';
import { closeProductFooterTab } from '@/reducers/active';
import { ProductAttributeByType } from '@/types';

import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import { ProductAttributeContainer } from './ProductAttributeContainer';
import { ProductVendor } from './ProductVendor';
import styles from './index.less';

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

  const projectProductId = useGetQueryFromOriginURL(QUERY_KEY.project_product_id);

  const { brand_id: brandId } = useAppSelector((s) => s.product.details);

  const LIST_TAB: TabItem[] = [
    { tab: 'GENERAL', key: 'general', disable: !!projectProductId },
    { tab: 'FEATURE', key: 'feature', disable: !!projectProductId },
    { tab: 'SPECIFICATION', tabletTabTitle: 'SPECS', key: 'specification' },
    { tab: 'VENDOR', key: 'vendor', disable: !!projectProductId },
  ];

  useEffect(() => {
    if (!brandId) {
      return;
    }

    getAllAttribute().then((data) => {
      setAttribute(data);
      setTimeout(() => {
        setIsReady(true);
      }, 200);
    });
  }, [brandId]);

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
        onChange={(key) => {
          setActiveKey(key as ProductInfoTab);
          store.dispatch(closeProductFooterTab());
        }}
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
