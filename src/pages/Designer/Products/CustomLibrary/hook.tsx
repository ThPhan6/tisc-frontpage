import { ReactNode, useEffect, useState } from 'react';

import { QUERY_KEY } from '@/constants/util';
import { DropDownProps } from 'antd/es/dropdown';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useHistory } from 'umi';

import { ReactComponent as DropDownIcon } from '@/assets/icons/drop-down-icon.svg';

import { useBoolean, useQuery } from '@/helper/hook';
import { getValueByCondition, removeUrlParams, updateUrlParams } from '@/helper/utils';
import { getCollections } from '@/services';

import { CustomResourceType } from '../../CustomResource/type';
import { ProductFilterType } from './types';
import store, { useAppSelector } from '@/reducers';
import { CollectionRelationType, GeneralData } from '@/types';

import { RobotoBodyText } from '@/components/Typography';
import {
  ProductTopBarFilter,
  setFormatFilterForDropDown,
} from '@/features/product/components/FilterAndSorter';
import {
  CustomDropDown,
  CustomDropDownProps,
  FilterItem,
} from '@/features/product/components/ProductTopBarItem';

import { getAllCustomResource } from '../../CustomResource/api';
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
            value: query.coll_id || query.company_id || '',
            title: query.coll_name || query.company_name || '',
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

export const useCustomProductFilter = (fetchs?: { company?: boolean; collection?: boolean }) => {
  useSyncQueryToState();

  const [companies, setCompanies] = useState<ItemType[]>([]);
  const [collections, setCollections] = useState<ItemType[]>([]);

  const customProductBrand = useAppSelector((state) => state.customProduct.brand);
  const filter = useAppSelector((state) => state.customProduct.filter);

  const firstLoaded = useBoolean(true);

  const query = useQuery();
  const company_id = query.get(QUERY_KEY.company_id);
  const company_name = query.get(QUERY_KEY.company_name);
  const coll_id = query.get(QUERY_KEY.coll_id);
  const coll_name = query.get(QUERY_KEY.coll_name);

  const [curFilterValue, setCurFilterValue] = useState<{
    company_id: string | null;
    company_name: string | null;
    coll_id?: string | null;
    coll_name?: string | null;
  }>({
    company_id: company_id,
    company_name: company_name,
    coll_id: coll_id,
    coll_name: coll_name,
  });

  useEffect(() => {
    if (filter && filter.name === 'company_id' && filter.value !== 'all' && filter.value) {
      setCurFilterValue({
        company_id: filter.value,
        company_name: filter.title,
      });
    }
  }, [filter && filter.name === 'company_id' && filter.value]);

  useEffect(() => {
    if (!fetchs) return;

    if (fetchs.company) {
      getAllCustomResource(CustomResourceType.Brand).then((res) =>
        setCompanies(res.map((item: GeneralData) => ({ key: item.id, label: item.name }))),
      );
    }
  }, []);

  useEffect(() => {
    if (
      fetchs?.collection &&
      ((companies.length && company_id && filter?.name === 'collection_id' && firstLoaded.value) ||
        (companies.length && filter?.name === 'company_id' && filter.value !== 'all'))
    ) {
      firstLoaded.setValue(false);

      getCollections(
        company_id && curFilterValue.company_id && filter.name !== 'company_id'
          ? curFilterValue.company_id
          : filter.value,
        CollectionRelationType.CustomLibrary,
      ).then((collectionData) => {
        const collectionFilterData = collectionData?.map((item) => ({
          key: item.id,
          label: item.name,
          relation_id: item.relation_id,
        }));
        const collectionId = collectionData.find((item) => item.id === curFilterValue.coll_id)?.id;
        const collectionName = collectionData.find(
          (item) => item.id === curFilterValue.coll_id,
        )?.name;

        setCollections(collectionFilterData);

        if (company_id && company_name && collectionId && collectionName) {
          /// update filter value
          setCurFilterValue({
            company_id: curFilterValue.company_id,
            company_name: curFilterValue.company_name,
            coll_id: collectionId,
            coll_name: collectionName,
          });

          /// update params
          updateUrlParams({
            set: [
              { key: QUERY_KEY.company_id, value: company_id },
              { key: QUERY_KEY.company_name, value: company_name },
              { key: QUERY_KEY.coll_id, value: collectionId },
              { key: QUERY_KEY.coll_name, value: collectionName },
            ],
          });
        }
      });
    }
  }, [filter?.value, companies]);

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

    if (company_id && company_name && coll_id) {
      store.dispatch(
        setCustomProductFilter({
          name: 'company_id',
          value: company_id,
          title: company_name,
        }),
      );
      return;
    }

    if (curFilterValue?.company_id && curFilterValue.company_name) {
      store.dispatch(
        setCustomProductFilter({
          name: 'company_id',
          value: curFilterValue.company_id,
          title: curFilterValue.company_name,
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
    customDropDownProps?: Partial<CustomDropDownProps>,
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
        textCapitalize={false}
        placement={position ?? 'bottomLeft'}
        menuStyle={{ height: 'max-content', width: 160 }}
        {...customDropDownProps}>
        {type}
      </CustomDropDown>
    );
  };

  const renderFilterCompanyName = (
    filterType: ProductFilterType,
    filterValue?: ProductTopBarFilter,
    defaultLabel?: string,
  ) => {
    if (
      filterValue?.value &&
      filterValue.name === 'company_id' &&
      filterValue.name === filterType
    ) {
      return <FilterItem title={filterValue.title} onDelete={resetFilter} />;
    }

    if (defaultLabel) return defaultLabel;

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
    if (filterValue?.value && filterValue.name && filterValue.name === filterType) {
      return <FilterItem title={filterValue.title || ''} onDelete={resetCollectionFilter} />;
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
    curFilterValue,
    firstLoaded,
    company_id,
    company_name,
    coll_id,
    coll_name,
    setCurFilterValue,
    renderFilterCollectionName,
    renderFilterDropdown,
    renderFilterCompanyName,
    renderDefaultCompanyLabel,
    rederDefaultCollectionLabel,
  };
};
