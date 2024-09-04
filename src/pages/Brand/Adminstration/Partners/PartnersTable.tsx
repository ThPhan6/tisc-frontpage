import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PATH } from '@/constants/path';
import { TableColumnProps } from 'antd';
import { useHistory, useLocation } from 'umi';

import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useQuery } from '@/helper/hook';
import { handleGetCommonPartnerTypeList } from '@/helper/utils';
import {
  deletePartner,
  deletePartnerContact,
  getCommonPartnerTypes,
  getListPartnerCompanies,
  getListPartnerContacts,
} from '@/services';
import { isEmpty } from 'lodash';

import { TabItem } from '@/components/Tabs/types';
import { RootState, useAppSelector } from '@/reducers';
import { setAssociation } from '@/reducers/partner';
import { Company, Contact, PartnerContactStatus } from '@/types';

import CollapsiblePanel, { CollapsiblePanelItem } from '@/components/CollapsiblePanel';
import CustomTable from '@/components/Table';
import { MemorizeTableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { CustomTabs } from '@/components/Tabs';
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

const PartnersTable = () => {
  const query = useQuery();
  const queryTab = query.get('tab');
  const history = useHistory();
  const location = useLocation();
  const { association } = useAppSelector((state: RootState) => state.partner);
  const [filters, setFilters] = useState<Partial<Record<FilterKeys, string | number>>>({});

  const [columns, setColumns] = useState<TableColumnProps<Company | Contact>[]>([]);
  const [selectedTab, setSelectedTab] = useState<PartnerTabKey>(
    !isEmpty(queryTab) ? (queryTab as PartnerTabKey) : PartnerTabKey.companyPartners,
  );

  const isActiveTab = location.pathname === PATH.brandPartners;
  const isTabCompany = selectedTab === PartnerTabKey.companyPartners ? true : false;

  const tableRef = useRef<any>();
  const initialLoad = useRef(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const sortedCommonPartnerTypeList = async () => {
      const res = await getCommonPartnerTypes();
      const sorted = handleGetCommonPartnerTypeList(res);
      dispatch(setAssociation(sorted));
    };

    sortedCommonPartnerTypeList();
  }, [dispatch]);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    tableRef.current.reload();
  }, [selectedTab]);

  useEffect(() => {
    tableRef.current.reloadWithFilter();
  }, [filters]);

  const handleDeletePartner = (id: string) => () => {
    confirmDelete(async () => {
      const res = isTabCompany ? await deletePartner(id) : await deletePartnerContact(id);
      if (res) tableRef.current.reload();
    });
  };

  const handlePushToUpdate = (id: string) => () => {
    const path = isTabCompany
      ? PATH.brandUpdatePartner.replace(':id', id)
      : PATH.brandUpdatePartnerContact.replace(':id', id);

    history.push({
      pathname: path,
    });
  };

  const companyColumns: TableColumnProps<Company>[] = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        width: '5%',
      },
      {
        title: 'Country',
        dataIndex: 'country_name',
        sorter: true,
        width: '5%',
      },
      {
        title: 'City',
        dataIndex: 'city_name',
        sorter: true,
        width: '5%',
      },
      {
        title: 'Contact',
        dataIndex: 'contact',
        width: '5%',
      },
      {
        title: 'Affiliation',
        dataIndex: 'affiliation_name',
        width: '5%',
      },
      {
        title: 'Relation',
        dataIndex: 'relation_name',
        width: '5%',
      },
      {
        title: 'Acquisition',
        dataIndex: 'acquisition_name',
        width: '5%',
        render: (_, record) => {
          switch (record.acquisition_name) {
            case 'Active':
              return <span className="indigo-dark-variant">Active</span>;
            case 'Inactive':
              return <span className="red-magenta">Inactive</span>;
            case 'Freeze':
              return <span className="orange">Freeze</span>;
            default:
              return '';
          }
        },
      },
      {
        title: 'Price Rate',
        dataIndex: 'price_rate',
        width: '5%',
        render: (_, record) => parseFloat(record.price_rate?.toString()).toFixed(2),
      },
      {
        title: 'Authorised Country',
        dataIndex: 'authorized_country_name',
        width: '45%',
      },
      {
        title: 'Beyond',
        dataIndex: 'coverage_beyond',
        align: 'center',
        width: '5%',
        render: (_, record) => (record.coverage_beyond ? 'Allow' : 'Not Allow'),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        align: 'center',
        width: '5%',
        render: (_, record) => {
          return (
            <ActionMenu
              actionItems={[
                {
                  type: 'updated',
                  onClick: handlePushToUpdate(record.id),
                },
                {
                  type: 'deleted',
                  onClick: handleDeletePartner(record.id),
                },
              ]}
            />
          );
        },
      },
    ],
    [handleDeletePartner, handlePushToUpdate],
  );

  const contactColumns: TableColumnProps<Contact>[] = useMemo(
    () => [
      {
        title: 'Full Name',
        dataIndex: 'fullname',
        sorter: true,
        width: '10%',
      },
      {
        title: 'Company',
        dataIndex: 'company_name',
        sorter: true,
        width: '10%',
      },
      {
        title: 'Country',
        dataIndex: 'country_name',
        sorter: true,
        width: '10%',
      },
      {
        title: 'Title/Position',
        dataIndex: 'position',
        width: '10%',
      },
      {
        title: 'Work Email',
        dataIndex: 'email',
        width: '10%',
      },
      {
        title: 'Work Phone',
        dataIndex: 'phone',
        width: '10%',
      },
      {
        title: 'Work Mobile',
        dataIndex: 'mobile',
        width: '5%',
      },
      {
        title: 'Activation',
        dataIndex: 'status',
        align: 'center',
        width: '15%',
        render: (_, record) => {
          switch (record.status) {
            case PartnerContactStatus.Uninitiate:
              return 'Uninitiate';
            case PartnerContactStatus.Pending:
              return 'Pending';
            case PartnerContactStatus.Activated:
              return 'Activated';
            default:
              return '';
          }
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        align: 'center',
        width: '5%',
        render: (_, record) => {
          return (
            <ActionMenu
              actionItems={[
                {
                  type: 'updated',
                  onClick: handlePushToUpdate(record.id),
                },
                {
                  type: 'deleted',
                  onClick: handleDeletePartner(record.id),
                },
              ]}
            />
          );
        },
      },
    ],
    [handleDeletePartner, handlePushToUpdate],
  );

  useEffect(() => {
    if (isTabCompany) {
      setColumns(companyColumns as TableColumnProps<Company | Contact>[]);
      return;
    }

    setColumns(contactColumns as TableColumnProps<Company | Contact>[]);
  }, [selectedTab]);

  const listTab: TabItem[] = [
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
  ];

  const handlePushTo = () => {
    const path = isTabCompany ? PATH.brandCreatePartnerCompany : PATH.brandCreatePartnerContact;
    history.push({
      pathname: path,
      state: { selectedTab },
    });
  };

  const handleFilter = (key: FilterKeys, value?: string | PartnerContactStatus) => () => {
    if (filters[key] === value) return;

    if (value === null && value === undefined) {
      setFilters({});
      return;
    }

    setFilters({
      [key]: value,
    });
  };

  const generateAssociation = (): CollapsiblePanelItem[] => {
    return [
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
    ];
  };

  const generateStatus: CollapsiblePanelItem[] = [
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
  ];

  const handleChangeTab = (activeKey: string) => {
    setSelectedTab(activeKey as PartnerTabKey);
    pushTo(`${PATH.brandPartners}?tab=${activeKey}`);
  };

  return (
    <>
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
            panels={isTabCompany ? generateAssociation() : generateStatus}
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

      <CustomTable
        columns={columns}
        fetchDataFunc={isTabCompany ? getListPartnerCompanies : getListPartnerContacts}
        hasPagination
        ref={tableRef}
        extraParams={{ filter: filters }}
        autoLoad={false}
      />
    </>
  );
};

export default PartnersTable;
