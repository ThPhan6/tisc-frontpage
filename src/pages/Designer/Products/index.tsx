import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProductCardList from '@/components/Product/CardList';
import {
  CustomDropDown,
  FilterItem,
  TopBarContainer,
  TopBarItem,
} from '@/components/Product/components/ProductTopBarItem';
import store, { useAppSelector } from '@/reducers';
import { useDispatch } from 'react-redux';
import { setProductList } from '@/reducers/product';
import {
  getBrandPagination,
  getProductCategoryPagination,
  getProductListForDesigner,
} from '@/services';
import { CategoryListResponse, IBrandListItem } from '@/types';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { showImageUrl } from '@/helper/utils';

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
const formatBrandsToDropDownData = (categories: IBrandListItem[]): ItemType[] => {
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

const BrandProductListPage: React.FC = () => {
  const product = useAppSelector((state) => state.product);
  const { filter } = product.list;
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<ItemType[]>([]);
  const [brands, setBrands] = useState<ItemType[]>([]);
  console.log('categories', categories);
  console.log('product', product);

  const resetProductList = () => {
    dispatch(
      setProductList({
        filter: undefined,
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

    return resetProductList;
  }, []);

  useEffect(() => {
    if (filter) {
      getProductListForDesigner({
        category_id:
          filter?.name === 'category_id' && filter.value !== 'all' ? filter.value : undefined,
        brand_id: filter?.name === 'brand_id' && filter.value !== 'all' ? filter.value : undefined,
      });
    }
  }, [filter]);

  console.log('brands', brands);
  return (
    <PageContainer
      pageHeaderRender={() => (
        <TopBarContainer
          LeftSideContent={
            <>
              <TopBarItem
                topValue={
                  filter?.name === 'category_id' ? (
                    <FilterItem title={filter.title} onDelete={resetProductList} />
                  ) : (
                    'select'
                  )
                }
                bottomEnable={categories.length ? true : false}
                disabled={categories.length ? true : false}
                bottomValue={<CustomDropDown items={categories}>Categories</CustomDropDown>}
                customClass="right-divider"
                style={{
                  paddingLeft: 0,
                }}
              />
              <TopBarItem
                topValue={
                  filter?.name === 'brand_id' ? (
                    <FilterItem title={filter.title} onDelete={resetProductList} />
                  ) : (
                    'select'
                  )
                }
                bottomEnable={categories.length ? true : false}
                disabled={categories.length ? true : false}
                bottomValue={
                  <CustomDropDown items={brands} menuStyle={{ width: 240 }}>
                    Brands
                  </CustomDropDown>
                }
              />
            </>
          }
        />
      )}
    >
      <ProductCardList />
    </PageContainer>
  );
};

export default BrandProductListPage;
