import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PATH } from '@/constants/path';
import { TableColumnProps } from 'antd';
import { useLocation } from 'umi';

import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { handleGetCommonPartnerTypeList } from '@/helper/utils';
import { deletePartner, getCommonPartnerTypes, getListPartnerCompanies } from '@/services';

import { TabItem } from '@/components/Tabs/types';
import { RootState, useAppSelector } from '@/reducers';
import { setAssociation } from '@/reducers/partner';
import { Company } from '@/types';

import CollapsiblePanel, { CollapsiblePanelItem } from '@/components/CollapsiblePanel';
import CustomTable from '@/components/Table';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { CustomTabs } from '@/components/Tabs';
import styles from '@/pages/Brand/Adminstration/Partners/styles/Partners.less';

export enum PartnerTabKey {
  companyPartners = 'company',
  contactPartners = 'contacts',
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

export type FilterType = 'affiliation' | 'relation' | 'acquisition';
export type FilterKeys = 'affiliation_id' | 'relation_id' | 'acquisition_id';

const PartnersTable = () => {
  const [columns, setColumns] = useState<TableColumnProps<Company>[]>([]);
  const [selectedTab, setSelectedTab] = useState<PartnerTabKey>(PartnerTabKey.companyPartners);
  const location = useLocation();
  const isActiveTab = location.pathname === PATH.brandPartners;
  const { association } = useAppSelector((state: RootState) => state.partner);
  const [filters, setFilters] = useState<Partial<Record<FilterKeys, string>>>({});

  const tableRef = useRef<any>();

  const dispatch = useDispatch();

  useEffect(() => {
    const sortedCommonPartnerTypeList = async () => {
      const res = await getCommonPartnerTypes();
      const sorted = handleGetCommonPartnerTypeList(res);
      dispatch(setAssociation(sorted));
    };

    sortedCommonPartnerTypeList();
  }, []);

  useEffect(() => {
    tableRef.current.reloadWithFilter();
  }, [filters]);

  const handleDeletePartner = (id: string) => () => {
    confirmDelete(async () => {
      const res = await deletePartner(id);
      if (res) tableRef.current.reload();
    });
  };

  const handlePushToUpdate = (id: string) => () =>
    pushTo(PATH.brandUpdatePartner.replace(':id', id));

  const companyColumns: TableColumnProps<Company>[] = [
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
    },
    {
      title: 'Authorised Country',
      dataIndex: 'authorized_country_name',
      width: '40%',
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
  ];

  useEffect(() => {
    if (isActiveTab) setColumns(companyColumns);
  }, [isActiveTab, selectedTab]);

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

  const handlePushTo = () => pushTo(PATH.brandCreatePartners);

  const handleFilterChange = (type: FilterType, id?: string) => () => {
    if (id === '') {
      setFilters({});
      return;
    }

    setFilters({
      [`${type}_id`]: id,
    });
  };

  const panels = (): CollapsiblePanelItem[] => {
    return [
      {
        id: 1,
        title: 'Affiliation',
        headingDropdown: {
          label: 'VIEW ALL',
          headingOnClick: handleFilterChange('affiliation', ''),
        },
        labels:
          association?.affiliation.map((item) => ({
            id: item.id,
            label: item.name,
            labelAction: handleFilterChange('affiliation', item.id),
          })) || [],
      },
      {
        id: 2,
        title: 'Relation',
        headingDropdown: {
          label: 'VIEW ALL',
          headingOnClick: handleFilterChange('affiliation', ''),
        },
        labels:
          association?.relation.map((item) => ({
            id: item.id,
            label: item.name,
            labelAction: handleFilterChange('relation', item.id),
          })) || [],
      },
      {
        id: 3,
        title: 'Acquisition',
        headingDropdown: {
          label: 'VIEW ALL',
          headingOnClick: handleFilterChange('affiliation', ''),
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
              labelAction: handleFilterChange('acquisition', item.id),
            };
          }) || [],
      },
    ];
  };

  const handleChangeTab = (activeKey: string) => {
    setSelectedTab?.(activeKey as PartnerTabKey);
    if (activeKey === PartnerTabKey.companyPartners) setColumns(companyColumns);
  };

  return (
    <>
      <TableHeader title="PARTNERS" customClass={styles.partnerHeader} />

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
            panels={panels()}
            filters={filters}
            onRemoveFilter={handleFilterChange}
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
        fetchDataFunc={getListPartnerCompanies}
        hasPagination
        ref={tableRef}
        extraParams={{ filter: filters }}
        autoLoad={false}
      />
    </>
  );
};

export default PartnersTable;
