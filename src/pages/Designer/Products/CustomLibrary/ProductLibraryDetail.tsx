import React, { useEffect, useState } from 'react';

import { Col, Row } from 'antd';
import { useHistory, useParams } from 'umi';

import { ProductInfoTab } from './types';

import { SpecificationTab } from './components/SpecificationTab';
import { SummaryTab } from './components/SummaryTab';
import { VendorTab } from './components/VendorTab';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import ProductDetailHeader from '@/features/product/components/ProductDetailHeader';
import ProductImagePreview from '@/features/product/components/ProductImagePreview';

import styles from './ProductLibraryDetail.less';

const LIST_TAB = [
  { tab: 'SUMMARY', key: 'summary' },
  { tab: 'SPECIFICATION', key: 'specification' },
  { tab: 'VENDOR', key: 'vendor' },
];

const ProductLibraryDetail: React.FC = () => {
  const history = useHistory();

  const params = useParams<{ id: string; brandId: string }>();
  const productId = params?.id || '';
  const brandId = params?.brandId || '';

  // const productData = useAppSelector((state) => state.officeProduct.product);
  // const summaryData = useAppSelector((state) => state.officeProduct.summary);
  // const specificationData = useAppSelector((state) => state.officeProduct.specification);
  // const vendorData = useAppSelector((state) => state.officeProduct.vendor);

  const [activeKey, setActiveKey] = useState<ProductInfoTab>('summary');
  // const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (brandId) {
      // getBrandById(brandId).then((res) => dispatch(setBrand(res)));
    }
    return () => {
      // dispatch(resetProductDetailState());
    };
  }, [brandId]);

  useEffect(() => {
    if (productId) {
      // getProductById(productId);
    }
  }, [productId]);

  const onSave = () => {
    // const data = {
    //   company_id: summaryData.company.id || '',
    //   collection_id: summaryData.collection.id || '',
    //   product: summaryData.product.trim(),
    //   description: summaryData.description.trim(),
    //   attributes: summaryData.attributes,
    //   specifications: specificationData.specifications,
    //   images: productData.images?.map((image) => {
    //     if (image.indexOf('data:image') > -1) {
    //       return image.split(',')[1];
    //     }
    //     return image;
    //   }),
    // };
    // update collection list
    // update company list
  };

  return (
    <Row className={styles.container}>
      <Col span={24}>
        <ProductDetailHeader
          title={'title'}
          onSave={onSave}
          onCancel={history.goBack}
          hideSelect
          customClass={styles.marginBottomSpace}
        />
      </Col>

      <Col span={24}>
        <Row className={styles.marginRounded}>
          <Col span={12}>
            <ProductImagePreview hideInquiryRequest isOfficeLibrary />
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

                <CustomTabPane active={activeKey === 'vendor'}>
                  <VendorTab />
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
