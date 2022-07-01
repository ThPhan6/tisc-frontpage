import React from 'react';
import TopBar from './components/TopBar';
import { PageContainer } from '@ant-design/pro-layout';

import CardList from '@/components/Product/CardList';

// import styles from './styles/index.less';

const ProductConfiguration: React.FC = () => {
  const onItemClick = () => {};

  return (
    <PageContainer pageHeaderRender={() => <TopBar />}>
      <CardList onItemClick={onItemClick} />
    </PageContainer>
  );
};

export default ProductConfiguration;
