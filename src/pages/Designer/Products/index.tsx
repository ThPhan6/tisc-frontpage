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
import { getProductCategoryPagination, getProductListForDesigner } from '@/services';
import { CategoryListResponse } from '@/types';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

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

const BrandProductListPage: React.FC = () => {
  const product = useAppSelector((state) => state.product);
  const { filter } = product.list;
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<ItemType[]>([]);
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

    return resetProductList;
  }, []);

  useEffect(() => {
    if (filter) {
      getProductListForDesigner({
        category_id:
          filter?.name === 'category_id' && filter.value !== 'all' ? filter.value : undefined,
      });
    }
  }, [filter]);

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
