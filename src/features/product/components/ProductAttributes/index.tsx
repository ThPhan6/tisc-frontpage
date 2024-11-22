import React, { createContext, useEffect, useMemo, useState } from 'react';

import { QUERY_KEY } from '@/constants/util';
import { Spin } from 'antd';

import { useGetQueryFromOriginURL } from '@/helper/hook';
import { getAllAttribute } from '@/services';

import { ProductInfoTab } from './types';
import { TabItem } from '@/components/Tabs/types';
import store, { useAppSelector } from '@/reducers';
import { closeProductFooterTab } from '@/reducers/active';
import {
  EGetAllAttributeType,
  ProductAttributeByType,
  ProductAttributeWithSubAdditionByType,
} from '@/types';

import loadingStyles from '@/components/LoadingPage/styles/index.less';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import { ProductAttributeContainer } from './ProductAttributeContainer';
import { ProductVendor } from './ProductVendor';
import styles from './index.less';

const DEFAULT_ALL_ATTRIBUTE = {
  general: [],
  feature: [],
  specification: [],
};

export const ProductAttributeComponentContext = createContext<{
  /// to check already called attributes with sub addtionally
  isGetAllAttributeFilterByBrand: boolean;
  setIsGetAllAttributeFilterByBrand: (isGetAllAttributeFilterByBrand: boolean) => void;

  /// attribute with sub additionally and filter by brand
  attributeListFilterByBrand: ProductAttributeWithSubAdditionByType;
  setAllAttributeFilterByBrand: (data: ProductAttributeWithSubAdditionByType) => void;
}>({
  isGetAllAttributeFilterByBrand: false,
  setIsGetAllAttributeFilterByBrand: (isGetAllAttributeFilterByBrand: boolean) => null,
  attributeListFilterByBrand: DEFAULT_ALL_ATTRIBUTE,
  setAllAttributeFilterByBrand: (data: ProductAttributeWithSubAdditionByType) => null,
});

interface ProductAttributeComponentProps {
  activeKey: ProductInfoTab;
  setActiveKey: (activeKey: ProductInfoTab) => void;
}

export const ProductAttributeComponent: React.FC<ProductAttributeComponentProps> = ({
  activeKey,
  setActiveKey,
}) => {
  const [isReady, setIsReady] = useState(false);
  /// attribute has none sub, without filter by brand
  const [attribute, setAttribute] = useState<ProductAttributeByType>(DEFAULT_ALL_ATTRIBUTE);

  const [isGetAllAttributeFilterByBrand, setIsGetAllAttributeFilterByBrand] =
    useState<boolean>(false);

  const [attributeListFilterByBrand, setAllAttributeFilterByBrand] =
    useState<ProductAttributeWithSubAdditionByType>(DEFAULT_ALL_ATTRIBUTE);

  const projectProductId = useGetQueryFromOriginURL(QUERY_KEY.project_product_id);

  const { details, curAttrGroupCollapseId, brand } = useAppSelector((s) => s.product);
  let { brand_id: brandId } = details;
  if (!brandId) {
    brandId = brand?.id as string;
  }

  const currentActiveSpecAttributeGroupId =
    curAttrGroupCollapseId?.[
      activeKey === 'general'
        ? 'general_attribute_groups'
        : activeKey === 'feature'
        ? 'feature_attribute_groups'
        : 'specification_attribute_groups'
    ];

  const isFilterByBrand: boolean = useMemo(() => {
    if (!currentActiveSpecAttributeGroupId) {
      return false;
    }

    return currentActiveSpecAttributeGroupId.indexOf('new') !== -1;
  }, [currentActiveSpecAttributeGroupId]);

  const LIST_TAB: TabItem[] = [
    { tab: 'GENERAL', key: 'general', disable: !!projectProductId },
    { tab: 'FEATURE', key: 'feature', disable: !!projectProductId },
    { tab: 'SPECIFICATION', tabletTabTitle: 'SPECS', key: 'specification' },
    { tab: 'VENDOR', key: 'vendor', disable: !!projectProductId },
  ];

  /// get all attribute without its sub addition
  useEffect(() => {
    getAllAttribute(EGetAllAttributeType.NONE_SUB).then((data) => {
      setAttribute(data as ProductAttributeByType);

      setTimeout(() => {
        setIsReady(true);
      }, 200);
    });
  }, []);

  /// get all attribute with its sub addition
  useEffect(() => {
    // if (!isGetAllAttributeFilterByBrand) {
    //   return;
    // }

    if (!brandId) {
      return;
    }

    getAllAttribute(EGetAllAttributeType.ADD_SUB, brandId ? brandId : undefined).then((data) => {
      setAllAttributeFilterByBrand(data as ProductAttributeWithSubAdditionByType);
    });
  }, [brandId, isFilterByBrand]);

  useEffect(() => {
    return () => {
      setIsGetAllAttributeFilterByBrand(false);
      setAllAttributeFilterByBrand(DEFAULT_ALL_ATTRIBUTE);
    };
  }, []);

  if (!isReady) {
    return (
      <div className={loadingStyles.container}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ProductAttributeComponentContext.Provider
      value={{
        isGetAllAttributeFilterByBrand,
        setIsGetAllAttributeFilterByBrand,
        attributeListFilterByBrand,
        setAllAttributeFilterByBrand,
      }}
    >
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
    </ProductAttributeComponentContext.Provider>
  );
};
