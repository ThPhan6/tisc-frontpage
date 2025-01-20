import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PATH } from '@/constants/path';
import { useHistory, useLocation } from 'umi';

import { pushTo } from '@/helper/history';
import { useQuery } from '@/helper/hook';
import { handleGetCommonPartnerTypeList } from '@/helper/utils';
import { getCommonPartnerTypes } from '@/services';
import { isEmpty } from 'lodash';

import { TabItem } from '@/components/Tabs/types';
import { useAppSelector } from '@/reducers';
import { setAssociation } from '@/reducers/partner';
import { PartnerContactStatus } from '@/types';

import { CompanyTable } from './components/CompanyTable';
import { ContactTable } from './components/PartnerTable';
import CollapsiblePanel, { CollapsiblePanelItem } from '@/components/CollapsiblePanel';
import { MemorizeTableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import styles from '@/pages/Brand/Adminstration/Partners/styles/Partners.less';

export enum PartnerTabKey {
  companyPartners = 'company',
  contactPartners = 'contact',
}

export interface CommonPartnerType {
  affiliation: {
    id: string;
    name: string;
  }[];
  relation: {
    id: string;
    name: string;
  }[];
  acquisition: {
    id: string;
    name: string;
  }[];
}

export type FilterKeys = 'affiliation_id' | 'relation_id' | 'acquisition_id' | 'status';

export const PartnerTableContext = createContext<{
  filters?: Partial<Record<FilterKeys, string | number>>;
}>({});

const PartnersTable = () => {
  const { pathname } = useLocation();
  const isActiveTab = pathname === PATH.brandPartners;

  const history = useHistory();
  const dispatch = useDispatch();

  const query = useQuery();
  const queryTab = query.get('tab');

  const [selectedTab, setSelectedTab] = useState<PartnerTabKey>(
    !isEmpty(queryTab) ? (queryTab as PartnerTabKey) : PartnerTabKey.companyPartners,
  );
  const isTabCompany = selectedTab === PartnerTabKey.companyPartners;

  const [filters, setFilters] = useState<
    Partial<Record<FilterKeys, string | number>> | undefined
  >();

  const association = useAppSelector((state) => state.partner.association);

  const tableRef = useRef<any>();

  const listTab: TabItem[] = useMemo(
    () => [
      {
        tab: 'Companies',
        tabletTabTitle: 'Companies',
        key: PartnerTabKey.companyPartners,
        disable: !isActiveTab,
      },

      {
        tab: 'Contacts',
        tabletTabTitle: 'Contacts',
        key: PartnerTabKey.contactPartners,
        disable: !isActiveTab,
      },
    ],
    [isActiveTab],
  );

  const sortedCommonPartnerTypeList = async () => {
    const res = await getCommonPartnerTypes();
    const sorted = handleGetCommonPartnerTypeList(res);
    dispatch(setAssociation(sorted));
  };

  useEffect(() => {
    sortedCommonPartnerTypeList();
  }, [dispatch]);

  const handlePushTo = () => {
    const path = isTabCompany ? PATH.brandCreatePartnerCompany : PATH.brandCreatePartnerContact;
    history.push({
      pathname: path,
      state: { selectedTab },
    });
  };

  const handleChangeTab = (activeKey: string) => {
    setSelectedTab(activeKey as PartnerTabKey);
    pushTo(`${PATH.brandPartners}?tab=${activeKey}`);
  };

  const handleFilter = (key: FilterKeys, value?: string | PartnerContactStatus) => () => {
    if (filters?.[key] === value) return;

    setFilters({
      [key]: value ?? undefined,
    });

    tableRef.current?.reloadWithFilter({
      filter: { [key]: value ?? undefined },
    });
  };

  const generateStatus: CollapsiblePanelItem[] = useMemo(
    () => [
      {
        id: 1,
        title: 'Activation',
        headingDropdown: {
          label: 'VIEW ALL',
          headingOnClick: handleFilter('status'),
        },
        labels: [
          {
            id: PartnerContactStatus.Uninitiate.toString(),
            label: 'Uninitiate',
            labelAction: handleFilter('status', PartnerContactStatus.Uninitiate),
          },
          {
            id: PartnerContactStatus.Pending.toString(),
            label: 'Pending',
            labelAction: handleFilter('status', PartnerContactStatus.Pending),
          },
          {
            id: PartnerContactStatus.Activated.toString(),
            label: 'Activated',
            labelAction: handleFilter('status', PartnerContactStatus.Activated),
          },
        ],
      },
    ],
    [],
  );

  const generateAssociation = useMemo(
    () => [
      {
        id: 1,
        title: 'Affiliation',
        headingDropdown: {
          label: 'VIEW ALL',
          headingOnClick: handleFilter('affiliation_id'),
        },
        labels:
          association?.affiliation.map((item) => ({
            id: item.id,
            label: item.name,
            labelAction: handleFilter('affiliation_id', item.id),
          })) || [],
      },
      {
        id: 2,
        title: 'Relation',
        headingDropdown: {
          label: 'VIEW ALL',
          headingOnClick: handleFilter('relation_id'),
        },
        labels:
          association?.relation.map((item) => ({
            id: item.id,
            label: item.name,
            labelAction: handleFilter('relation_id', item.id),
          })) || [],
      },
      {
        id: 3,
        title: 'Acquisition',
        headingDropdown: {
          label: 'VIEW ALL',
          headingOnClick: handleFilter('acquisition_id'),
        },
        labels:
          association?.acquisition.map((item) => {
            let className = '';
            switch (item.name) {
              case 'Active':
                className = 'indigo-dark-variant';
                break;
              case 'Inactive':
                className = 'red-magenta';
                break;
              case 'Freeze':
                className = 'orange';
                break;
              default:
                className = '';
            }

            return {
              id: item.id,
              label: <span className={`${className}`}>{item.name}</span>,
              labelAction: handleFilter('acquisition_id', item.id),
            };
          }) || [],
      },
    ],
    [association],
  );

  return (
    <PartnerTableContext.Provider
      value={{
        filters,
      }}
    >
      <MemorizeTableHeader title="PARTNERS" customClass={styles.partnerHeader} />

      <div className="d-flex">
        <CustomTabs
          listTab={listTab}
          centered
          tabPosition="top"
          tabDisplay="start"
          widthItem="auto"
          className={`${styles.partnerHeaderTab} ${
            !isActiveTab ? styles.partnerHeaderTabDisabled : ''
          }`}
          onChange={handleChangeTab}
          activeKey={selectedTab}
        />

        <div className="d-flex bg-white border-bottom-black h-40">
          <CollapsiblePanel
            panels={isTabCompany ? generateAssociation : generateStatus}
            filters={filters}
            onRemoveFilter={handleFilter}
          />
          <CustomPlusButton
            onClick={handlePushTo}
            customClass="my-0 mx-16"
            disabled={!isActiveTab}
          />
        </div>
      </div>

      <CustomTabPane lazyLoad active={selectedTab === PartnerTabKey.companyPartners}>
        <CompanyTable tableRef={tableRef} />
      </CustomTabPane>

      <CustomTabPane lazyLoad active={selectedTab === PartnerTabKey.contactPartners}>
        <ContactTable tableRef={tableRef} />
      </CustomTabPane>
    </PartnerTableContext.Provider>
  );
};

export default PartnersTable;
