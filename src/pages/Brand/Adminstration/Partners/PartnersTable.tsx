import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { TableColumnProps } from 'antd';
import { useLocation } from 'umi';

import { TabItem } from '@/components/Tabs/types';
import { Company, CompanyForm } from '@/types';

import CollapsiblePanel from '@/components/CollapsiblePanel';
import CustomTable from '@/components/Table';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { CustomTabs } from '@/components/Tabs';
import CompanyEntryForm from '@/pages/Brand/Adminstration/Partners/CompanyEntryForm';
import styles from '@/pages/Brand/Adminstration/Partners/styles/Partners.less';

import { getLocationPagination } from '@/features/locations/api';

export enum PartnerTabKey {
  companyPartners = 'company',
  contactPartners = 'contacts',
}

const initialCompanyForm: CompanyForm = {
  name: '',
  website: '',
  country: '',
  province: '',
  city: '',
  address: '',
  postal_code: '',
  phone: '',
  email: '',
  affiliation: '',
  relation: '',
  acquisition: '',
  price_rate: 1.0,
  authorised_country: '',
  beyond: '0',
  remark: '',
};

const PartnersTable = () => {
  const [data, setData] = useState<CompanyForm>(initialCompanyForm);
  const [columns, setColumns] = useState<TableColumnProps<Company>[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryFormType, setEntryFormType] = useState<PartnerTabKey | null>(null);
  const [selectedTab, setSelectedTab] = useState<PartnerTabKey>(PartnerTabKey.companyPartners);
  const location = useLocation();
  const isActiveTab = location.pathname === PATH.brandPartners;

  const companyColumns: TableColumnProps<Company>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      width: '5%',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      sorter: true,
      width: '5%',
    },
    {
      title: 'City',
      dataIndex: 'city',
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
      dataIndex: 'affiliation',
      width: '8%',
    },
    {
      title: 'Relation',
      dataIndex: 'relation',
      width: '5%',
    },
    {
      title: 'Acquisition',
      dataIndex: 'acquisition',
      width: '5%',
    },
    {
      title: 'Price Rate',
      dataIndex: 'price_rate',
      width: '5%',
    },
    {
      title: 'Authorised Country',
      dataIndex: 'authorised_country',
      width: '10%',
    },
    {
      title: 'Beyond',
      dataIndex: 'beyond',
      align: 'center',
      width: '5%',
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
    setShowEntryForm(true);
    setEntryFormType(selectedTab!);
  };

  const handleCloseEntryForm = () => {
    setShowEntryForm(false);
    setEntryFormType(null);
  };

  const panels = [
    {
      id: 1,
      title: 'Affiliation',
      headingDropdown: 'VIEW ALL',
      labels: [
        { id: 1, label: 'Agent' },
        { id: 2, label: 'Distributor' },
      ],
    },

    {
      id: 2,
      title: 'Relation',
      headingDropdown: 'VIEW ALL',
      labels: [
        { id: 1, label: 'Direct' },
        { id: 2, label: 'Indirect' },
      ],
    },

    {
      id: 3,
      title: 'Acquisition',
      headingDropdown: 'VIEW ALL',
      labels: [
        { id: 1, label: 'Frezze' },
        { id: 2, label: 'Inactive' },
      ],
    },
  ];

  const companyData = [
    {
      key: '1',
      name: 'Company A',
      country: 'USA',
      city: 'New York',
      contact: 'First/last name',
      affiliation: 'Agent',
      relation: 'Direct',
      acquisition: 'Frezze',
      price_rate: '1.10',
      authorised_country: 'USA',
      beyond: 'Allow',
    },
    {
      key: '2',
      name: 'Company B',
      country: 'Malaysia',
      city: 'Kuala Lumpur',
      contact: 'First/last name',
      affiliation: 'Distributor',
      relation: 'Indirect',
      acquisition: 'Inactive',
      price_rate: '1.20',
      authorised_country: 'Malaysia',
      beyond: 'Not Allow',
    },
  ];

  const handleChangeTab = (activeKey: string) => {
    setSelectedTab?.(activeKey as PartnerTabKey);
    if (activeKey === PartnerTabKey.companyPartners) setColumns(companyColumns);
  };

  console.log(entryFormType);

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
          <CollapsiblePanel panels={panels} />
          <CustomPlusButton
            onClick={handlePushTo}
            customClass="my-0 mx-16"
            disabled={!isActiveTab || showEntryForm}
          />
        </div>
      </div>

      {!showEntryForm ? (
        <CustomTable columns={columns} fetchDataFunc={getLocationPagination} />
      ) : entryFormType === PartnerTabKey.companyPartners ? (
        <CompanyEntryForm onClose={handleCloseEntryForm} data={data} setData={setData} />
      ) : null}
    </>
  );
};

export default PartnersTable;
