import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useLocation } from 'umi';

import { getProductCategoryPagination } from '@/features/categories/services';
import { showImageUrl } from '@/helper/utils';
import { getBrandPagination } from '@/services';

import { setProductList, setProductListSorter } from '../reducers';
import { CategoryNestedList } from '@/features/categories/types';
import store, { useAppSelector } from '@/reducers';
import { BrandListItem } from '@/types';

export const formatCategoriesToDropDownData = (
  categories: CategoryNestedList[],
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

export const formatBrandsToDropDownData = (categories: BrandListItem[]): ItemType[] => {
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

export const SORTER_DROPDOWN_DATA: ItemType[] = [
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

export const useProductListFilterAndSorter = () => {
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

  const resetAllProductList = () => {
    dispatch(
      setProductList({
        filter: undefined,
        search: undefined,
        sort: undefined,
        brandSummary: undefined,
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

  // clear all filter and sorter on first loading
  useEffect(() => {
    resetAllProductList();
  }, [useLocation().pathname]);

  return {
    filter,
    sort,
    brands,
    categories,
    search,
    brandSummary,
    resetProductListFilter,
    resetProductListSorter,
    resetAllProductList,
    dispatch,
  };
};
