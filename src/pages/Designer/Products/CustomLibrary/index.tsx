import React from 'react';

import { EMPTY_DATA_MESSAGE } from '@/constants/message';
import { PageContainer } from '@ant-design/pro-layout';

import { useAppSelector } from '@/reducers';

import { ProductListTopBar } from './components/TopBar/ProductListTopBar';
import { EmptyDataMessage } from '@/components/EmptyDataMessage';
import ProductCard from '@/features/product/components/ProductCard';
import styles from '@/features/product/components/ProductCard.less';

const CustomLibrary: React.FC = () => {
  const customProductList = useAppSelector((state) => state.customProduct.list || []);
  const companyFilterValue = useAppSelector((state) => state.customProduct.filter);
  const emptyDataMessage = companyFilterValue?.value
    ? EMPTY_DATA_MESSAGE.product
    : 'No data product yet. Please first create a vendor and distributor profile.';

  return (
    <PageContainer pageHeaderRender={() => <ProductListTopBar />}>
      <div className={customProductList.length ? styles.productCardContainer : ''}>
        {customProductList.length ? (
          customProductList.map((product, index) => (
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
        ) : (
          <EmptyDataMessage message={emptyDataMessage} />
        )}
      </div>
    </PageContainer>
  );
};

export default CustomLibrary;
