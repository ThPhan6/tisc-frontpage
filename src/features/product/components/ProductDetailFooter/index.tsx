import React, { memo } from 'react';

import { ReactComponent as ActionLeftIcon } from '@/assets/icons/align-left-icon.svg';
import { ReactComponent as TipsIcon } from '@/assets/icons/bookmark-icon.svg';
import { ReactComponent as CollectionIcon } from '@/assets/icons/collection-icon.svg';
import { ReactComponent as DownloadIcon } from '@/assets/icons/download-1-icon.svg';

import { onCheckRelatedProduct } from '../../reducers';
import { ProductInfoTab } from '../ProductAttributes/types';
import { TabItem } from '@/components/Tabs/types';
import store, { useAppSelector } from '@/reducers';
import { ProductFooterTabs, onChangeProductFooterTab } from '@/reducers/active';

import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from '../detail.less';
import { ProductCollection } from './ProductCollection';
import ProductDownloadFooter from './ProductDownloadFooter';
import ProductTip from './ProductTip';

export const ProductDetailFooter: React.FC<{ infoTab: ProductInfoTab }> = memo(({ infoTab }) => {
  const activeKey = useAppSelector((s) => s.active.productFooter);
  const relatedProduct = useAppSelector((state) => state.product.relatedProductOnView);
  const visible = infoTab !== 'vendor';

  const LIST_TAB: TabItem[] = [
    {
      tab:
        relatedProduct?.id && relatedProduct.relatedProductData?.length
          ? relatedProduct.name
          : 'Collections',
      key: 'collection',
      icon:
        relatedProduct?.id && relatedProduct.relatedProductData?.length ? (
          <ActionLeftIcon
            onClick={(e) => {
              e.stopPropagation();
              store.dispatch(onCheckRelatedProduct({} as any));
            }}
          />
        ) : (
          <CollectionIcon />
        ),
    },
    { tab: 'Tips', key: 'tip', icon: <TipsIcon /> },
    { tab: 'Downloads', key: 'download', icon: <DownloadIcon /> },
  ];

  return (
    <div className={`${styles.productFooter} ${visible ? '' : styles.hidden}`}>
      <CustomTabs
        listTab={LIST_TAB}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        onChange={(tab) =>
          store.dispatch(onChangeProductFooterTab({ tab: tab as ProductFooterTabs, infoTab }))
        }
        activeKey={activeKey}
        hideTitleOnMobile
        outlineOnMobile
        onTabClick={(currentKey) => {
          if (currentKey == activeKey) {
            store.dispatch(
              onChangeProductFooterTab({
                tab: '',
                infoTab,
              }),
            );
          }
        }}
      />
      <div className={`footer-content ${activeKey}`}>
        <CustomTabPane active={activeKey === 'collection'}>
          <ProductCollection />
        </CustomTabPane>

        <CustomTabPane active={activeKey === 'tip'} lazyLoad>
          <ProductTip />
        </CustomTabPane>

        <CustomTabPane active={activeKey === 'download'} lazyLoad>
          <ProductDownloadFooter />
        </CustomTabPane>
      </div>
    </div>
  );
});
