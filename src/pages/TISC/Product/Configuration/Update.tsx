import React, { useState, useEffect } from 'react';
import ProductHeader from './components/ProductHeader';
import { useParams } from 'umi';
import PhotoUpload from './components/PhotoUpload';
import ProductAttribute from './components/ProductAttribute';
import ProductFooter from '@/components/Product/ProductFooter';
import { Row, Col, message } from 'antd';
import {
  getProductById,
  getProductCatelogueByProductID,
  getProductDownloadByProductID,
  getProductTipByProductID,
  updateProductCard,
  getRelatedCollectionProducts,
  createProductTip,
  createProductDownload,
  createProductCatelogue,
} from '@/services';
import type { ProductFormData, ProductKeyword } from '@/types';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setBrand } from '@/reducers/product';
import styles from '@/components/Product/styles/details.less';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import type { ProductInfoTab } from './types';
import { isValidURL } from '@/helper/utils';
import { MESSAGE_ERROR } from '@/constants/message';
import ProductInfo from '@/components/Product/ProductInfo';
import { useCheckPermission } from '@/helper/hook';

const ProductConfigurationCreate: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const productId = params?.id || '';
  const product = useAppSelector((state) => state.product);
  const [activeKey, setActiveKey] = useState<ProductInfoTab>('general');
  const editable = useCheckPermission('TISC Admin');

  useEffect(() => {
    if (productId) {
      getProductById(productId);
    }
  }, [productId]);
  useEffect(() => {
    if (product.details.brand) {
      // load brand information
      dispatch(setBrand(product.details.brand));
    }
    if (product.details.id) {
      /// load product detail catelogues
      getProductCatelogueByProductID(product.details.id);
      /// load product detail downloads
      getProductDownloadByProductID(product.details.id);
      /// load product detail tips
      getProductTipByProductID(product.details.id);
      /// load product related
      getRelatedCollectionProducts(product.details.id);
    }
  }, [product.details.id, product.details.brand]);

  const onSave = () => {
    const { details, brand, tip, download, catelogue } = product;
    const haveInvalidURL = download.contents.some((content) => isValidURL(content.url) === false);
    if (haveInvalidURL) {
      return message.error(MESSAGE_ERROR.URL_INVALID);
    }

    const data: ProductFormData = {
      brand_id: brand?.id ?? '', /// 100% have brand.id
      category_ids: details.categories.map((category) => category.id),
      collection_id: details.collection?.id ?? '',
      name: details.name.trim(),
      description: details.description.trim(),
      general_attribute_groups: details.general_attribute_groups,
      feature_attribute_groups: details.feature_attribute_groups,
      specification_attribute_groups: details.specification_attribute_groups,
      keywords: details.keywords.map((keyword) => keyword.trim()) as ProductKeyword,
      images: details.images.map((image) => {
        if (image.indexOf('data:image') > -1) {
          return image.split(',')[1];
        }
        return image;
      }),
    };
    updateProductCard(productId, data).then((productDetail) => {
      if (productDetail) {
        createProductTip({
          product_id: productDetail.id,
          contents: tip.contents,
        });

        createProductDownload({
          product_id: productDetail.id,
          contents: download.contents,
        });
        createProductCatelogue({
          product_id: productDetail.id,
          contents: catelogue.contents,
        });
      }
    });
  };
  if (!product.details.id) {
    return null;
  }
  return (
    <Row gutter={8}>
      <Col span={24}>
        <ProductHeader
          title={'CATEGORY'}
          onSave={onSave}
          onCancel={() => pushTo(PATH.productConfiguration)}
        />
      </Col>
      <PhotoUpload />
      <Col span={12} className={styles.productContent}>
        <Row style={{ flexDirection: 'column', height: '100%' }}>
          <Col>
            <ProductInfo editable={editable} />
          </Col>
          <Col style={{ marginBottom: activeKey !== 'vendor' ? 24 : 0 }}>
            <ProductAttribute activeKey={activeKey} setActiveKey={setActiveKey} />
          </Col>
          {activeKey !== 'vendor' ? (
            <Col style={{ marginTop: 'auto' }}>
              <ProductFooter />
            </Col>
          ) : null}
        </Row>
      </Col>
    </Row>
  );
};

export default ProductConfigurationCreate;
