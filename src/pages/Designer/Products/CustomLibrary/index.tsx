import React from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { TopBar } from './components/TopBar';
import { CollapseProductList } from '@/features/product/components';

const CustomLibrary: React.FC = () => {
  return (
    <PageContainer pageHeaderRender={() => <TopBar />}>
      <CollapseProductList showActionMenu hideFavorite />
    </PageContainer>
  );
};

export default CustomLibrary;
