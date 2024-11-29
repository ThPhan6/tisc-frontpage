import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PATH } from '@/constants/path';
import { TableColumnProps } from 'antd';
import { useHistory, useLocation } from 'umi';

import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useQuery } from '@/helper/hook';
import { getFullName, handleGetCommonPartnerTypeList } from '@/helper/utils';
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
import TeamIcon from '@/components/TeamIcon/TeamIcon';
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
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { association, companiesPage, contactsPage } = useAppSelector(
    (state: RootState) => state.partner,
  );

  const [firstLoad, setFirstLoad] = useState(true);
  const [pagination, setPagination] = useState<{ [key: string]: any }>({});
  const [filters, setFilters] = useState<Partial<Record<FilterKeys, string | number>>>({});
  const [columns, setColumns] = useState<TableColumnProps<Company | Contact>[]>([]);
  const [selectedTab, setSelectedTab] = useState<PartnerTabKey>(
    !isEmpty(queryTab) ? (queryTab as PartnerTabKey) : PartnerTabKey.companyPartners,
  );

  const isActiveTab = pathname === PATH.brandPartners;
  const isTabCompany = selectedTab === PartnerTabKey.companyPartners ? true : false;

  const tableRef = useRef<any>();

  useEffect(() => {
    setPagination(isTabCompany ? { page: companiesPage } : { page: contactsPage });
  }, []);

  useEffect(() => {
    if (firstLoad) {
      const timer = setTimeout(() => {
        setFirstLoad(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setPagination({});
    }
  }, [firstLoad]);

  useEffect(() => {
    const sortedCommonPartnerTypeList = async () => {
      const res = await getCommonPartnerTypes();
      const sorted = handleGetCommonPartnerTypeList(res);
      dispatch(setAssociation(sorted));
    };

    sortedCommonPartnerTypeList();
  }, [dispatch]);

  useEffect(() => {
    if (firstLoad) tableRef.current.reloadWithPage(isTabCompany ? companiesPage : contactsPage);
    else tableRef.current.reloadWithFilter();
  }, [filters, selectedTab]);

  const handleDeletePartner = (id: string) => () => {
    confirmDelete(async () => {
      const res = isTabCompany ? await deletePartner(id) : await deletePartnerContact(id);
      if (res) tableRef.current.reload();
    });
  };

  const handlePushToUpdate = (id: string) => () =>
    pushTo(
      isTabCompany
        ? PATH.brandUpdatePartner.replace(':id', id)
        : PATH.brandUpdatePartnerContact.replace(':id', id),
    );

  const companyColumns: TableColumnProps<Company>[] = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        width: '5%',
        render: (_, record) => <span className="text-capitalize ">{record.name}</span>,
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
        render: (_, record) => <span className="text-capitalize ">{record.affiliation_name}</span>,
      },
      {
        title: 'Relation',
        dataIndex: 'relation_name',
        width: '5%',
        render: (_, record) => <span className="text-capitalize ">{record.relation_name}</span>,
      },
      {
        title: 'Acquisition',
        dataIndex: 'acquisition_name',
        width: '5%',
        render: (_, record) => {
          switch (record.acquisition_name) {
            case 'Active':
              return <span className="indigo-dark-variant text-capitalize">Active</span>;
            case 'Inactive':
              return <span className="red-magenta text-capitalize">Inactive</span>;
            case 'Freeze':
              return <span className="orange text-capitalize">Freeze</span>;
            default:
              return <span className="text-capitalize">{record.acquisition_name}</span>;
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
        title: '',
        dataIndex: 'avatar',
        width: '2%',
        render: (_, record) => {
          return <TeamIcon avatar={record.avatar} name={getFullName(record)} size={20} />;
        },
      },
      {
        title: 'Full Name',
        dataIndex: 'fullname',
        sorter: true,
        width: '5%',
        render: (_, record) => <span className="text-capitalize ">{record.fullname}</span>,
      },
      {
        title: 'Company',
        dataIndex: 'company_name',
        sorter: true,
        width: '5%',
        render: (_, record) => <span className="text-capitalize ">{record.company_name}</span>,
      },
      {
        title: 'Country',
        dataIndex: 'country_name',
        sorter: true,
        width: '5%',
      },
      {
        title: 'Title/Position',
        dataIndex: 'position',
        width: '5%',
        render: (_, record) => <span className="text-capitalize ">{record.position}</span>,
      },
      {
        title: 'Work Email',
        dataIndex: 'email',
        width: '5%',
      },
      {
        title: 'Work Phone',
        dataIndex: 'phone',
        width: '5%',
      },
      {
        title: 'Work Mobile',
        dataIndex: 'mobile',
        width: '58%',
      },
      {
        title: 'Activation',
        dataIndex: 'status',
        width: '5%',
        render: (_, record) => {
          switch (record.status) {
            case PartnerContactStatus.Uninitiate:
              return <span className="text-capitalize">Uninitiate</span>;
            case PartnerContactStatus.Pending:
              return <span className="text-capitalize">Pending</span>;
            case PartnerContactStatus.Activated:
              return <span className="text-capitalize">Activated</span>;
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
    const selectedColumns = isTabCompany ? companyColumns : contactColumns;
    setColumns(selectedColumns as TableColumnProps<Company | Contact>[]);
  }, [selectedTab, isTabCompany]);

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
        extraParams={{ filter: filters, pageSize: 15, ...pagination }}
        autoLoad={false}
      />
    </>
  );
};

export default PartnersTable;
