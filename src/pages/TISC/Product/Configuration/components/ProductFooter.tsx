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
import { setProductTip, setProductDownload } from '@/reducers/product';
import { PATH } from '@/constants/path';
import styles from '../styles/details.less';

const LIST_TAB: TabProp[] = [
  { tab: 'Collections', key: 'collection', icon: <CollectionIcon /> },
  { tab: 'Tips', key: 'tip', icon: <TipsIcon /> },
  { tab: 'Downloads', key: 'download', icon: <DownloadIcon /> },
];

const ProductFooter: React.FC = () => {
  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { tip, download, relatedProduct } = product;
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
                  <a
                    className="relative-product-item"
                    key={key}
                    target="_blank"
                    rel="noreferrer"
                    href={PATH.productConfigurationUpdate.replace(':id', item.id)}
                  >
                    <div className="relative-product">
                      <img
                        src={item.images[0] ? showImageUrl(item.images[0]) : SampleProductImage}
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
        {activeKey === 'tip' ? (
          <DynamicFormInput
            data={tip.contents.map((value) => {
              return {
                title: value.title,
                value: value.content,
              };
            })}
            setData={(data) =>
              dispatch(
                setProductTip({
                  ...tip,
                  contents: data.map((item, index) => {
                    return {
                      ...tip.contents[index],
                      title: item.title,
                      content: item.value,
                    };
                  }),
                }),
              )
            }
            titlePlaceholder="type title here"
            valuePlaceholder="type content text (max. 100 words)"
            maxValueWords={100}
          />
        ) : null}
        {activeKey === 'download' ? (
          <DynamicFormInput
            data={download.contents.map((value) => {
              return {
                title: value.title,
                value: value.url,
              };
            })}
            setData={(data) =>
              dispatch(
                setProductDownload({
                  ...download,
                  contents: data.map((item, index) => {
                    return {
                      ...download.contents[index],
                      title: item.title,
                      url: item.value,
                    };
                  }),
                }),
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
