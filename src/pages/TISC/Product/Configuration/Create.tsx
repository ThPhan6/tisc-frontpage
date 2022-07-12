import React, { useEffect } from 'react';
import ProductHeader from './components/ProductHeader';
import { useParams } from 'umi';
import PhotoUpload from './components/PhotoUpload';
import ProductInfo from './components/ProductInfo';
import ProductAttribute from './components/ProductAttribute';
import ProductFooter from './components/ProductFooter';
import { Row, Col } from 'antd';
import { getBrandById } from '@/services';
import { useDispatch } from 'react-redux';
import { setBrand } from '@/reducers/product';
import styles from './styles/details.less';

const ProductConfigurationCreate: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ brandId: string }>();
  const brandId = params?.brandId || '';

  useEffect(() => {
    if (brandId) {
      getBrandById(brandId).then((res) => dispatch(setBrand(res)));
    }
  }, [brandId]);

  return (
    <Row gutter={8}>
      <Col span={24}>
        <ProductHeader title={'CATEGORY'} />
      </Col>
      <PhotoUpload />
      <Col span={12} className={styles.productContent}>
        <Row style={{ flexDirection: 'column', height: '100%' }}>
          <Col>
            <ProductInfo />
          </Col>
          <Col style={{ marginBottom: 24 }}>
            <ProductAttribute />
          </Col>
          <Col style={{ marginTop: 'auto' }}>
            <ProductFooter />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ProductConfigurationCreate;
