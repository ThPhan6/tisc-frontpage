import React, { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row, message } from 'antd';
import { useHistory, useParams } from 'umi';

import { createCustomProduct, getOneCustomProduct, updateCustomProduct } from './services';
import { formatImageIfBase64 } from '@/helper/utils';

import { CustomProductRequestBody, ProductInfoTab } from './types';
import { useAppSelector } from '@/reducers';

import { SpecificationTab } from './components/SpecificationTab';
import { SummaryTab } from './components/SummaryTab';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import ProductDetailHeader from '@/features/product/components/ProductDetailHeader';
import ProductImagePreview from '@/features/product/components/ProductImagePreview';

import styles from './ProductLibraryDetail.less';
import { invalidCustomProductSelector } from './slice';

const LIST_TAB = [
  { tab: 'SUMMARY', key: 'summary' },
  { tab: 'SPECIFICATION', key: 'specification' },
];

const ProductLibraryUpdate: React.FC = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const productId = params?.id || '';

  const [activeKey, setActiveKey] = useState<ProductInfoTab>('summary');
  const productData = useAppSelector((state) => state.customProduct.details);

  const { invalidAttributes, invalidSpecifications, invalidOptions } = useAppSelector(
    invalidCustomProductSelector,
  );

  useEffect(() => {
    if (productId) {
      getOneCustomProduct(productId);
    }
  }, [productId]);

  const onSave = () => {
    switch (true) {
      case !productData.company.name:
        message.error('Company is required');
        return;
      case !productData.collection.name:
        message.error('Collection is required');
        return;
      case !productData.name:
        message.error('Product name is required');
        return;
      case productData.images.length < 1:
        message.error('Required at least one image');
        return;
      case productData.images.length > 4:
        message.error('Maximum 4 images are allowed');
        return;
      case invalidAttributes:
        message.error('Invalid attributes');
        return;
      case invalidOptions:
        message.error('Invalid options');
        return;
      case invalidSpecifications:
        message.error('Invalid specifications');
        return;
    }

    const productOptions = productData.options.map((el) => ({
      ...el,
      id: el.id || undefined,
      items: el.items.map((item) => ({
        ...item,
        id: item.id || undefined,
        image: el.use_image && item.image ? formatImageIfBase64(item.image) : undefined,
      })),
    }));

    const data: CustomProductRequestBody = {
      company_id: productData.company.id,
      collection_id: productData.collection.id,
      name: productData.name,
      dimension_and_weight: productData.dimension_and_weight,
      description: productData.description.trim(),
      attributes: productData.attributes,
      specifications: productData.specifications,
      options: productOptions,
      images: productData.images?.map((image) => formatImageIfBase64(image)),
    };

    if (productId) {
      updateCustomProduct(productId, data);
    } else {
      createCustomProduct(data).then((res) => {
        if (res) {
          history.replace(PATH.designerCustomProductUpdate.replace(':id', res.id));
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
                  <SpecificationTab productId={productId} />
                </CustomTabPane>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ProductLibraryUpdate;
