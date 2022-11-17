import React, { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row, message } from 'antd';
import { useHistory, useParams } from 'umi';

import { createCustomProduct, getOneCustomProduct, updateCustomProduct } from './services';

import { NameContentProps, ProductInfoTab, ProductOptionProps } from './types';
import { ProductDimensionWeight } from '@/features/dimension-weight/types';
import { useAppSelector } from '@/reducers';

import { SpecificationTab } from './components/SpecificationTab';
import { SummaryTab } from './components/SummaryTab';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import ProductDetailHeader from '@/features/product/components/ProductDetailHeader';
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

  const onSave = () => {
    if (!productData.company.name) {
      message.error('Company is required');
      return;
    }

    if (!productData.collection.name) {
      message.error('Collection is required');
      return;
    }

    if (!productData.name) {
      message.error('Product name is required');
      return;
    }

    if (!productData.images.length) {
      message.error('At least one image');
      return;
    }

    const data: CustomProductRequestBody = {
      company_id: productData.company.id,
      collection_id: productData.collection.id,
      name: productData.name,
      dimension_and_weight: productData.dimension_and_weight,
      description: productData.description.trim(),
      attributes: productData.attributes,
      specification: productData.specification,
      options: productData.options,
      images: productData.images?.map((image) => {
        if (image.indexOf('data:image') > -1) {
          return image.split(',')[1];
        }
        return image;
      }),
    };

    if (productId) {
      updateCustomProduct(productId, data);
    } else {
      createCustomProduct(data).then((res) => {
        if (res) {
          history.replace(PATH.designerCustomProductDetail.replace(':id', res.id));
        }
      });
    }
  };

  return (
    <Row className={styles.container}>
      <Col span={24}>
        <ProductDetailHeader
          title={productData.name || ''}
          onSave={onSave}
          onCancel={history.goBack}
          hideSelect
          customClass={styles.marginBottomSpace}
        />
      </Col>

      <Col span={24}>
        <Row className={styles.marginRounded}>
          <Col span={12}>
            <ProductImagePreview
              hideInquiryRequest
              isCustomProduct
              disabledAssignProduct={!productId}
              disabledShareViaEmail={!productId}
            />
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
                  <SummaryTab />
                </CustomTabPane>

                <CustomTabPane active={activeKey === 'specification'}>
                  <SpecificationTab />
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
