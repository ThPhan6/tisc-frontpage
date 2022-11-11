import React from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { ProductListTopBar } from './components/TopBar/ProductListTopBar';
import { CollapseProductList } from '@/features/product/components';

const CustomLibrary: React.FC = () => {
  return (
    <PageContainer pageHeaderRender={() => <ProductListTopBar />}>
      <CollapseProductList showActionMenu hideFavorite />
    </PageContainer>
  );
};

export default CustomLibrary;
