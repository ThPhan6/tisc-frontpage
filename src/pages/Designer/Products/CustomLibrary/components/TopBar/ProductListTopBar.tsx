import React, { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { ItemType } from 'antd/es/menu/hooks/useItems';

import { ReactComponent as OpenIcon } from '@/assets/icons/open-icon.svg';
import { ReactComponent as PlusCircleIcon } from '@/assets/icons/plus-circle-icon.svg';
import { ReactComponent as VendorManagementIcon } from '@/assets/icons/vendor-management-icon.svg';

import { useCustomProductFilter } from '../../hook';
import { getCustomProductList } from '../../services';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { CustomProductFilter } from '../../types';
import store from '@/reducers';

import { Title } from '@/components/Typography';
import { TopBarContainer, TopBarItem } from '@/features/product/components';
import { ProductTopBarFilter } from '@/features/product/components/FilterAndSorter';

import { setCustomProductFilter } from '../../slice';
import styles from './index.less';

export const ProductListTopBar: React.FC = () => {
  const {
    filter,
    companies,
    collections,
    setCollections,
    curFilterValue,
    setCurFilterValue,
    firstLoaded,
    company_id,
    coll_id,
    renderFilterCollectionName,
    renderFilterDropdown,
    renderFilterCompanyName,
    renderDefaultCompanyLabel,
    rederDefaultCollectionLabel,
  } = useCustomProductFilter({
    company: true,
    collection: true,
  });

  /// using for first loading
  /// in async case
  const loaded = useBoolean(false);

  /// get collection data if company_id or coll_id param has value from url
  const [collectionData, setCollectionData] = useState<ItemType[]>(collections);

  useEffect(() => {
    if (company_id && coll_id) {
      setCollectionData(collections);
    }
  }, [company_id && coll_id, filter?.name === 'collection_id' && filter.value, collections]);

  useEffect(() => {
    if (!filter && companies.length) {
      store.dispatch(
        setCustomProductFilter({
          name: 'company_id',
          title: 'View All',
          value: 'all',
        }),
      );

      setCollections([]);
    }
  }, [filter?.value, companies]);

  useEffect(() => {
    // prevent call api twice at first loading
    loaded.setValue(true);

    if (loaded.value) {
      if (filter?.value === 'all') {
        getCustomProductList();
        return;
      }

      if (filter?.name === 'company_id' && filter.value) {
        setCurFilterValue({
          company_id: filter.value,
          company_name: filter.title,
        });

        getCustomProductList({ company_id: filter.value });
      }
    }
  }, [filter?.value, company_id]);

  useEffect(() => {
    if (company_id && coll_id && !filter) {
      return;
    }

    if (filter?.name === 'collection_id' && filter.value) {
      if (firstLoaded.value && company_id && coll_id) {
        getCustomProductList({
          company_id,
          collection_id: coll_id,
        });

        return;
      }

      const companyIds = companies.map((brand) => brand?.key);

      const newCollectionData = collectionData.length ? collectionData : collections;

      const collectionIds = newCollectionData.map((collection) => collection?.relation_id);

      const relationId = collectionIds.filter((collectionId) => companyIds?.includes(collectionId));

      const relationItemFounded = companies.find((brand) => brand?.key === relationId[0]);

      let filterBy: CustomProductFilter | undefined;

      if (relationItemFounded && relationItemFounded.key) {
        filterBy = {
          company_id: String(relationItemFounded.key),
          collection_id: filter.value,
        };

        setCurFilterValue({
          company_id: filterBy.company_id || '',
          company_name: relationItemFounded.label,
          coll_id: filter.value,
          coll_name: filter.title,
        });
      }

      getCustomProductList(filterBy);
    }
  }, [company_id && coll_id, filter?.value]);

  const getCompanyFilterValue = () => {
    if (curFilterValue.company_id && (!filter || filter.name !== 'company_id')) {
      return {
        name: 'company_id',
        value: curFilterValue.company_id,
        title: curFilterValue.company_name,
      } as ProductTopBarFilter;
    }

    return filter;
  };

  const getCollectionFilterValue = () => {
    if (
      curFilterValue.coll_id &&
      curFilterValue.company_id &&
      filter?.name === 'collection_id' &&
      filter.value
    ) {
      return {
        name: 'collection_id',
        value: curFilterValue.coll_id,
        title: curFilterValue.coll_name,
      } as ProductTopBarFilter;
    }

    if (filter && filter.value && filter.value !== 'all') return filter;

    return undefined;
  };

  return (
    <>
      <TopBarContainer
        LeftSideContent={
          <>
            <TopBarItem
              disabled
              cursor={companies.length ? 'pointer' : 'default'}
              topValue={renderFilterCompanyName('company_id', getCompanyFilterValue(), 'select')}
              customClass={`right-divider ${styles.colorDark} ${
                filter?.value === 'all' ? styles.hideDeleteIcon : ''
              }`}
              bottomEnable={companies.length ? true : false}
              bottomValue={renderFilterDropdown(
                'Companies',
                companies,
                true,
                renderDefaultCompanyLabel(),
                undefined,
                { borderFirstItem: true },
              )}
            />
            <TopBarItem
              customClass={`pl-0 ${styles.colorDark}`}
              disabled={!companies.length || !filter || !collections.length}
              cursor={!companies.length || !filter || !collections.length ? 'default' : 'pointer'}
              topValue={renderFilterCollectionName(
                'collection_id',
                getCollectionFilterValue(),
                'select',
              )}
              bottomEnable={companies.length ? true : false}
              bottomValue={renderFilterDropdown(
                'Collections',
                collections,
                false,
                rederDefaultCollectionLabel(),
              )}
            />
          </>
        }
        RightSideContent={
          <>
            <TopBarItem
              disabled={!companies.length}
              bottomValue="New Product"
              cursor={companies.length ? 'pointer' : 'default'}
              customClass="left-divider mr-0 white-space"
              onClick={() =>
                companies.length ? pushTo(PATH.designerCustomProductCreate) : undefined
              }
              icon={<PlusCircleIcon />}
            />
            <TopBarItem
              topValue={
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Title level={8} style={{ marginRight: '8px' }}>
                    OPEN
                  </Title>
                  <OpenIcon />
                </div>
              }
              customClass="left-divider mr-12 white-space"
              bottomValue="Vendor Management"
              cursor="pointer"
              onClick={() => pushTo(PATH.designerCustomResource)}
              icon={<VendorManagementIcon />}
            />
          </>
        }
      />
    </>
  );
};
