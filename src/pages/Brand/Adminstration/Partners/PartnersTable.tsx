import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PATH } from '@/constants/path';
import { TableColumnProps } from 'antd';
import { useLocation } from 'umi';

import { pushTo } from '@/helper/history';
import { getCommonPartnerTypes, getListPartnerCompanies } from '@/services';

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

const PartnersTable = () => {
  const [columns, setColumns] = useState<TableColumnProps<Company>[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<PartnerTabKey>(PartnerTabKey.companyPartners);
  const location = useLocation();
  const isActiveTab = location.pathname === PATH.brandPartners;
  const { association } = useAppSelector((state: RootState) => state.partner);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleGetCommonPartnerTypeList = async () => {
      const res = await getCommonPartnerTypes();
      if (res) dispatch(setAssociation(res));
    };

    handleGetCommonPartnerTypeList();
  }, []);

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
      width: '8%',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      width: '8%',
    },
    {
      title: 'Affiliation',
      dataIndex: 'affiliation_name',
      width: '8%',
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
      width: '10%',
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
      render: () => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => {},
              },
              {
                type: 'deleted',
                onClick: () => {},
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

  const handlePushTo = () => {
    pushTo(PATH.brandCreatePartners);
    setShowEntryForm(true);
  };

  const panels = (): CollapsiblePanelItem[] => {
    return [
      {
        id: 1,
        title: 'Affiliation',
        headingDropdown: 'VIEW ALL',
        labels:
          association?.affiliation.map((item) => ({
            id: item.id,
            label: item.name,
          })) || [],
      },
      {
        id: 2,
        title: 'Relation',
        headingDropdown: 'VIEW ALL',
        labels:
          association?.relation.map((item) => ({
            id: item.id,
            label: item.name,
          })) || [],
      },
      {
        id: 3,
        title: 'Acquisition',
        headingDropdown: 'VIEW ALL',
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
            !isActiveTab || showEntryForm ? styles.partnerHeaderTabDisabled : ''
          }`}
          onChange={handleChangeTab}
          activeKey={selectedTab}
        />

        <div className="d-flex bg-white border-bottom-black">
          <CollapsiblePanel panels={panels()} />
          <CustomPlusButton
            onClick={handlePushTo}
            customClass="my-0 mx-16"
            disabled={!isActiveTab || showEntryForm}
          />
        </div>
      </div>

      <CustomTable columns={columns} fetchDataFunc={getListPartnerCompanies} hasPagination />
    </>
  );
};

export default PartnersTable;
