import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'umi';
import { Row, Col, message } from 'antd';
import {
  createProductCard,
  createProductCatelogue,
  createProductDownload,
  createProductTip,
  getProductById,
  getProductDownloadByProductID,
  getProductTipByProductID,
  getRelatedCollectionProducts,
  updateProductCard,
} from '@/features/product/services';
import { setBrand } from '@/features/product/reducers';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import styles from './detail.less';
import { TableHeader } from '@/components/Table/TableHeader';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { ProductInfoTab } from './ProductAttributeComponent/types';
import { ProductBasicInfo } from './ProductBasicInfo';
import { ProductAttributeComponent } from './ProductAttributeComponent';
import { ProductDetailFooter } from './ProductDetailFooter';
import ProductImagePreview from './ProductImagePreview';
import { getBrandById } from '@/services';
import { isValidURL } from '@/helper/utils';
import { ProductFormData, ProductKeyword } from '../types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { MESSAGE_ERROR } from '@/constants/message';
import { useCheckPermission } from '@/helper/hook';
import ProductDetailHeader from './ProductDetailHeader';

const ProductDetailContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams<{ id: string; brandId: string }>();
  const productId = params?.id || '';
  const brandId = params?.brandId || '';

  const isTiscAdmin = useCheckPermission('TISC Admin');

  const brand = useAppSelector((state) => state.product.brand);
  const details = useAppSelector((state) => state.product.details);
  const tip = useAppSelector((state) => state.product.tip);
  const download = useAppSelector((state) => state.product.download);
  const catelogue = useAppSelector((state) => state.product.catelogue);
  console.log('brand', brand);
  console.log('details', details);
  console.log('params', params);
  const [activeKey, setActiveKey] = useState<ProductInfoTab>('general');
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (brandId) {
      getBrandById(brandId).then((res) => dispatch(setBrand(res)));
    }
  }, [brandId]);

  useEffect(() => {
    if (productId) {
      getProductById(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (details.brand) {
      // load brand information
      dispatch(setBrand(details.brand));
      /// get product name
      setTitle(details?.name);
    }
    if (details.id) {
      /// load product detail downloads
      getProductDownloadByProductID(details.id);
      /// load product detail tips
      getProductTipByProductID(details.id);
      /// load product related
      getRelatedCollectionProducts(details.id);
    }
  }, [details.id, details.brand]);

  const onSave = () => {
    // check urls is valid
    const haveInvaliDownloadURL = download.contents.some(
      (content) => isValidURL(content.url) === false,
    );
    const haveInvaliCatelogueURL = catelogue.contents.some(
      (content) => isValidURL(content.url) === false,
    );
    if (haveInvaliDownloadURL || haveInvaliCatelogueURL) {
      message.error(MESSAGE_ERROR.URL_INVALID);
      return;
    }

    const data: ProductFormData = {
      brand_id: brandId || details.brand?.id || '',
      category_ids: details.categories.map((category) => category.id),
      collection_id: details.collection?.id || '',
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

    if (productId) {
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
      return;
    }

    createProductCard(data).then((productDetail) => {
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
        /// push to product update, 100% have product detail id
        pushTo(PATH.productConfigurationUpdate.replace(':id', productDetail.id ?? ''));
      }
    });
  };

  // if (!details.id) {
  //   return null;
  // }

  return (
    <Row gutter={8}>
      <Col span={24}>
        {isTiscAdmin ? (
          <ProductDetailHeader
            title={'CATEGORY'}
            onSave={onSave}
            onCancel={() => pushTo(PATH.productConfiguration)}
          />
        ) : (
          <TableHeader
            title={title}
            rightAction={<CloseIcon className="closeIcon" onClick={history.goBack} />}
          />
        )}
      </Col>

      <ProductImagePreview />

      <Col span={12} className={styles.productContent}>
        <Row style={{ flexDirection: 'column', height: '100%' }}>
          <Col>
            <ProductBasicInfo />
          </Col>

          <Col style={{ marginBottom: activeKey !== 'vendor' ? 24 : 0 }}>
            <ProductAttributeComponent activeKey={activeKey} setActiveKey={setActiveKey} />
          </Col>

          <Col style={{ marginTop: 'auto' }}>
            <ProductDetailFooter visible={activeKey !== 'vendor'} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ProductDetailContainer;
