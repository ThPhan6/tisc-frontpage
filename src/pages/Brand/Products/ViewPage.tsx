import React, { useState, useEffect } from 'react';
import { useParams } from 'umi';
import PhotoUpload from './components/PhotoUpload';
import ProductInfo from '@/components/Product/ProductInfo';
import ProductAttribute from '@/components/Product/ProductAttribute';
import ProductFooter from '@/components/Product/ProductFooter';
import { Row, Col } from 'antd';
import {
  getProductById,
  getProductCatelogueByProductID,
  getProductDownloadByProductID,
  getProductTipByProductID,
  getRelatedCollectionProducts,
} from '@/services';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setBrand } from '@/reducers/product';
import styles from '@/components/Product/styles/details.less';
import './styles/viewPage.less';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import type { ProductInfoTab } from '@/components/Product/types';
import { TableHeader } from '@/components/Table/TableHeader';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { useCheckPermission } from '@/helper/hook';

const ProductBrandViewPage: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const productId = params?.id || '';
  const product = useAppSelector((state) => state.product);
  const [activeKey, setActiveKey] = useState<ProductInfoTab>('general');
  const [title, setTitle] = useState<string>('');

  /// for reuse component,
  /// to allow access level
  const editable = useCheckPermission('TISC Admin');

  console.log('ProductBrandViewPage', product);

  useEffect(() => {
    if (productId) {
      getProductById(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (product.details.brand) {
      // load brand information
      dispatch(setBrand(product.details.brand));
      /// get product name
      setTitle(product.details?.name);
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

  if (!product.details.id) {
    return null;
  }
  return (
    <Row gutter={8}>
      <Col span={24}>
        <TableHeader
          title={title}
          rightAction={
            <CloseIcon className="closeIcon" onClick={() => pushTo(PATH.brandProduct)} />
          }
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

export default ProductBrandViewPage;
