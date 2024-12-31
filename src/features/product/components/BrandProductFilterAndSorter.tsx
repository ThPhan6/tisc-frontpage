import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PATH } from '@/constants/path';
import { QUERY_KEY } from '@/constants/util';
import { DropDownProps } from 'antd/es/dropdown';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useHistory } from 'umi';

import { getProductCategoryPagination } from '@/features/categories/services';
import { getBrandPagination } from '@/features/user-group/services';
import { useQuery } from '@/helper/hook';
import { removeUrlParams, setUrlParams, showImageUrl, updateUrlParams } from '@/helper/utils';
import { onCompanyFilterClick } from '@/pages/Designer/Products/CustomLibrary/hook';

import { setProductList, setProductListSorter } from '../reducers';
import { SortOrder } from '../types';
import { CategoryNestedList } from '@/features/categories/types';
import store, { useAppSelector } from '@/reducers';

import { LogoIcon } from '@/components/LogoIcon';

import { CustomDropDown, CustomDropDownProps, FilterItem } from './ProductTopBarItem';
import styles from './detail.less';

export const onCategoryFilterClick = (
  id: string,
  name: string = '',
  filter: ProductTopBarFilter[] | undefined,
) => {
  updateUrlParams({
    set: [
      { key: QUERY_KEY.cate_id, value: id },
      { key: QUERY_KEY.cate_name, value: name },
    ],
    remove: [QUERY_KEY.coll_id, QUERY_KEY.coll_name],
  });
  const removeFilter = filter
    ? filter.filter((item) => item.name != 'collection_id' && item.name != 'category_id')
    : [];
  const cateFilter: ProductTopBarFilter = { name: 'category_id', title: name, value: id };
  store.dispatch(
    setProductList({
      filter: [...removeFilter, cateFilter],
    }),
  );
};

export const onBrandFilterClick = (
  id: string,
  name: string = '',
  filter: ProductTopBarFilter[] | undefined,
) => {
  updateUrlParams({
    set: [
      { key: QUERY_KEY.brand_id, value: id },
      { key: QUERY_KEY.brand_name, value: name },
    ],
  });
  const removeFilter = filter ? filter.filter((item) => item.name != 'brand_id') : [];
  const brandFilter: ProductTopBarFilter = { name: 'brand_id', title: name, value: id };
  store.dispatch(
    setProductList({
      filter: [...removeFilter, brandFilter],
    }),
  );
};

export const onCollectionFilterClick = (
  id: string,
  name: string = '',
  filter: ProductTopBarFilter[] | undefined,
) => {
  updateUrlParams({
    set: [
      { key: QUERY_KEY.coll_id, value: id },
      { key: QUERY_KEY.coll_name, value: name },
    ],
    remove: [QUERY_KEY.cate_id, QUERY_KEY.cate_name, QUERY_KEY.company_id, QUERY_KEY.company_name],
  });
  const removeFilter = filter
    ? filter.filter(
        (item) =>
          item.name != 'category_id' && item.name != 'company_id' && item.name != 'collection_id',
      )
    : [];
  const collFilter: ProductTopBarFilter = { name: 'collection_id', title: name, value: id };
  store.dispatch(
    setProductList({
      filter: [...removeFilter, collFilter],
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
  onFilter?: (id: string, name?: string, filter?: ProductTopBarFilter[] | undefined) => void,
  haveViewAll?: boolean,
  filter?: ProductTopBarFilter[] | undefined,
): ItemType[] => {
  if (!items || !items.length) return [];

  let filterData: ItemType[] = items;

  const renderLogo = (logo: string | React.ReactNode) => {
    if (logo === null) {
      return <LogoIcon logo={logo} className={styles.customLogo} size={18} />;
    }
    if (typeof logo === 'object') {
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
    onClick: () => onFilter?.(el?.id || el?.key, el?.name || el?.label, filter),
  }));
};

export const formatCategoriesToDropDownData = (
  categories: CategoryNestedList[],
  level: number,
  filter: ProductTopBarFilter[] | undefined,
): ItemType[] => {
  return categories.map((el) => ({
    key: el.id,
    label: el.name || '',
    children: el.subs ? formatCategoriesToDropDownData(el.subs, level + 1, filter) : undefined,
    disabled: (el.subs || []).length === 0 && level < 3,
    onClick: el.subs?.length
      ? undefined
      : () => onCategoryFilterClick(el.id, el.name || '', filter),
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

  const queryArr = [
    [query.cate_id, query.cate_name, 'category_id'],
    [query.coll_id, query.coll_name, 'collection_id'],
    [query.brand_id, query.brand_name, 'brand_id'],
  ];
  const newFilter = queryArr.reduce((prev: any[], curr: any[]) => {
    if (curr[0])
      return [
        ...prev,
        {
          name: curr[2],
          title: curr[1],
          value: curr[0],
        },
      ];
    else return prev;
  }, []);

  store.dispatch(
    setProductList({
      filter: newFilter ? newFilter : undefined,
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
  const filter = useAppSelector((state) => state.product.list.filter || []);
  const sort = useAppSelector((state) => state.product.list.sort);
  const search = useAppSelector((state) => state.product.list.search);
  const brandSummary = useAppSelector((state) => state.product.list.brandSummary);
  const productBrand = useAppSelector((state) => state.product.brand);
  const productSummary = useAppSelector((state) => state.product.summary);
  const pagination = useAppSelector((state) => state.product.list.pagination);

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
          setCategories(formatCategoriesToDropDownData(data.data, 1, filter));
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
  }, []);

  const resetProductListSorter = () => {
    removeUrlParams([QUERY_KEY.sort_order, QUERY_KEY.sort_name]);
    dispatch(setProductList({ sort: undefined }));
  };

  const resetFilter = (filterType: string) => {
    let newFilter: ProductTopBarFilter[] | undefined = [];
    if (location.pathname === PATH.productConfiguration) {
      switch (filterType) {
        case 'category_id':
          updateUrlParams({
            set: [
              { key: QUERY_KEY.cate_id, value: 'all' },
              { key: QUERY_KEY.cate_name, value: 'VIEW ALL' },
            ],
          });
          newFilter = filter?.map((item) => {
            return item.name !== 'category_id'
              ? item
              : { ...item, title: 'VIEW ALL', value: 'all' };
          });
          break;
        case 'collection_id':
          updateUrlParams({
            set: [
              { key: QUERY_KEY.coll_id, value: 'all' },
              { key: QUERY_KEY.coll_name, value: 'VIEW ALL' },
            ],
          });
          newFilter = filter?.map((item) => {
            return item.name !== 'collection_id'
              ? item
              : { ...item, title: 'VIEW ALL', value: 'all' };
          });
          break;
      }
    } else {
      switch (filterType) {
        case 'category_id':
          removeUrlParams([QUERY_KEY.cate_id, QUERY_KEY.cate_name]);
          newFilter = filter?.filter((item) => item.name !== 'category_id');
          break;
        case 'brand_id':
          removeUrlParams([QUERY_KEY.brand_id, QUERY_KEY.brand_name]);
          newFilter = filter?.filter((item) => item.name !== 'brand_id');
          break;
        case 'company_id':
          removeUrlParams([QUERY_KEY.company_id, QUERY_KEY.company_name]);
          newFilter = filter?.filter((item) => item.name !== 'company_id');
          break;
        case 'collection_id':
          removeUrlParams([QUERY_KEY.coll_id, QUERY_KEY.coll_name]);
          newFilter = filter?.filter((item) => item.name !== 'collection_id');
          break;
      }
    }

    dispatch(setProductList({ filter: newFilter, brandSummary: undefined }));
  };

  const renderItemTopBar = (
    filterType: ProductFilterType,
    filterValue?: ProductTopBarFilter[],
    defaultLabel?: string,
  ) => {
    if (filter && filter.find((item) => item.name === filterType)) {
      const selectedFilter = filter.find((item) => item.name === filterType);
      return (
        <FilterItem
          title={selectedFilter?.title || ''}
          onRemove={resetFilter}
          name={selectedFilter?.name}
        />
      );
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
    customDropDownProps?: Partial<CustomDropDownProps>,
  ) => {
    if (!filterData || !filterData?.length) {
      return labelDefault || type;
    }

    const onItemClick =
      type === 'Categories'
        ? onCategoryFilterClick
        : type === 'Collections'
        ? onCollectionFilterClick
        : type === 'Brands'
        ? onBrandFilterClick
        : onCompanyFilterClick;

    const items = setFormatFilterForDropDown(filterData, onItemClick, haveViewAll, filter);

    return (
      <CustomDropDown
        items={items}
        viewAllTop={haveViewAll}
        textCapitalize={true}
        placement={position ?? 'bottomLeft'}
        menuStyle={{ height: 'max-content', width: 240 }}
        {...customDropDownProps}
      >
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
    pagination,
    renderItemTopBar,
    renderFilterDropdown,
    resetProductListSorter,
    resetAllProductList,
    resetFilter,
    dispatch,
  };
};
