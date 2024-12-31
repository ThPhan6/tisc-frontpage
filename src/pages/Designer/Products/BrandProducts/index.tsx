import React, { useCallback, useEffect, useRef, useState } from 'react';

import { QUERY_KEY } from '@/constants/util';
import { PageContainer } from '@ant-design/pro-layout';
import { InputRef } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as SearchIcon } from '@/assets/icons/ic-search.svg';

import { getProductCategoryPagination } from '@/features/categories/services';
import { getProductListForDesigner } from '@/features/product/services';
import { getBrandPagination } from '@/features/user-group/services';
import { useBoolean, useQuery } from '@/helper/hook';
import { formatNumber, removeUrlParams, setUrlParams } from '@/helper/utils';
import { debounce } from 'lodash';

import { setProductList, setProductListSearchValue } from '@/features/product/reducers';

import { CustomInput } from '@/components/Form/CustomInput';
import { LogoIcon } from '@/components/LogoIcon';
import SortOrderPanel from '@/components/SortOrder';
import { BodyText, Title } from '@/components/Typography';
import {
  CollapseProductList,
  CustomDropDown,
  TopBarContainer,
  TopBarItem,
} from '@/features/product/components';
import {
  formatCategoriesToDropDownData,
  useProductListFilterAndSorter,
} from '@/features/product/components/BrandProductFilterAndSorter';

import styles from './index.less';

const BrandProductListPage: React.FC = () => {
  const searchInputRef = useRef<InputRef>(null);
  const query = useQuery();
  const cate_id = query.get(QUERY_KEY.cate_id);
  const brand_id = query.get(QUERY_KEY.brand_id);
  const sort_order = query.get(QUERY_KEY.sort_order);
  const searchParam = query.get(QUERY_KEY.search);
  const firstLoad = useBoolean(true);
  const [searchCount, setSearchCount] = useState(0);

  /// to prevent load more data while api is calling
  const [isLoading, setIsLoading] = useState(false);
  /// check if have more data when its limit
  const [isLoadMoreData, setIsLoadMoreData] = useState(false);

  const [categories, setCategories] = useState<ItemType[]>([]);
  const [brands, setBrands] = useState<ItemType[]>([]);

  const {
    filter,
    sort,
    search,
    brandSummary,
    pagination,
    dispatch,
    renderFilterDropdown,
    renderItemTopBar,
  } = useProductListFilterAndSorter({ noFetchData: true });

  const debouceSearch = useCallback(
    debounce((value: string) => {
      if (value) {
        setUrlParams([
          {
            key: 'search',
            value: value,
          },
        ]);
      } else {
        removeUrlParams('search');
      }
      setSearchCount((prev) => prev + 1);
      /// scroll to top
      window.scrollTo({ top: 0 });
    }, 300),
    [setSearchCount],
  );

  const searchProductByKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ?? '';
    dispatch(setProductListSearchValue(value));
    debouceSearch(value);
  };

  const clearSearchInput = () => {
    dispatch(setProductListSearchValue(''));
    removeUrlParams('search');
    setSearchCount((prev) => prev + 1);
  };

  // useEffect(() => {
  //   /// clear all product
  //   return () => {
  //     dispatch(resetProductState());
  //     window.removeEventListener('onscroll', () => {});
  //   };
  // }, []);

  const getProductList = async (props: { page: number; isConcat: boolean }) => {
    setIsLoading(true);
    const cateFilter = filter?.find((item) => item.name === 'category_id');
    const brandFilter = filter?.find((item) => item.name === 'brand_id');
    await getProductListForDesigner(
      {
        category_id: cateFilter && cateFilter.value !== 'all' ? cateFilter.value : undefined,
        brand_id: brandFilter && brandFilter.value !== 'all' ? brandFilter.value : undefined,
        name: searchInputRef.current?.input?.value || undefined,
        sort: sort?.sort,
        order: sort?.order,
        page: props.page,
        pageSize: filter?.length ? 99999 : 20,
      },
      { isConcat: props.isConcat },
    )
      .then((result) => {
        const { current, total, pageSize } = result.pagination;
        const isLoadMore = (current - 1) * pageSize + (result.allProducts?.length || 0) < total;
        setIsLoadMoreData(isLoadMore);

        if (isLoadMore) {
          setTimeout(() => {
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
              getProductList({ page: current + 1, isConcat: true });
            }
          }, 500);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onCheckAtBottomPage = () => {
    // you're at the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
      setIsLoading(true);
      getProductList({ page: pagination.current ? pagination.current + 1 : 1, isConcat: true });
    }
  };

  window.onscroll = () => {
    if (
      isLoading ||
      !isLoadMoreData ||
      window.location.pathname.indexOf('/design-firms/products/brand-products') === -1
    ) {
      return;
    }
    onCheckAtBottomPage();
  };

  useEffect(() => {
    firstLoad.setValue(false);

    dispatch(setProductList({ data: [] }));

    const noFiltering =
      (!filter || filter.length === 0) && !sort && !searchInputRef.current?.input?.value;

    // Prevent first load call both no-filter api and have-filter api
    if ((cate_id || brand_id || sort_order || searchParam) && noFiltering && firstLoad.value) {
      return;
    }
    setIsLoading(true);

    getProductList({ page: 1, isConcat: false });

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [JSON.stringify(filter), searchCount, sort?.order, sort?.sort]);

  useEffect(() => {
    if (!firstLoad.value) return;

    Promise.all([
      /// get all category
      getProductCategoryPagination(
        {
          page: 1,
          pageSize: 99999,
          haveProduct: true,
        },
        (data) => {
          setCategories(formatCategoriesToDropDownData(data.data, 1, filter));
        },
      ),
      /// get all brand
      getBrandPagination(
        {
          page: 1,
          pageSize: 99999,
          haveProduct: true,
        },
        (data) => {
          setBrands(
            data.data.map((item) => ({
              key: item.id,
              label: item.name,
              icon: item.logo,
            })),
          );
        },
        false,
      ),
    ]);
  }, [firstLoad.value]);

  const renderInfoItem = (info: string, count: number, lastOne?: boolean) => (
    <div className="flex-start" style={{ marginRight: lastOne ? undefined : 24 }}>
      <BodyText level={5} fontFamily="Roboto" style={{ marginRight: 8 }}>
        {info}:
      </BodyText>
      <Title level={8}>{count}</Title>
    </div>
  );

  const PageHeader = () => (
    <TopBarContainer
      LeftSideContent={
        <>
          <TopBarItem
            topValue={renderItemTopBar('brand_id', filter, 'select')}
            bottomEnable={brands.length ? true : false}
            disabled
            bottomValue={renderFilterDropdown('Brands', brands, false, undefined, undefined, {
              autoHeight: false,
            })}
            customClass="right-divider"
          />
          <TopBarItem
            topValue={renderItemTopBar('category_id', filter, 'select')}
            bottomEnable={categories.length ? true : false}
            disabled
            bottomValue={
              <CustomDropDown
                items={categories}
                menuStyle={{ height: 'max-content' }}
                nestedMenu
                autoHeight={false}
              >
                Categories
              </CustomDropDown>
            }
            customClass="right-divider pl-0"
          />

          <SortOrderPanel order={sort?.order} sort={sort} style={{ paddingLeft: 0 }} />
        </>
      }
      RightSideContent={
        <>
          <TopBarItem
            topValue={
              <div className={styles.searchInputWrapper}>
                <CustomInput
                  ref={searchInputRef}
                  placeholder="search"
                  defaultValue={searchParam || undefined}
                  onChange={searchProductByKeyword}
                  value={search}
                  className={styles.searchInput}
                />
                {search && search !== '' ? (
                  <DeleteIcon onClick={clearSearchInput} className={styles.clearSearchBtn} />
                ) : null}
              </div>
            }
            bottomValue={
              <span
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => searchInputRef.current?.focus()}
              >
                Keywords <SearchIcon />
              </span>
            }
            customClass="left-divider"
          />
        </>
      }
      BottomContent={
        brandSummary ? (
          <>
            <div className="flex-center" style={{ marginRight: '24px' }}>
              <LogoIcon logo={brandSummary.brand_logo} className={styles.brandLogo} size={20} />
              <Title level={8} style={{ whiteSpace: 'nowrap' }}>
                {brandSummary.brand_name}
              </Title>
            </div>

            <div className="flex-end">
              {renderInfoItem('Collections', formatNumber(brandSummary.collection_count) as any)}
              {renderInfoItem('Cards', formatNumber(brandSummary.card_count) as any, true)}
            </div>
          </>
        ) : undefined
      }
    />
  );

  return (
    <PageContainer pageHeaderRender={PageHeader}>
      <CollapseProductList
        // showBrandLogo={filter?.name === 'category_id'}
        showInquiryRequest
      />
    </PageContainer>
  );
};

export default BrandProductListPage;
