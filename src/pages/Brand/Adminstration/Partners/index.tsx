import { TableColumnProps } from 'antd';
import { useHistory } from 'umi';

import { setDefaultWidthForEachColumn } from '@/helper/utils';
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
    },

    {
      title: 'Country',
      dataIndex: 'country',
      sorter: true,
    },

    {
      title: 'City',
      dataIndex: 'city',
      sorter: true,
    },

    {
      title: 'Contact',
      dataIndex: 'contact',
    },

    {
      title: 'Affiliation',
      dataIndex: 'affiliation',
    },

    {
      title: 'Relation',
      dataIndex: 'relation',
    },

    {
      title: 'Acquisition',
      dataIndex: 'acquisition',
    },

    {
      title: 'Price Rate',
      dataIndex: 'price_rate',
    },

    {
      title: 'Authorised Country',
      dataIndex: 'authorised_country',
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
      render: (_value: any, record: any) => {
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

        <div className="d-flex" style={{ background: '#fff', borderBottom: '1px solid #000' }}>
          <CollapsiblePanel panels={panels} />
          <CustomPlusButton
            onClick={handlePushTo}
            style={{ margin: '0 16px' }}
            disabled={!isActiveTab}
          />
        </div>
      </div>

      <CustomTable
        columns={setDefaultWidthForEachColumn(columns, 8)}
        fetchDataFunc={getLocationPagination}
        hasPagination
      />
    </>
  );
};

export default Partners;
