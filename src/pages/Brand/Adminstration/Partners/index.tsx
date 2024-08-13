import { TableColumnProps } from 'antd';
import { useHistory } from 'umi';

import { useCheckPartnerActiveTab } from '@/pages/Brand/Adminstration/Partners/hooks/useCheckPartnerActiveTab';

import { TabItem } from '@/components/Tabs/types';
import { Partners as PartnerAttributes } from '@/types';

import CollapsiblePanel from '@/components/CollapsiblePanel';
import CustomTable from '@/components/Table';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { CustomTabs } from '@/components/Tabs';
import styles from '@/pages/Brand/Adminstration/Partners/Partners.less';

import { getLocationPagination } from '@/features/locations/api';

export enum PartnerTabKey {
  companyParnets = 'company',
  contactPartners = 'contacts',
}

const Partners = () => {
  const { push } = useHistory();
  const { isActiveTab, selectedTab, setSelectedTab } = useCheckPartnerActiveTab();

  const listTab: TabItem[] = [
    {
      tab: 'Companies',
      tabletTabTitle: 'Companies',
      key: PartnerTabKey.companyParnets,
      disable: !isActiveTab,
    },

    {
      tab: 'Contacts',
      tabletTabTitle: 'Contacts',
      key: PartnerTabKey.contactPartners,
      disable: !isActiveTab,
    },
  ];

  const handleChangeTab = (activeKey: string) => {
    location.hash = '#' + activeKey;
    push(location);
    setSelectedTab?.(activeKey as PartnerTabKey);
  };

  const handlePushTo = () => {};

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

  const columns: TableColumnProps<PartnerAttributes>[] = [
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

  const dataSource = [
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

        <div className="d-flex bg-white border-bottom-black">
          <CollapsiblePanel panels={panels} />
          <CustomPlusButton
            onClick={handlePushTo}
            customClass="my-0 mx-16"
            disabled={!isActiveTab}
          />
        </div>
      </div>

      <CustomTable columns={columns} fetchDataFunc={getLocationPagination} hasPagination />
    </>
  );
};

export default Partners;
