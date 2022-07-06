import React from 'react';
import TopBar from './components/TopBar';
import { PageContainer } from '@ant-design/pro-layout';
import CardList from '@/components/Product/CardList';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { useAppSelector } from '@/reducers';
// import styles from './styles/index.less';

const ProductConfiguration: React.FC = () => {
  const product = useAppSelector((state) => state.product);

  const onItemClick = () => {
    if (product.brand?.id) {
      pushTo(PATH.productConfigurationCreate.replace(':brandId', product.brand.id));
    }
  };

  return (
    <PageContainer pageHeaderRender={() => <TopBar />}>
      {product.brand?.id ? <CardList onItemClick={onItemClick} /> : null}
    </PageContainer>
  );
};

export default ProductConfiguration;
