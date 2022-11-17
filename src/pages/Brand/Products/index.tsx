import React, { useEffect } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { getProductListByBrandId, getProductSummary } from '@/features/product/services';

import { useAppSelector } from '@/reducers';

import { CollapseProductList, TopBarContainer, TopBarItem } from '@/features/product/components';
import { useProductListFilterAndSorter } from '@/features/product/components/FilterAndSorter';

const BrandProductListPage: React.FC = () => {
  const filter = useAppSelector((state) => state.product.list.filter);
  const summary = useAppSelector((state) => state.product.summary);
  const userBrand = useAppSelector((state) => state.user.user?.brand);

  const categoryDropDownData = !summary?.categories.length
    ? []
    : summary?.categories.map((category) => ({
        key: category.id,
        label: category.name,
      }));
  const brandDropDownData = !summary?.collections
    ? []
    : summary?.collections.map((collections) => ({
        key: collections.id,
        label: collections.name,
      }));

  const { renderFilterDropdown, renderItemTopBar } = useProductListFilterAndSorter({
    noFetchData: true,
  });

  // brand product summary
  useEffect(() => {
    if (userBrand?.id) {
      // get product summary
      getProductSummary(userBrand.id);
    }
  }, []);

  useEffect(() => {
    if (userBrand?.id) {
      getProductListByBrandId({
        brand_id: userBrand.id,
        category_id: !filter || filter?.name === 'category_id' ? filter?.value || 'all' : undefined,
        collection_id: filter?.name === 'collection_id' ? filter?.value : undefined,
      });
    }
  }, [filter]);

  const renderPageHeader = () => (
    <TopBarContainer
      LeftSideContent={
        <>
          <TopBarItem
            topValue={summary?.category_count ?? '0'}
            disabled={summary ? false : true}
            bottomValue="Categories"
            customClass={`${summary?.category_count ? 'bold' : ''}`}
          />
          <TopBarItem
            topValue={summary?.collection_count ?? '0'}
            disabled={summary ? false : true}
            bottomValue="Collections"
            customClass={`left-divider ${summary?.collection_count ? 'bold' : ''}`}
          />
          <TopBarItem
            topValue={summary?.card_count ?? '0'}
            disabled={summary ? false : true}
            bottomValue="Cards"
            customClass={`left-divider ${summary?.card_count ? 'bold' : ''}`}
          />
          <TopBarItem
            topValue={summary?.product_count ?? '0'}
            disabled={summary ? false : true}
            bottomValue="Products"
            customClass={`left-divider ${summary?.product_count ? 'bold' : ''}`}
          />
        </>
      }
      RightSideContent={
        <>
          <TopBarItem
            topValue={renderItemTopBar('category_id', filter, 'select')}
            disabled
            bottomEnable={summary ? true : false}
            bottomValue={renderFilterDropdown(
              'Categories',
              categoryDropDownData,
              true,
              'Categories',
              'bottomRight',
            )}
            customClass="left-divider"
          />
          <TopBarItem
            topValue={renderItemTopBar('collection_id', filter, 'select')}
            disabled
            bottomEnable={summary ? true : false}
            bottomValue={renderFilterDropdown(
              'Collections',
              brandDropDownData,
              true,
              'Collections',
            )}
            customClass="left-divider mr-12"
          />
        </>
      }
    />
  );

  return (
    <PageContainer pageHeaderRender={renderPageHeader}>
      <CollapseProductList />
    </PageContainer>
  );
};

export default BrandProductListPage;
