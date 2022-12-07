import React, { useEffect, useState } from 'react';

import { Col, Row } from 'antd';
import { useHistory } from 'umi';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';

import { getOneCustomProduct } from './services';
import { useGetParamId, useQuery } from '@/helper/hook';

import { ProductInfoTab } from './types';
import { useAppSelector } from '@/reducers';

import { SpecificationTab } from './components/SpecificationTab';
import { SummaryTab } from './components/SummaryTab';
import { PublicPage } from '@/components/PublicPage';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import ProductImagePreview from '@/features/product/components/ProductImagePreview';

import styles from './ProductLibraryDetail.less';
import Cookies from 'js-cookie';

const LIST_TAB = [
  { tab: 'SUMMARY', key: 'summary' },
  { tab: 'SPECIFICATION', key: 'specification' },
];

const ProductLibraryDetail: React.FC = () => {
  const history = useHistory();
  const productId = useGetParamId();

  const signature = useQuery().get('signature') || '';
  /// set signature to Cookies
  Cookies.set('signature', signature);

  const isPublicPage = !!signature;

  const [activeKey, setActiveKey] = useState<ProductInfoTab>('summary');
  const productData = useAppSelector((state) => state.customProduct.details);

  useEffect(() => {
    if (productId) {
      getOneCustomProduct(productId);
    }
  }, [productId]);

  return (
    <Row className={`${styles.container} ${isPublicPage ? styles.bgContainer : ''}`}>
      <div className={styles.backgroundLight}>
        <Col span={24} className={isPublicPage ? '' : styles.marginBottomSpace}>
          {isPublicPage ? (
            <PublicPage />
          ) : (
            <TableHeader
              title={productData.name}
              rightAction={<CloseIcon className="closeIcon" onClick={history.goBack} />}
            />
          )}
        </Col>

        <Col span={24}>
          <Row className={isPublicPage ? styles.marginRounded : ''}>
            <Col span={12}>
              <ProductImagePreview hideInquiryRequest isCustomProduct viewOnly />
            </Col>

            <Col span={12} className={styles.productContent}>
              <Row style={{ flexDirection: 'column', height: '100%' }}>
                <Col>
                  <CustomTabs
                    listTab={LIST_TAB}
                    activeKey={activeKey}
                    centered={true}
                    tabPosition="top"
                    tabDisplay="space"
                    customClass={styles.listTab}
                    onChange={(key) => setActiveKey(key as ProductInfoTab)}
                  />

                  <CustomTabPane active={activeKey === 'summary'}>
                    <SummaryTab viewOnly />
                  </CustomTabPane>

                  <CustomTabPane active={activeKey === 'specification'}>
                    <SpecificationTab
                      productId={productId}
                      activeKey={'specification'}
                      viewOnly
                      isPublicPage={isPublicPage}
                    />
                  </CustomTabPane>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </div>
    </Row>
  );
};

export default ProductLibraryDetail;
