import React, { useEffect, useRef } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { InputRef } from 'antd';

import { ReactComponent as SearchIcon } from '@/assets/icons/ic-search.svg';

import { getProductListForDesigner } from '@/features/product/services';
import { showImageUrl } from '@/helper/utils';
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

  const {
    filter,
    sort,
    brands,
    search,
    categories,
    brandSummary,
    resetProductListFilter,
    resetProductListSorter,
    resetAllProductList,
    dispatch,
  } = useProductListFilterAndSorter();

  const searchProductByKeyword = debounce((e) => {
    dispatch(setProductListSearchValue(e.target.value));
  }, 300);

  // clear all on first loading
  useEffect(() => {
    resetAllProductList();
  }, []);

  useEffect(() => {
    dispatch(
      setProductList({
        data: [],
      }),
    );
    getProductListForDesigner({
      category_id:
        filter?.name === 'category_id' && filter.value !== 'all' ? filter.value : undefined,
      brand_id: filter?.name === 'brand_id' && filter.value !== 'all' ? filter.value : undefined,
      name: search || undefined,
      sort: sort?.sort,
      order: sort?.order,
    });
  }, [filter, search, sort]);

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
              filter?.name === 'category_id' ? (
                <FilterItem title={filter.title} onDelete={resetProductListFilter} />
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
              filter?.name === 'brand_id' ? (
                <FilterItem title={filter.title} onDelete={resetProductListFilter} />
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
              <CustomInput
                ref={searchInputRef}
                placeholder="search"
                className={styles.searchInput}
                onChange={searchProductByKeyword}
              />
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
