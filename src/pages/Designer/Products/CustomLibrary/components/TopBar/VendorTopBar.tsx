import React, { useEffect } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';

import { ProductGetListParameter } from '@/features/product/types';

import { TopBarContainer, TopBarItem } from '@/features/product/components';
import { useProductListFilterAndSorter } from '@/features/product/components/FilterAndSorter';

import styles from './index.less';

export const VendorTopBar: React.FC = () => {
  const { renderFilterDropdown, renderItemTopBar, productSummary, filter, productBrand } =
    useProductListFilterAndSorter({
      noFetchData: true,
    });

  // useEffect(() => {
  //   return () => {
  //     dispatch(setBrand());
  //     dispatch(setProductList({ data: [] }));
  //     dispatch(setProductSummary(undefined));
  //   };
  // }, []);

  // brand product summary
  useEffect(() => {
    if (productBrand && productBrand.id && productSummary?.brandId !== productBrand.id) {
      // get product summary
      // getProductSummary(productBrand.id);
    }
  }, [productBrand, productSummary]);

  useEffect(() => {
    if (productBrand && productBrand.id && filter) {
      const params: ProductGetListParameter = {
        brand_id: productBrand.id,
      };
      if (filter.name === 'collection_id') {
        params.collection_id = filter.value === 'all' ? 'all' : filter.value;
      }
      if (filter.name === 'company_id') {
        params.company_id = filter.value === 'all' ? 'all' : filter.value;
      }
      // getProductListByBrandId(params);
    }
  }, [filter, productBrand]);

  const gotoProductForm = () => {
    // dispatch(resetProductState());
    // if (productBrand && productBrand.id) {
    pushTo(PATH.designerOfficeLibraryCreate.replace(':brandId', ''));
    // }
  };

  return (
    <>
      <TopBarContainer
        LeftSideContent={
          <>
            <TopBarItem
              customClass={styles.paddingLeftNone}
              topValue={productSummary?.company_count}
              disabled={!productSummary}
              bottomValue="Companies"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.collection_count}
              disabled={!productSummary}
              bottomValue="Collections"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.card_count}
              disabled={!productSummary}
              bottomValue="Cards"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.product_count}
              disabled={!productSummary}
              bottomValue="Products"
              cursor="default"
            />
          </>
        }
      />
    </>
  );
};
