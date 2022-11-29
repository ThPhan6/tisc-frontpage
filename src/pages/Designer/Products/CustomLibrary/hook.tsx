import { ReactNode, useEffect, useState } from 'react';

import { QUERY_KEY } from '@/constants/util';
import { DropDownProps } from 'antd/es/dropdown';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useHistory } from 'umi';

import { ReactComponent as DropDownIcon } from '@/assets/icons/drop-down-icon.svg';

import { getAllCustomResource } from './services';
import { useQuery } from '@/helper/hook';
import { getValueByCondition, removeUrlParams, updateUrlParams } from '@/helper/utils';

import { CustomResourceType, ProductFilterType } from './types';
import store, { useAppSelector } from '@/reducers';
import { GeneralData } from '@/types';

import { RobotoBodyText } from '@/components/Typography';
import {
  ProductTopBarFilter,
  setFormatFilterForDropDown,
} from '@/features/product/components/FilterAndSorter';
import { CustomDropDown, FilterItem } from '@/features/product/components/ProductTopBarItem';

import { setCustomProductFilter } from './slice';

export const onCollectionFilterClick = (
  id: string,
  name: string = '',
  companies: ItemType[],
  collections: ItemType[],
) => {
  const companyIds = companies.map((brand) => brand?.key);
  const collectionIds = collections.map((collection) => collection?.relation_id);

  const relationId = collectionIds.filter((collectionId) => companyIds?.includes(collectionId));

  const relationItemFounded = companies.find((brand) => brand?.key === relationId[0]);

  updateUrlParams({
    set: [
      { key: QUERY_KEY.company_id, value: String(relationItemFounded?.key) },
      { key: QUERY_KEY.company_name, value: relationItemFounded?.label },
      { key: QUERY_KEY.coll_id, value: id },
      { key: QUERY_KEY.coll_name, value: name },
    ],
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

export const useCustomProductFilter = (fetchs: { noFetchData?: boolean; company?: boolean }) => {
  useSyncQueryToState();

  const [companies, setCompanies] = useState<ItemType[]>([]);
  const [collections, setCollections] = useState<ItemType[]>([]);

  const [companyFilterValue, setCompanyFilterValue] = useState<ProductTopBarFilter>();

  const customProductBrand = useAppSelector((state) => state.customProduct.brand);
  const filter = useAppSelector((state) => state.customProduct.filter);

  useEffect(() => {
    if (filter && filter.name === 'company_id' && filter.value !== 'all' && filter.value) {
      setCompanyFilterValue(filter);
    }
  }, [filter && filter.name === 'company_id' && filter.value]);

  useEffect(() => {
    if (fetchs.noFetchData) return;

    if (fetchs.company) {
      getAllCustomResource(CustomResourceType.Brand).then((res) =>
        setCompanies(res.map((item: GeneralData) => ({ key: item.id, label: item.name }))),
      );
    }
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

  const resetCollectionFilter = () => {
    removeUrlParams([QUERY_KEY.coll_id, QUERY_KEY.coll_name]);

    if (companyFilterValue?.value) {
      store.dispatch(
        setCustomProductFilter({
          name: companyFilterValue.name || 'company_id',
          value: companyFilterValue.value,
          title: companyFilterValue.title,
        }),
      );
    }
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
        return setFormatFilterForDropDown(
          filterData,
          (id, name) => onCollectionFilterClick(id, name, companies, collections),
          haveViewAll,
        );
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

  const renderFilterCompanyName = () => {
    if (!filter) return 'select';

    if (filter?.name === 'company_id' && filter.value) {
      return <FilterItem title={filter.title} onDelete={resetFilter} />;
    }

    /// find company filter value when select collection filter by relation_id
    const companyIds = companies.map((brand) => brand?.key);
    const collectionIds = collections.map((collection) => collection?.relation_id);

    const relationId = collectionIds.filter((collectionId) => companyIds?.includes(collectionId));

    if (!relationId.length) return 'select';

    const relationItemFounded = companies.find((brand) => brand?.key === relationId[0]);

    return <FilterItem title={relationItemFounded?.label} onDelete={resetFilter} />;
  };

  const renderDefaultCompanyLabel = () => (
    <div className="flex-start">
      <RobotoBodyText level={6} color={companies.length ? 'mono-color' : 'mono-color-medium'}>
        Companies
      </RobotoBodyText>
      <DropDownIcon className={companies.length ? 'mono-color' : 'mono-color-medium'} />
    </div>
  );

  const renderFilterCollectionName = (
    filterType: ProductFilterType,
    filterValue?: ProductTopBarFilter,
    defaultLabel?: string,
  ) => {
    if (filterValue?.name && filterValue?.name === filterType && filterValue?.value) {
      return <FilterItem title={filter?.title || ''} onDelete={resetCollectionFilter} />;
    }

    if (defaultLabel) return defaultLabel;

    return undefined;
  };

  const rederDefaultCollectionLabel = () => {
    const color =
      !companies.length || !filter || !collections.length ? 'mono-color-medium' : 'mono-color';

    return (
      <div className="flex-start">
        <RobotoBodyText level={6} color={color}>
          Collections
        </RobotoBodyText>
        <DropDownIcon className={color} />
      </div>
    );
  };

  return {
    companies,
    customProductBrand,
    filter,
    collections,
    setCollections,
    renderFilterCollectionName,
    renderFilterDropdown,
    renderFilterCompanyName,
    renderDefaultCompanyLabel,
    rederDefaultCollectionLabel,
  };
};
