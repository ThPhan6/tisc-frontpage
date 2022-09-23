import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { QUERY_KEY } from '@/constants/util';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useHistory } from 'umi';

import { getProductCategoryPagination } from '@/features/categories/services';
import { getBrandPagination } from '@/features/user-group/services';
import { useQuery } from '@/helper/hook';
import {
  getValueByCondition,
  removeUrlParams,
  setUrlParams,
  showImageUrl,
  updateUrlParams,
} from '@/helper/utils';

import { setProductList, setProductListSorter } from '../reducers';
import { SortOrder } from '../types';
import { CategoryNestedList } from '@/features/categories/types';
import { BrandListItem } from '@/features/user-group/types';
import store, { useAppSelector } from '@/reducers';
import { GeneralData } from '@/types';

export const onCategoryFilterClick = (id: string, name: string) => {
  updateUrlParams({
    set: [
      { key: QUERY_KEY.cate_id, value: id },
      { key: QUERY_KEY.cate_name, value: name || '' },
    ],
    remove: [QUERY_KEY.coll_id, QUERY_KEY.coll_name],
  });
  store.dispatch(
    setProductList({
      filter: {
        name: 'category_id',
        title: name,
        value: id,
      },
    }),
  );
};

export const onBrandFilterClick = (id: string, name: string) => {
  updateUrlParams({
    set: [
      { key: QUERY_KEY.brand_id, value: id },
      { key: QUERY_KEY.brand_name, value: name || '' },
    ],
    remove: [QUERY_KEY.cate_id, QUERY_KEY.cate_name],
  });
  store.dispatch(
    setProductList({
      filter: {
        name: 'brand_id',
        title: name || '',
        value: id,
      },
    }),
  );
};

export const formatCategoriesToDropDownData = (
  categories: CategoryNestedList[],
  level: number,
): ItemType[] => {
  return categories.map((el) => ({
    key: el.id,
    label: el.name || '',
    children: el.subs ? formatCategoriesToDropDownData(el.subs, level + 1) : undefined,
    disabled: (el.subs || []).length === 0 && level < 3,
    onClick: el.subs?.length ? undefined : () => onCategoryFilterClick(el.id, el.name || ''),
  }));
};

export const formatBrandsToDropDownData = (items: BrandListItem[]): ItemType[] => {
  return items.map((el) => ({
    key: el.id,
    label: el.name || '',
    icon: <img src={showImageUrl(el.logo)} style={{ width: 18, height: 18 }} />,
    onClick: () => onBrandFilterClick(el.id, el.name),
  }));
};
export const formatAllCategoriesToDropDownData = (items: GeneralData[]) =>
  [{ id: 'all', name: 'VIEW ALL' }, ...items].map((el) => ({
    key: el.id,
    label: el.name || '',
    onClick: () => onCategoryFilterClick(el.id, el.name),
  }));

export const formatAllCollectionsToDropDownData = (items: GeneralData[]) =>
  [{ id: 'all', name: 'VIEW ALL' }, ...items].map((el) => ({
    key: el.id,
    label: el.name || '',
    onClick: () => {
      updateUrlParams({
        set: [
          { key: QUERY_KEY.coll_id, value: el.id },
          { key: QUERY_KEY.coll_name, value: el.name || '' },
        ],
        remove: [QUERY_KEY.cate_id, QUERY_KEY.cate_name],
      });
      store.dispatch(
        setProductList({
          filter: {
            name: 'collection_id',
            title: el.name || '',
            value: el.id,
          },
        }),
      );
    },
  }));

export const SORTER_DROPDOWN_DATA: ItemType[] = [
  {
    key: 'ASC',
    label: 'A - Z',
    onClick: () => {
      setUrlParams([
        { key: QUERY_KEY.sort_order, value: 'ASC' },
        { key: QUERY_KEY.sort_name, value: 'A - Z' },
      ]);
      store.dispatch(
        setProductListSorter({
          order: 'ASC',
          sort: 'name',
        }),
      );
    },
  },
  {
    key: 'DESC',
    label: 'Z - A',
    onClick: () => {
      setUrlParams([
        { key: QUERY_KEY.sort_order, value: 'DESC' },
        { key: QUERY_KEY.sort_name, value: 'Z - A' },
      ]);
      store.dispatch(
        setProductListSorter({
          order: 'DESC',
          sort: 'name',
        }),
      );
    },
  },
];

const updateQueryToState = (query: {
  cate_id?: string | null;
  cate_name?: string | null;
  brand_id?: string | null;
  brand_name?: string | null;
  coll_id?: string | null;
  coll_name?: string | null;
  search?: string;
  sort_order?: string;
}) => {
  if (!query) return;

  const name = getValueByCondition(
    [
      [query.cate_id, 'category_id'],
      [query.coll_id, 'collection_id'],
      [query.brand_id, 'brand_id'],
    ],
    undefined,
  );

  store.dispatch(
    setProductList({
      filter: name
        ? {
            name,
            title: query.cate_name || query.brand_name || query.coll_name || '',
            value: query.cate_id || query.brand_id || query.coll_id || '',
          }
        : undefined,
      sort: query.sort_order
        ? {
            order: query.sort_order as SortOrder,
            sort: 'name',
          }
        : undefined,
      search: query.search,
    }),
  );
};

export const useSyncQueryToState = () => {
  const query = useQuery();
  const history = useHistory();

  useEffect(() => {
    const cate_id = query.get(QUERY_KEY.cate_id);
    const cate_name = query.get(QUERY_KEY.cate_name);

    const coll_id = query.get(QUERY_KEY.coll_id);
    const coll_name = query.get(QUERY_KEY.coll_name);

    const brand_id = query.get(QUERY_KEY.brand_id);
    const brand_name = query.get(QUERY_KEY.brand_name);

    const sort_order = query.get(QUERY_KEY.sort_order) || undefined;
    const search = query.get(QUERY_KEY.search) || undefined;

    updateQueryToState({
      cate_id,
      cate_name,
      brand_id,
      brand_name,
      coll_id,
      coll_name,
      sort_order,
      search,
    });

    history.listen((location) => {
      if (!location.query) {
        return;
      }
      updateQueryToState({
        ...location.query,
        sort_order: location.query.sort_order as SortOrder,
      });
    });
  }, []);
};

export const useProductListFilterAndSorter = (props?: { noFetchData?: boolean }) => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<ItemType[]>([]);
  const [brands, setBrands] = useState<ItemType[]>([]);

  const filter = useAppSelector((state) => state.product.list.filter);
  const sort = useAppSelector((state) => state.product.list.sort);
  const search = useAppSelector((state) => state.product.list.search);
  const brandSummary = useAppSelector((state) => state.product.list.brandSummary);

  useSyncQueryToState();

  const removeFilter = () => {
    removeUrlParams([
      QUERY_KEY.cate_id,
      QUERY_KEY.cate_name,
      QUERY_KEY.brand_id,
      QUERY_KEY.brand_name,
    ]);
    dispatch(setProductList({ filter: undefined, brandSummary: undefined }));
  };

  const resetProductListSorter = () => {
    removeUrlParams([QUERY_KEY.sort_order, QUERY_KEY.sort_name]);
    dispatch(setProductList({ sort: undefined }));
  };

  const resetAllProductList = () => {
    dispatch(
      setProductList({
        filter: undefined,
        search: '',
        sort: undefined,
        brandSummary: undefined,
        data: [],
      }),
    );
  };

  useEffect(() => {
    if (props?.noFetchData) return;

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

    // clear all filter and sorter on first loading
    return resetAllProductList;
  }, []);

  return {
    filter,
    sort,
    brands,
    categories,
    search,
    brandSummary,
    resetProductListSorter,
    resetAllProductList,
    removeFilter,
    dispatch,
  };
};

export const resetProductFilter = () => {
  removeUrlParams([QUERY_KEY.cate_id, QUERY_KEY.cate_name, QUERY_KEY.coll_id, QUERY_KEY.coll_name]);
  store.dispatch(setProductList({ filter: undefined, data: [] }));
};
