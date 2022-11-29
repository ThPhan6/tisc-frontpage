import React, { useEffect } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as OpenIcon } from '@/assets/icons/open-icon.svg';
import { ReactComponent as PlusCircleIcon } from '@/assets/icons/plus-circle-icon.svg';
import { ReactComponent as VendorManagementIcon } from '@/assets/icons/vendor-management-icon.svg';

import { useCustomProductFilter } from '../../hook';
import { getCustomProductList } from '../../services';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getCollections } from '@/services';

import store from '@/reducers';
import { CollectionRelationType } from '@/types';

import { Title } from '@/components/Typography';
import { TopBarContainer, TopBarItem } from '@/features/product/components';

import { setCustomProductFilter } from '../../slice';
import styles from './index.less';

export const ProductListTopBar: React.FC = () => {
  const loaded = useBoolean(false);
  const {
    filter,
    companies,
    collections,
    setCollections,
    renderFilterCollectionName,
    renderFilterDropdown,
    renderFilterCompanyName,
    renderDefaultCompanyLabel,
    rederDefaultCollectionLabel,
  } = useCustomProductFilter({
    company: true,
  });

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
      return;
    }

    // prevent call api twice at first loading
    loaded.setValue(true);

    if (loaded.value) {
      let filterBy =
        !filter || filter?.value === 'all'
          ? undefined
          : {
              company_id: filter.name === 'company_id' ? filter?.value : undefined,
              collection_id:
                companies.length && filter.name === 'collection_id' ? filter.value : undefined,
            };

      if (filter?.name === 'collection_id' && filter.value) {
        const companyIds = companies.map((brand) => brand?.key);
        const collectionIds = collections.map((collection) => collection?.relation_id);

        const relationId = collectionIds.filter((collectionId) =>
          companyIds?.includes(collectionId),
        );

        const relationItemFounded = companies.find((brand) => brand?.key === relationId[0]);

        if (relationItemFounded && relationItemFounded?.key !== undefined) {
          filterBy = {
            company_id: String(relationItemFounded.key),
            collection_id: filter.value,
          };
        }
      }

      getCustomProductList(filterBy);

      if (companies.length && filter?.value !== 'all' && filter?.name === 'company_id') {
        getCollections(filter.value, CollectionRelationType.CustomLibrary).then(
          (collectionData) => {
            const collectionFilterData = collectionData?.map((item) => ({
              key: item.id,
              label: item.name,
              relation_id: item.relation_id,
            }));
            setCollections(collectionFilterData);
          },
        );
      }
    }
  }, [filter?.value, companies]);

  if (!loaded.value) return null;

  return (
    <>
      <TopBarContainer
        LeftSideContent={
          <>
            <TopBarItem
              disabled
              cursor={companies.length ? 'pointer' : 'default'}
              topValue={renderFilterCompanyName()}
              customClass={`right-divider ${styles.colorDark} ${
                filter?.value === 'all' ? styles.hideDeleteIcon : ''
              }`}
              bottomEnable={companies.length ? true : false}
              bottomValue={renderFilterDropdown(
                'Companies',
                companies,
                true,
                renderDefaultCompanyLabel(),
              )}
            />
            <TopBarItem
              customClass={`pl-0 ${styles.colorDark}`}
              disabled={!companies.length || !filter || !collections.length}
              cursor={!companies.length || !filter || !collections.length ? 'default' : 'pointer'}
              topValue={renderFilterCollectionName('collection_id', filter, 'select')}
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
              customClass="left-divider mr-0"
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
              customClass="left-divider mr-12"
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
