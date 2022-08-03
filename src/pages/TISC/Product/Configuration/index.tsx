import React from 'react';
import TopBar from './components/TopBar';
import { PageContainer } from '@ant-design/pro-layout';
import { CollapseProductList } from '@/features/product/components';

const ProductConfiguration: React.FC = () => {
  return (
    <PageContainer pageHeaderRender={() => <TopBar />}>
      <CollapseProductList />
    </PageContainer>
  );
};

export default ProductConfiguration;
