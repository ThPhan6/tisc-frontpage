import React, { useState, useEffect } from 'react';
import { TableHeader } from '@/components/Table/TableHeader';
// import { MainTitle } from '@/components/Typography';
import { useParams } from 'umi';
import PhotoUpload from './components/PhotoUpload';
import ProductInfo from './components/ProductInfo';
import ProductAttribute from './components/ProductAttribute';
// import { CustomTabs } from '@/components/Tabs';
// import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { Row, Col } from 'antd';
import { getBrandById } from '@/services';
import { IBrandDetail } from '@/types';
import styles from './styles/details.less';

const ProductConfigurationCreate: React.FC = () => {
  const [brand, setBrand] = useState<IBrandDetail>();
  const params = useParams<{ brandId: string }>();
  const brandId = params?.brandId || '';

  useEffect(() => {
    if (brandId) {
      getBrandById(brandId).then(setBrand);
    }
  }, [brandId]);

  return (
    <Row gutter={8}>
      <Col span={24}>
        <TableHeader title={'CATEGORY'} />
      </Col>
      <PhotoUpload brand={brand} />
      <Col span={12} className={styles.productContent}>
        <ProductInfo brand={brand} />
        <ProductAttribute />
      </Col>
    </Row>
  );
};

export default ProductConfigurationCreate;
