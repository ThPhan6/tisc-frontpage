import React, { useEffect, useState } from 'react';

import { Col, Row } from 'antd';
import { useHistory, useParams } from 'umi';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { getOneCustomProduct } from './services';

import { NameContentProps, ProductInfoTab, ProductOptionProps } from './types';
import { ProductDimensionWeight } from '@/features/dimension-weight/types';
import { useAppSelector } from '@/reducers';

import { SpecificationTab } from './components/SpecificationTab';
import { SummaryTab } from './components/SummaryTab';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import ProductImagePreview from '@/features/product/components/ProductImagePreview';

import styles from './ProductLibraryDetail.less';

const LIST_TAB = [
  { tab: 'SUMMARY', key: 'summary' },
  { tab: 'SPECIFICATION', key: 'specification' },
];

export interface CustomProductRequestBody {
  name: string;
  description: string;
  images: string[];
  dimension_and_weight: ProductDimensionWeight;
  attributes: NameContentProps[];
  specification: NameContentProps[];
  options: ProductOptionProps[];
  collection_id: string;
  company_id: string;
}

const ProductLibraryDetail: React.FC = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const productId = params?.id || '';

  const [activeKey, setActiveKey] = useState<ProductInfoTab>('summary');
  const productData = useAppSelector((state) => state.customProduct.details);

  useEffect(() => {
    if (productId) {
      getOneCustomProduct(productId);
    }
  }, [productId]);

  return (
    <Row className={styles.container} gutter={[8, 8]}>
      <Col span={24}>
        <TableHeader
          title={productData.name}
          rightAction={<CloseIcon className="closeIcon" onClick={history.goBack} />}
        />
      </Col>

      <Col span={24}>
        <Row className={styles.marginRounded}>
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
                  <SpecificationTab productId={productId} viewOnly />
                </CustomTabPane>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ProductLibraryDetail;
