import React, { useEffect } from 'react';

import { QUERY_KEY } from '@/constants/util';
import { PageContainer } from '@ant-design/pro-layout';

import { getProductListByBrandId, getProductSummary } from '@/features/product/services';
import { useBoolean, useQuery } from '@/helper/hook';
import { formatNumber } from '@/helper/utils';
import { sortBy } from 'lodash';

import { useAppSelector } from '@/reducers';

import { CollapseProductList, TopBarContainer, TopBarItem } from '@/features/product/components';
import { useProductListFilterAndSorter } from '@/features/product/components/FilterAndSorter';

const BrandProductListPage: React.FC = () => {
  const query = useQuery();
  const cate_id = query.get(QUERY_KEY.cate_id);
  const coll_id = query.get(QUERY_KEY.coll_id);
  const filter = useAppSelector((state) => state.product.list.filter);

  /// using for get product list by filter
  const firstLoad = useBoolean(true);

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
    if (
      !userBrand?.id ||
      ((!filter || filter.length === 0) && firstLoad.value && (cate_id || coll_id))
    ) {
      return;
    }

    if (coll_id || cate_id) {
      firstLoad.setValue(false);
    }

    /// show product list defailt by collection
    if (!filter || filter.length === 0) {
      getProductListByBrandId({
        brand_id: userBrand.id,
        collection_id: 'all',
      });
      return;
    }

    const cateFilter = filter.find((item) => item.name === 'category_id');
    const collFilter = filter.find((item) => item.name === 'collection_id');
    getProductListByBrandId({
      brand_id: userBrand.id,
      category_id: cateFilter ? cateFilter.value : undefined,
      collection_id: collFilter ? collFilter.value : undefined,
    });
  }, [filter]);

  const renderPageHeader = () => (
    <TopBarContainer
      LeftSideContent={
        <>
          <TopBarItem
            topValue={formatNumber(summary?.category_count ?? 0)}
            disabled={summary ? false : true}
            bottomValue="Categories"
            customClass={`${summary?.category_count ? 'bold' : ''}`}
          />
          <TopBarItem
            topValue={formatNumber(summary?.collection_count ?? 0)}
            disabled={summary ? false : true}
            bottomValue="Collections"
            customClass={`left-divider ${summary?.collection_count ? 'bold' : ''}`}
          />
          <TopBarItem
            topValue={formatNumber(summary?.card_count ?? 0)}
            disabled={summary ? false : true}
            bottomValue="Cards"
            customClass={`left-divider ${summary?.card_count ? 'bold' : ''}`}
          />
          {/* <TopBarItem
            topValue={formatNumber(summary?.product_count ?? 0)}
            disabled={summary ? false : true}
            bottomValue="Products"
            customClass={`left-divider mr-12 ${summary?.product_count ? 'bold' : ''}`}
          /> */}
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
              sortBy(categoryDropDownData, (el) => el.label),
              true,
              'Categories',
              'bottomRight',
              { autoHeight: false, borderFirstItem: true },
            )}
            customClass="left-divider"
          />
          <TopBarItem
            topValue={renderItemTopBar('collection_id', filter, 'select')}
            disabled
            bottomEnable={summary ? true : false}
            bottomValue={renderFilterDropdown(
              'Collections',
              sortBy(brandDropDownData, (el) => el.label),
              true,
              'Collections',
              undefined,
              { autoHeight: false, borderFirstItem: true },
            )}
            customClass="left-divider mr-12"
          />
        </>
      }
    />
  );

  return (
    <PageContainer pageHeaderRender={renderPageHeader}>
      <CollapseProductList hideFavorite={true} />
    </PageContainer>
  );
};

export default BrandProductListPage;
