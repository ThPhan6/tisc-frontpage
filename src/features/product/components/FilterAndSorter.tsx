import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { QUERY_KEY } from '@/constants/util';
import { DropDownProps } from 'antd/es/dropdown';
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
import { onCompanyFilterClick } from '@/pages/Designer/Products/CustomLibrary/hook';

import { setProductList, setProductListSorter } from '../reducers';
import { SortOrder } from '../types';
import { CategoryNestedList } from '@/features/categories/types';
import store, { useAppSelector } from '@/reducers';

import { LogoIcon } from '@/components/LogoIcon';

import { CustomDropDown, FilterItem } from './ProductTopBarItem';
import styles from './detail.less';

export const onCategoryFilterClick = (id: string, name: string = '') => {
  updateUrlParams({
    set: [
      { key: QUERY_KEY.cate_id, value: id },
      { key: QUERY_KEY.cate_name, value: name },
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

export const onBrandFilterClick = (id: string, name: string = '') => {
  updateUrlParams({
    set: [
      { key: QUERY_KEY.brand_id, value: id },
      { key: QUERY_KEY.brand_name, value: name },
    ],
    remove: [QUERY_KEY.cate_id, QUERY_KEY.cate_name],
  });
  store.dispatch(
    setProductList({
      filter: {
        name: 'brand_id',
        title: name,
        value: id,
      },
    }),
  );
};

export const onCollectionFilterClick = (id: string, name: string = '') => {
  updateUrlParams({
    set: [
      { key: QUERY_KEY.coll_id, value: id },
      { key: QUERY_KEY.coll_name, value: name },
    ],
    remove: [QUERY_KEY.cate_id, QUERY_KEY.cate_name, QUERY_KEY.company_id, QUERY_KEY.company_name],
  });
  store.dispatch(
    setProductList({
      filter: {
        name: 'collection_id',
        value: id,
        title: name,
      },
    }),
  );
};

export interface FormatFilterForDropDownProps {
  id: string;
  name: string;
  logo?: string | React.ReactNode;
}

export const setFormatFilterForDropDown = (
  items: ItemType[],
  onFilter?: (id: string, name?: string) => void,
  haveViewAll?: boolean,
): ItemType[] => {
  if (!items || !items.length) return [];

  let filterData: ItemType[] = items;

  const renderLogo = (logo: string | React.ReactNode) => {
    if (typeof logo === 'object') {
      if (logo === null) {
        return <LogoIcon logo={logo} className={styles.customLogo} />;
      }
      return logo;
    }
    if (typeof logo === 'string') {
      return <img src={showImageUrl(logo)} style={{ width: 18, height: 18 }} />;
    }
  };

  if (haveViewAll) {
    filterData = [{ key: 'all', label: 'VIEW ALL' }, ...filterData];
  }

  return filterData.map((el) => ({
    key: el?.id || el?.key,
    label: el?.name || el?.label || '',
    icon: renderLogo(el?.icon),
    onClick: () => onFilter?.(el?.id || el?.key, el?.name || el?.label),
  }));
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

export const updateQueryToState = (query: {
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

  const name = getValueByCondition([
    [query.cate_id, 'category_id'],
    [query.coll_id, 'collection_id'],
    [query.brand_id, 'brand_id'],
  ]);

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

export type ProductFilterType =
  | 'category_id'
  | 'collection_id'
  | 'company_id'
  | 'brand_id'
  | 'name';

export interface ProductTopBarFilter {
  name: ProductFilterType;
  title: string;
  value: string;
}

export const useProductListFilterAndSorter = (fetchs: {
  noFetchData?: boolean;
  brand?: boolean;
  category?: boolean;
}) => {
  useSyncQueryToState();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<ItemType[]>([]);
  const [brands, setBrands] = useState<ItemType[]>([]);

  /// product
  const filter = useAppSelector((state) => state.product.list.filter);
  const sort = useAppSelector((state) => state.product.list.sort);
  const search = useAppSelector((state) => state.product.list.search);
  const brandSummary = useAppSelector((state) => state.product.list.brandSummary);
  const productBrand = useAppSelector((state) => state.product.brand);
  const productSummary = useAppSelector((state) => state.product.summary);

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
    if (fetchs.noFetchData) return;

    if (fetchs.category) {
      getProductCategoryPagination(
        {
          page: 1,
          pageSize: 99999,
          haveProduct: true,
        },
        (data) => {
          setCategories(formatCategoriesToDropDownData(data.data, 1));
        },
      );
    }

    if (fetchs.brand) {
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

          // setFormatFilterForDropDown(
          //   data.data.map((item) => ({
          //     key: item.id,
          //     label: item.name,
          //     icon: item.logo,
          //   })),
          // ),
          // );
        },
      );
    }

    // clear all filter and sorter on first loading
    return resetAllProductList;
  }, []);

  const resetProductListSorter = () => {
    removeUrlParams([QUERY_KEY.sort_order, QUERY_KEY.sort_name]);
    dispatch(setProductList({ sort: undefined }));
  };

  const resetFilter = () => {
    removeUrlParams([
      QUERY_KEY.cate_id,
      QUERY_KEY.cate_name,
      QUERY_KEY.brand_id,
      QUERY_KEY.brand_name,
      QUERY_KEY.coll_id,
      QUERY_KEY.coll_name,
      QUERY_KEY.company_id,
      QUERY_KEY.company_name,
    ]);
    dispatch(setProductList({ filter: undefined, brandSummary: undefined }));
  };

  const renderItemTopBar = (
    filterType: ProductFilterType,
    filterValue?: ProductTopBarFilter,
    defaultLabel?: string,
  ) => {
    if (filter?.name && filter?.name === filterType && filterValue?.value) {
      return <FilterItem title={filter?.title || ''} onDelete={resetFilter} />;
    }

    if (defaultLabel) return defaultLabel;

    return undefined;
  };

  const renderFilterDropdown = (
    type: 'Categories' | 'Collections' | 'Companies' | 'Brands',
    filterData: ItemType[],
    haveViewAll?: boolean,
    labelDefault?: string | ReactNode,
    position?: DropDownProps['placement'],
  ) => {
    if (!filterData || !filterData?.length) {
      return labelDefault || type;
    }

    const renderDropDowmItem = () => {
      if (type === 'Categories') {
        return setFormatFilterForDropDown(filterData, onCategoryFilterClick, haveViewAll);
      }

      if (type === 'Collections') {
        return setFormatFilterForDropDown(filterData, onCollectionFilterClick, haveViewAll);
      }

      if (type === 'Brands') {
        return setFormatFilterForDropDown(filterData, onBrandFilterClick, haveViewAll);
      }

      if (type === 'Companies') {
        return setFormatFilterForDropDown(filterData, onCompanyFilterClick, haveViewAll);
      }

      return undefined;
    };

    return (
      <CustomDropDown
        items={renderDropDowmItem()}
        viewAllTop={haveViewAll}
        placement={position ?? 'bottomLeft'}
        menuStyle={{ height: 'max-content', width: 240 }}>
        {type}
      </CustomDropDown>
    );
  };

  return {
    filter,
    sort,
    brands,
    categories,
    search,
    brandSummary,
    productBrand,
    productSummary,
    renderItemTopBar,
    renderFilterDropdown,
    resetProductListSorter,
    resetAllProductList,
    resetFilter,
    dispatch,
  };
};
