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
import { BodyText, Title } from '@/components/Typography';

const formatCategoriesToDropDownData = (
  categories: CategoryListResponse[],
  level: number,
): ItemType[] => {
  return categories.map((el) => ({
    key: el.id,
    label: el.name || '',
    children: el.subs ? formatCategoriesToDropDownData(el.subs, level + 1) : undefined,
    disabled: (el.subs || []).length === 0 && level < 3,
    onClick: el.subs?.length
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
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<ItemType[]>([]);
  const [brands, setBrands] = useState<ItemType[]>([]);

  const filter = useAppSelector((state) => state.product.list.filter);
  const sort = useAppSelector((state) => state.product.list.sort);
  const search = useAppSelector((state) => state.product.list.search);
  const brandSummary = useAppSelector((state) => state.product.list.brandSummary);

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
    getProductListForDesigner({});

    return () => {
      dispatch(resetProductState());
    };
  }, []);

  useEffect(() => {
    getProductCategoryPagination(
      {
        page: 1,
        pageSize: 99999,
      },
      (data) => {
        setCategories(formatCategoriesToDropDownData(data.data, 1));
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

  const searchProductByKeyword = debounce((e) => {
    dispatch(setProductListSearchValue(e.target.value));
  }, 300);

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
      <CollapseProductList showBrandLogo={filter?.name === 'category_id'} />
    </PageContainer>
  );
};

export default BrandProductListPage;
