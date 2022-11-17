import React from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { useAppSelector } from '@/reducers';

import { ProductListTopBar } from './components/TopBar/ProductListTopBar';
import ProductCard from '@/features/product/components/ProductCard';
import styles from '@/features/product/components/ProductCard.less';

const CustomLibrary: React.FC = () => {
  const customProductList = useAppSelector((state) => state.customProduct.list || []);

  return (
    <PageContainer pageHeaderRender={() => <ProductListTopBar />}>
      <div className={styles.productCardContainer}>
        {customProductList.length
          ? customProductList.map((product, index) => (
              <ProductCard
                key={product.id || index}
                showActionMenu
                hideFavorite
                isCustomProduct
                product={{
                  id: product.id,
                  name: product.name,
                  brand: { name: product.company_name },
                  description: product.description,
                  images: [product.image],
                }}
              />
            ))
          : null}
      </div>
    </PageContainer>
  );
};

export default CustomLibrary;
