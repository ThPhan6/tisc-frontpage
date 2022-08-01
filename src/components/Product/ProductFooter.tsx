import { ReactComponent as TipsIcon } from '@/assets/icons/bookmark-icon.svg';
import { ReactComponent as CollectionIcon } from '@/assets/icons/collection-icon.svg';
import { ReactComponent as DownloadIcon } from '@/assets/icons/download-1-icon.svg';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { TabItem } from '@/components/Tabs/types';
import { useGetUserRoleFromPathname } from '@/helper/hook';
import React, { useState } from 'react';
import { ProductCollection } from './ProductCollection';
import ProductDownloadFooter from './ProductDownloadFooter';
import ProductTip from './ProductTip';
import styles from './styles/details.less';

const LIST_TAB: TabItem[] = [
  { tab: 'Collections', key: 'collection', icon: <CollectionIcon /> },
  { tab: 'Tips', key: 'tip', icon: <TipsIcon /> },
  { tab: 'Downloads', key: 'download', icon: <DownloadIcon /> },
];

type ProductFooterTabs = 'collection' | 'tip' | 'download' | '';

const ProductDetailFooter: React.FC = () => {
  const [activeKey, setActiveKey] = useState<ProductFooterTabs>('');

  // check user role to set UI and redirect URL
  const userRole = useGetUserRoleFromPathname();

  return (
    <div className={styles.productFooter}>
      <CustomTabs
        listTab={LIST_TAB}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        onChange={(tab) => setActiveKey(tab as ProductFooterTabs)}
        activeKey={activeKey}
        onTabClick={(currentKey) => {
          if (currentKey == activeKey) {
            setActiveKey('');
          }
        }}
      />
      <div className={`footer-content ${activeKey}`}>
        <CustomTabPane active={activeKey === 'collection'}>
          <ProductCollection />
        </CustomTabPane>

        <CustomTabPane active={activeKey === 'tip'}>
          <ProductTip userRole={userRole} />
        </CustomTabPane>

        <CustomTabPane active={activeKey === 'download'}>
          <ProductDownloadFooter userRole={userRole} />
        </CustomTabPane>
      </div>
    </div>
  );
};

export default ProductDetailFooter;
