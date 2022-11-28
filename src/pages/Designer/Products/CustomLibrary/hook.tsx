import { ReactNode, useEffect, useState } from 'react';

import { QUERY_KEY } from '@/constants/util';
import { DropDownProps } from 'antd/es/dropdown';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useHistory } from 'umi';

import { getAllCustomResource } from './services';
import { useQuery } from '@/helper/hook';
import { getValueByCondition, removeUrlParams, updateUrlParams } from '@/helper/utils';

import { CustomResourceType, ProductFilterType } from './types';
import store, { useAppSelector } from '@/reducers';
import { GeneralData } from '@/types';

import {
  ProductTopBarFilter,
  setFormatFilterForDropDown,
} from '@/features/product/components/FilterAndSorter';
import { CustomDropDown, FilterItem } from '@/features/product/components/ProductTopBarItem';

import { setCustomProductFilter } from './slice';

export const onCollectionFilterClick = (id: string, name: string = '') => {
  updateUrlParams({
    set: [
      { key: QUERY_KEY.coll_id, value: id },
      { key: QUERY_KEY.coll_name, value: name },
    ],
    remove: [QUERY_KEY.company_id, QUERY_KEY.company_name],
  });
  store.dispatch(
    setCustomProductFilter({
      name: 'collection_id',
      value: id,
      title: name,
    }),
  );
};

export const onCompanyFilterClick = (id: string, name: string = '') => {
  updateUrlParams({
    set: [
      { key: QUERY_KEY.company_id, value: id },
      { key: QUERY_KEY.company_name, value: name },
    ],
    remove: [QUERY_KEY.coll_id, QUERY_KEY.coll_name],
  });
  store.dispatch(
    setCustomProductFilter({
      name: 'company_id',
      title: name,
      value: id,
    }),
  );
};

const updateQueryToState = (query: {
  coll_id?: string | null;
  coll_name?: string | null;
  company_id?: string | null;
  company_name?: string | null;
}) => {
  if (!query) return;

  const name = getValueByCondition([
    [query.coll_id, 'collection_id'],
    [query.company_id, 'company_id'],
  ]);

  store.dispatch(
    setCustomProductFilter(
      name
        ? {
            name,
            value: query.company_id || query.coll_id || '',
            title: query.company_name || query.coll_name || '',
          }
        : undefined,
    ),
  );
};

const useSyncQueryToState = () => {
  const query = useQuery();
  const history = useHistory();

  useEffect(() => {
    const coll_id = query.get(QUERY_KEY.coll_id);
    const coll_name = query.get(QUERY_KEY.coll_name);

    const company_id = query.get(QUERY_KEY.company_id);
    const company_name = query.get(QUERY_KEY.company_name);

    updateQueryToState({
      coll_id,
      coll_name,
      company_id,
      company_name,
    });

    history.listen((location) => {
      if (!location.query) return;

      updateQueryToState({ ...location.query });
    });
  }, []);
};

export const useCustomProductFilter = (fetchs: {
  noFetchData?: boolean;
  company?: boolean;
  collection?: boolean;
}) => {
  useSyncQueryToState();

  const [companies, setCompanies] = useState<ItemType[]>([]);
  const [collections, setCollections] = useState<ItemType[]>([]);

  const customProductBrand = useAppSelector((state) => state.customProduct.brand);
  const filter = useAppSelector((state) => state.customProduct.filter);

  useEffect(() => {
    if (fetchs.noFetchData) return;

    if (fetchs.company) {
      getAllCustomResource(CustomResourceType.Brand).then((res) =>
        setCompanies(res.map((item: GeneralData) => ({ key: item.id, label: item.name }))),
      );
    }

    // if (fetchs.collection && customProduct.company.id) {
    //   getCollections(customProduct.company.id, CollectionRelationType.CustomLibrary).then((res) =>
    //     setCollections(res.map((item: GeneralData) => ({ key: item.id, label: item.name }))),
    //   );
    // }
  }, []);

  const resetFilter = () => {
    removeUrlParams([
      QUERY_KEY.coll_id,
      QUERY_KEY.coll_name,
      QUERY_KEY.company_id,
      QUERY_KEY.company_name,
    ]);
    store.dispatch(setCustomProductFilter(undefined));
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
    type: 'Collections' | 'Companies',
    filterData: ItemType[],
    haveViewAll?: boolean,
    labelDefault?: string | ReactNode,
    position?: DropDownProps['placement'],
  ) => {
    if (!filterData || !filterData?.length) {
      return labelDefault || type;
    }

    const renderDropDowmItem = () => {
      if (type === 'Collections') {
        return setFormatFilterForDropDown(filterData, onCollectionFilterClick, haveViewAll);
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
        menuStyle={{ height: 'max-content', width: 160 }}>
        {type}
      </CustomDropDown>
    );
  };

  return {
    companies,
    collections,
    setCollections,
    customProductBrand,
    filter,
    resetFilter,
    renderItemTopBar,
    renderFilterDropdown,
  };
};
