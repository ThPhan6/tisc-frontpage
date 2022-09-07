import React, { useCallback, useEffect, useRef, useState } from 'react';

import { QUERY_KEY } from '@/constants/util';
import { PageContainer } from '@ant-design/pro-layout';
import { InputRef } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as SearchIcon } from '@/assets/icons/ic-search.svg';

import { getProductListForDesigner } from '@/features/product/services';
import { useBoolean, useQuery } from '@/helper/hook';
import { removeUrlParams, setUrlParams, showImageUrl } from '@/helper/utils';
import { debounce } from 'lodash';

import { setProductList, setProductListSearchValue } from '@/features/product/reducers';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, Title } from '@/components/Typography';
import {
  CollapseProductList,
  CustomDropDown,
  FilterItem,
  TopBarContainer,
  TopBarItem,
} from '@/features/product/components';
import {
  SORTER_DROPDOWN_DATA,
  useProductListFilterAndSorter,
} from '@/features/product/components/FilterAndSorter';

import styles from './styles.less';

const BrandProductListPage: React.FC = () => {
  const searchInputRef = useRef<InputRef>(null);
  const query = useQuery();
  const cate_id = query.get(QUERY_KEY.cate_id);
  const brand_id = query.get(QUERY_KEY.brand_id);
  const sort_order = query.get(QUERY_KEY.sort_order);
  const searchParam = query.get(QUERY_KEY.search);
  const firstLoad = useBoolean(true);
  const [searchCount, setSearchCount] = useState(0);

  const {
    filter,
    sort,
    brands,
    search,
    categories,
    brandSummary,
    resetProductListSorter,
    dispatch,
    removeFilter,
  } = useProductListFilterAndSorter();

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

  useEffect(() => {
    firstLoad.setValue(false);

    dispatch(setProductList({ data: [] }));

    const noFiltering = !filter && !sort && !search;

    // Prevent first laod call both no-filter api and have-filter api
    if ((cate_id || brand_id || sort_order || searchParam) && noFiltering && firstLoad.value) {
      return;
    }

    getProductListForDesigner({
      category_id:
        filter?.name === 'category_id' && filter.value !== 'all' ? filter.value : undefined,
      brand_id: filter?.name === 'brand_id' && filter.value !== 'all' ? filter.value : undefined,
      name: search || undefined,
      sort: sort?.sort,
      order: sort?.order,
    });
  }, [filter, searchCount, sort]);

  const renderInfoItem = (info: string, count: number, lastOne?: boolean) => (
    <div className="flex-start" style={{ marginRight: lastOne ? undefined : 24 }}>
      <BodyText level={5} fontFamily="Roboto" style={{ marginRight: 8 }}>
        {info}:{' '}
      </BodyText>
      <Title level={8}>{count}</Title>
    </div>
  );

  const PageHeader = () => (
    <TopBarContainer
      LeftSideContent={
        <>
          <TopBarItem
            topValue={
              filter?.name === 'brand_id' ? (
                <FilterItem title={filter.title} onDelete={removeFilter} />
              ) : (
                'select'
              )
            }
            bottomEnable={brands.length ? true : false}
            disabled
            bottomValue={
              <CustomDropDown items={brands} menuStyle={{ width: 240 }}>
                Brands
              </CustomDropDown>
            }
            customClass="right-divider"
            style={{ paddingLeft: 0 }}
          />
          <TopBarItem
            topValue={
              filter?.name === 'category_id' ? (
                <FilterItem title={filter.title} onDelete={removeFilter} />
              ) : (
                'select'
              )
            }
            bottomEnable={categories.length ? true : false}
            disabled
            bottomValue={<CustomDropDown items={categories}>Categories</CustomDropDown>}
            customClass="right-divider"
            style={{ paddingLeft: 0 }}
          />
          <TopBarItem
            topValue={
              sort ? (
                <FilterItem
                  title={sort.order === 'ASC' ? 'A - Z' : 'Z - A'}
                  onDelete={resetProductListSorter}
                />
              ) : (
                'select'
              )
            }
            bottomEnable={true}
            disabled
            bottomValue={
              <CustomDropDown
                items={SORTER_DROPDOWN_DATA}
                menuStyle={{ width: 160, height: 'auto' }}>
                Sort By
              </CustomDropDown>
            }
            style={{ paddingLeft: 0 }}
          />
        </>
      }
      RightSideContent={
        <>
          <TopBarItem
            topValue={
              // <CustomInput
              //
              //   fontLevel={3}
              //   deleteIcon
              //   onDelete={() => {
              //     // searchInputRef.current?.input?.set = '';
              //     searchProductByKeyword({target:{value: ''}});
              //   }}
              //   forceDisplayDeleteIcon
              // />
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
                onClick={() => searchInputRef.current?.focus()}>
                Keywords <SearchIcon />
              </span>
            }
            customClass="left-divider"
          />
        </>
      }
      BottomContent={
        brandSummary && (
          <>
            <div className="flex-center">
              <img
                src={showImageUrl(brandSummary.brand_logo)}
                style={{ marginRight: 8, width: 20, height: 20 }}
              />
              <Title level={8}>{brandSummary.brand_name}</Title>
            </div>

            <div className="flex-end">
              {renderInfoItem('Collections', brandSummary.collection_count)}
              {renderInfoItem('Cards', brandSummary.card_count)}
              {renderInfoItem('Products', brandSummary.product_count, true)}
            </div>
          </>
        )
      }
    />
  );

  return (
    <PageContainer pageHeaderRender={PageHeader}>
      <CollapseProductList
      // showBrandLogo={filter?.name === 'category_id'}
      />
    </PageContainer>
  );
};

export default BrandProductListPage;
