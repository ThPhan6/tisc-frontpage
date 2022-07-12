import React, { useState } from 'react';
import { CustomTabs } from '@/components/Tabs';
import { TabProp } from '@/components/Tabs/types';
import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import { ReactComponent as CollectionIcon } from '@/assets/icons/collection-icon.svg';
import { ReactComponent as TipsIcon } from '@/assets/icons/bookmark-icon.svg';
import { ReactComponent as DownloadIcon } from '@/assets/icons/download-1-icon.svg';
import SampleProductImage from '@/assets/images/sample-product-img.png';
import { showImageUrl } from '@/helper/utils';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setProductTips, setProductDownloads } from '@/reducers/product';
import styles from '../styles/details.less';

const LIST_TAB: TabProp[] = [
  { tab: 'Collections', key: 'collection', icon: <CollectionIcon /> },
  { tab: 'Tips', key: 'tip', icon: <TipsIcon /> },
  { tab: 'Downloads', key: 'download', icon: <DownloadIcon /> },
];

const ProductFooter: React.FC = () => {
  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { tips, downloads, relatedProduct } = product;
  const [activeKey, setActiveKey] = useState('');

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
                  <div className="relative-product-item" key={key}>
                    <div className="relative-product">
                      <img
                        src={item.images[0] ? showImageUrl(item.images[0]) : SampleProductImage}
                      />
                      <div className="placeholder-text">{item.name}</div>
                    </div>
                  </div>
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
        {activeKey === 'tip' ? (
          <DynamicFormInput
            data={tips.map((tip) => {
              return {
                title: tip.title,
                value: tip.content,
              };
            })}
            setData={(data) =>
              dispatch(
                setProductTips(
                  data.map((item, index) => {
                    return {
                      ...tips[index],
                      title: item.title,
                      content: item.value,
                    };
                  }),
                ),
              )
            }
            titlePlaceholder="type title here"
            valuePlaceholder="type content text (max. 100 words)"
            maxValueWords={100}
          />
        ) : null}
        {activeKey === 'download' ? (
          <DynamicFormInput
            data={downloads.map((download) => {
              return {
                title: download.file_name,
                value: download.url,
              };
            })}
            setData={(data) =>
              dispatch(
                setProductDownloads(
                  data.map((item, index) => {
                    return {
                      ...downloads[index],
                      file_name: item.title,
                      url: item.value,
                    };
                  }),
                ),
              )
            }
            titlePlaceholder="type file name here"
            valuePlaceholder="paste file URL link here"
          />
        ) : null}
      </div>
    </div>
  );
};

export default ProductFooter;
