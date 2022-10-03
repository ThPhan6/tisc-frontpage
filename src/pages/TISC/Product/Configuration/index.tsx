import React from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import TopBar from './components/ProductTopBar';
import { CollapseProductList } from '@/features/product/components';

const ProductConfiguration: React.FC = () => {
  return (
    <PageContainer pageHeaderRender={() => <TopBar />}>
      <CollapseProductList />
    </PageContainer>
  );
};

export default ProductConfiguration;
