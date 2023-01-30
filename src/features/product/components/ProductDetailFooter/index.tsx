import React, { memo } from 'react';

import { ReactComponent as TipsIcon } from '@/assets/icons/bookmark-icon.svg';
import { ReactComponent as CollectionIcon } from '@/assets/icons/collection-icon.svg';
import { ReactComponent as DownloadIcon } from '@/assets/icons/download-1-icon.svg';

import { ProductInfoTab } from '../ProductAttributes/types';
import { TabItem } from '@/components/Tabs/types';
import store, { useAppSelector } from '@/reducers';
import { ProductFooterTabs, onChangeProductFooterTab } from '@/reducers/active';

import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from '../detail.less';
import { ProductCollection } from './ProductCollection';
import ProductDownloadFooter from './ProductDownloadFooter';
import ProductTip from './ProductTip';

const LIST_TAB: TabItem[] = [
  { tab: 'Collections', key: 'collection', icon: <CollectionIcon /> },
  { tab: 'Tips', key: 'tip', icon: <TipsIcon /> },
  { tab: 'Downloads', key: 'download', icon: <DownloadIcon /> },
];

export const ProductDetailFooter: React.FC<{ infoTab: ProductInfoTab }> = memo(({ infoTab }) => {
  const activeKey = useAppSelector((s) => s.active.productFooter);
  const visible = infoTab !== 'vendor';

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

        <CustomTabPane active={activeKey === 'tip'}>
          <ProductTip />
        </CustomTabPane>

        <CustomTabPane active={activeKey === 'download'}>
          <ProductDownloadFooter />
        </CustomTabPane>
      </div>
    </div>
  );
});
