import React from 'react';
import TopBar from './components/TopBar';
import { PageContainer } from '@ant-design/pro-layout';
import ProductCardList from '@/components/Product/CardList';
// import styles from './styles/index.less';

const ProductConfiguration: React.FC = () => {
  return (
    <PageContainer pageHeaderRender={() => <TopBar />}>
      <ProductCardList />
    </PageContainer>
  );
};

export default ProductConfiguration;
