import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import store, { useAppSelector } from '@/reducers';
import { useDispatch } from 'react-redux';
import {
  resetProductState,
  setProductList,
  setProductListSearchValue,
  setProductListSorter,
} from '@/features/product/reducers';
import { getBrandPagination, getProductCategoryPagination } from '@/services';
import { CategoryListResponse, BrandListItem } from '@/types';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { showImageUrl } from '@/helper/utils';
import { ReactComponent as SearchIcon } from '@/assets/icons/ic-search.svg';
import { CustomInput } from '@/components/Form/CustomInput';
import styles from './styles.less';
import { debounce } from 'lodash';
import { getProductListForDesigner } from '@/features/product/services';
import {
  CustomDropDown,
  FilterItem,
  TopBarContainer,
  TopBarItem,
  CollapseProductList,
} from '@/features/product/components';

const formatCategoriesToDropDownData = (categories: CategoryListResponse[]): ItemType[] => {
  return categories.map((el) => ({
    key: el.id,
    label: el.name || '',
    children: el.subs ? formatCategoriesToDropDownData(el.subs) : undefined,
    onClick: el.subs
      ? undefined
      : () =>
          store.dispatch(
            setProductList({
              filter: {
                name: 'category_id',
                title: el.name || '',
                value: el.id,
              },
            }),
          ),
  }));
};

const formatBrandsToDropDownData = (categories: BrandListItem[]): ItemType[] => {
  return categories.map((el) => ({
    key: el.id,
    label: el.name || '',
    icon: <img src={showImageUrl(el.logo)} style={{ width: 18, height: 18 }} />,
    onClick: () =>
      store.dispatch(
        setProductList({
          filter: {
            name: 'brand_id',
            title: el.name || '',
            value: el.id,
          },
        }),
      ),
  }));
};

const SORTER_DROPDOWN_DATA: ItemType[] = [
  {
    key: 'ASC',
    label: 'A - Z',
    onClick: () =>
      store.dispatch(
        setProductListSorter({
          order: 'ASC',
          sort: 'name',
        }),
      ),
  },
  {
    key: 'DESC',
    label: 'Z - A',
    onClick: () =>
      store.dispatch(
        setProductListSorter({
          order: 'DESC',
          sort: 'name',
        }),
      ),
  },
];

const BrandProductListPage: React.FC = () => {
  const filter = useAppSelector((state) => state.product.list.filter);
  const sort = useAppSelector((state) => state.product.list.sort);
  const search = useAppSelector((state) => state.product.list.search);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<ItemType[]>([]);
  const [brands, setBrands] = useState<ItemType[]>([]);

  const resetProductListFilter = () => {
    dispatch(
      setProductList({
        filter: undefined,
        search: undefined,
        data: [],
      }),
    );
  };

  const resetProductListSorter = () => {
    dispatch(
      setProductList({
        sort: undefined,
        data: [],
      }),
    );
  };

  useEffect(() => {
    getProductCategoryPagination(
      {
        page: 1,
        pageSize: 99999,
      },
      (data) => {
        setCategories(formatCategoriesToDropDownData(data.data));
      },
    );
    getBrandPagination(
      {
        page: 1,
        pageSize: 99999,
      },
      (data) => {
        setBrands(formatBrandsToDropDownData(data.data));
      },
    );

    return () => {
      dispatch(resetProductState());
    };
  }, []);

  useEffect(() => {
    if (filter || search || sort) {
      getProductListForDesigner({
        category_id:
          filter?.name === 'category_id' && filter.value !== 'all' ? filter.value : undefined,
        brand_id: filter?.name === 'brand_id' && filter.value !== 'all' ? filter.value : undefined,
        name: search || undefined,
        sort: sort?.sort,
        order: sort?.order,
      });
    }
  }, [filter, search, sort]);

  const searchProductByKeyword = debounce((e) => {
    dispatch(setProductListSearchValue(e.target.value));
  }, 300);

  return (
    <PageContainer
      pageHeaderRender={() => (
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
                disabled={categories.length ? true : false}
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
                disabled={brands.length ? true : false}
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
                    <FilterItem title={sort.order} onDelete={resetProductListSorter} />
                  ) : (
                    'select'
                  )
                }
                bottomEnable={true}
                disabled
                bottomValue={
                  <CustomDropDown
                    items={SORTER_DROPDOWN_DATA}
                    menuStyle={{ width: 160, height: 'auto' }}
                  >
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
                    placeholder="search"
                    className={styles.searchInput}
                    onChange={searchProductByKeyword}
                  />
                }
                bottomValue={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    Keywords <SearchIcon />
                  </span>
                }
                customClass="left-divider"
              />
            </>
          }
        />
      )}
    >
      {filter || search || sort ? <CollapseProductList /> : null}
    </PageContainer>
  );
};

export default BrandProductListPage;
