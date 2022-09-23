import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { PageContainer } from '@ant-design/pro-layout';

import { getProductListByBrandId, getProductSummary } from '@/features/product/services';

import { setProductList } from '@/features/product/reducers';
import type { ProductGetListParameter } from '@/features/product/types';
import { useAppSelector } from '@/reducers';
import { GeneralData } from '@/types';

import {
  CollapseProductList,
  CustomDropDown,
  FilterItem,
  TopBarContainer,
  TopBarItem,
} from '@/features/product/components';
import {
  formatAllCategoriesToDropDownData,
  formatAllCollectionsToDropDownData,
  resetProductFilter,
  useSyncQueryToState,
} from '@/features/product/components/FilterAndSorter';

const BrandProductListPage: React.FC = () => {
  useSyncQueryToState();

  const dispatch = useDispatch();

  const filter = useAppSelector((state) => state.product.list.filter);
  const summary = useAppSelector((state) => state.product.summary);
  const userBrand = useAppSelector((state) => state.user.user?.brand);

  // brand product summary
  useEffect(() => {
    if (userBrand?.id) {
      // get product summary
      getProductSummary(userBrand.id);
    }
  }, []);

  useEffect(() => {
    if (!filter) {
      dispatch(setProductList({ data: [] }));
    }
    if (userBrand?.id && filter) {
      const params = {
        brand_id: userBrand.id,
      } as ProductGetListParameter;
      if (filter?.name === 'category_id') {
        params.category_id = filter.value;
      }
      if (filter?.name === 'collection_id') {
        params.collection_id = filter.value;
      }
      getProductListByBrandId(params);
    }
  }, [filter]);

  const renderFilterDropdown = (value: 'category_id' | 'collection_id') => {
    if (filter?.name === value) {
      return <FilterItem title={filter.title} onDelete={resetProductFilter} />;
    }
    return userBrand ? 'view' : <span style={{ opacity: 0 }}>.</span>;
  };

  const renderItemTopBar = (type: 'Categories' | 'Collections') => {
    const valueItem: GeneralData[] | undefined =
      type === 'Categories' ? summary?.categories : summary?.collections;
    return valueItem ? (
      <CustomDropDown
        items={
          type === 'Categories'
            ? formatAllCategoriesToDropDownData(valueItem)
            : formatAllCollectionsToDropDownData(valueItem)
        }
        viewAllTop
        placement="bottomRight"
        menuStyle={{ height: 'auto', width: 240 }}>
        {type}
      </CustomDropDown>
    ) : (
      `${type}`
    );
  };

  const renderPageHeader = () => (
    <TopBarContainer
      LeftSideContent={
        <>
          <TopBarItem
            topValue={summary?.category_count ?? '0'}
            disabled={summary ? false : true}
            bottomValue="Categories"
            customClass={`category ${summary?.category_count ? 'bold' : ''}`}
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
            topValue={renderFilterDropdown('category_id')}
            disabled
            bottomEnable={summary ? true : false}
            bottomValue={renderItemTopBar('Categories')}
            customClass="left-divider"
          />
          <TopBarItem
            topValue={renderFilterDropdown('collection_id')}
            disabled
            bottomEnable={summary ? true : false}
            bottomValue={renderItemTopBar('Collections')}
            customClass="left-divider collection"
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
