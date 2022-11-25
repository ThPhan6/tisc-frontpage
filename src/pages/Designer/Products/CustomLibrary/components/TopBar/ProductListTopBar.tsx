import React, { useEffect } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as DropDownIcon } from '@/assets/icons/drop-down-icon.svg';
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

import { RobotoBodyText, Title } from '@/components/Typography';
import { FilterItem, TopBarContainer, TopBarItem } from '@/features/product/components';

import { setCustomProductFilter } from '../../slice';
import styles from './index.less';

export const ProductListTopBar: React.FC = () => {
  const loaded = useBoolean(false);
  const {
    filter,
    companies,
    collections,
    setCollections,
    resetFilter,
    renderItemTopBar,
    renderFilterDropdown,
  } = useCustomProductFilter({
    company: true,
    collection: true,
  });

  useEffect(() => {
    if (!filter) {
      // updateUrlParams({
      //   set: [
      //     { key: QUERY_KEY.company_id, value: 'all' },
      //     { key: QUERY_KEY.company_name, value: 'View All' },
      //   ],
      // });
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
      const filterBy =
        !filter || filter?.value === 'all'
          ? undefined
          : {
              company_id: filter.name === 'company_id' ? filter?.value : undefined,
              collection_id:
                companies.length && filter.name === 'collection_id' ? filter.value : undefined,
            };

      getCustomProductList(filterBy);

      if (companies.length && filter?.value !== 'all' && filter?.name === 'company_id') {
        getCollections(filter.value, CollectionRelationType.CustomLibrary).then(
          (collectionData) => {
            const collectionFilterData = collectionData?.map((item) => item);
            // ({
            //   key: item.id,
            //   label: item.name,
            //   relation_id: item.relation_id,
            // }));
            setCollections(collectionFilterData);
          },
        );
      }
    }
  }, [filter?.value, companies]);

  const renderFilterCompanyName = () => {
    if (!filter) return 'select';

    if (filter.name === 'company_id' && filter.value) {
      return <FilterItem title={filter.title} onDelete={resetFilter} />;
    }

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
              customClass={`right-divider ${filter?.value === 'all' ? styles.hideDeleteIcon : ''}`}
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
              topValue={renderItemTopBar('collection_id', filter, 'select')}
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
