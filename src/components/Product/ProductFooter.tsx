import { ReactComponent as TipsIcon } from '@/assets/icons/bookmark-icon.svg';
import { ReactComponent as CollectionIcon } from '@/assets/icons/collection-icon.svg';
import { ReactComponent as DownloadIcon } from '@/assets/icons/download-1-icon.svg';
import SampleProductImage from '@/assets/images/sample-product-img.png';
import { CustomTabs } from '@/components/Tabs';
import { TabItem } from '@/components/Tabs/types';
import { useGetUserRoleFromPathname } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { useAppSelector } from '@/reducers';
import React, { useState } from 'react';
import ProductDownloadFooter from './ProductDownloadFooter';
import ProductTip from './ProductTip';
import styles from './styles/details.less';
import { gotoProductDetailPage } from './utils';

const LIST_TAB: TabItem[] = [
  { tab: 'Collections', key: 'collection', icon: <CollectionIcon /> },
  { tab: 'Tips', key: 'tip', icon: <TipsIcon /> },
  { tab: 'Downloads', key: 'download', icon: <DownloadIcon /> },
];

const ProductDetailFooter: React.FC = () => {
  const { relatedProduct } = useAppSelector((state) => state.product);
  const [activeKey, setActiveKey] = useState('');

  // check user role to set UI and redirect URL
  const userRole = useGetUserRoleFromPathname();

  return (
    <div className={styles.productFooter}>
      <CustomTabs
        listTab={LIST_TAB}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        onChange={setActiveKey}
        activeKey={activeKey}
        onTabClick={(currentKey) => {
          if (currentKey == activeKey) {
            setActiveKey('');
          }
        }}
      />
      <div className={`footer-content ${activeKey}`}>
        {activeKey === 'collection' ? (
          <div className="relative-product-wrapper">
            <div className="relative-product-list">
              {relatedProduct.length > 0 ? (
                relatedProduct.map((item, key) => (
                  <a
                    className="relative-product-item"
                    key={key}
                    target="_blank"
                    rel="noreferrer"
                    href={gotoProductDetailPage(userRole, item.id)}
                  >
                    <div className="relative-product">
                      <img
                        src={item.images?.[0] ? showImageUrl(item.images[0]) : SampleProductImage}
                      />
                      <div className="placeholder-text">{item.name}</div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="relative-product-item">
                  <div className="relative-product">
                    <img src={SampleProductImage} />
                    <div className="placeholder-text">Product Label</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
        {activeKey === 'tip' ? <ProductTip userRole={userRole} /> : null}
        {activeKey === 'download' ? <ProductDownloadFooter userRole={userRole} /> : null}
      </div>
    </div>
  );
};

export default ProductDetailFooter;
