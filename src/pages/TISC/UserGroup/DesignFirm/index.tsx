import React, { useRef } from 'react';
import CustomTable from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table/types';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { getDesignFirmPagination } from '@/services';
import { showImageUrl } from '@/helper/utils';
import type { IDesignFirmList } from '@/types';
import styles from './styles/index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { MenuSummary } from '@/components/MenuSummary';
import { dataMenuFirm } from '@/constants/util';

const DesignFirmList: React.FC = () => {
  const tableRef = useRef<any>();

  const comingSoon = () => {
    alert('Coming Soon!');
  };

  const TableColumns: ICustomTableColumnType<IDesignFirmList>[] = [
    {
      title: '',
      dataIndex: 'logo',
      width: 36,
      render: (value) => {
        if (value) {
          return <img src={showImageUrl(value)} style={{ width: 18 }} />;
        }
        return null;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
    },
    { title: 'Origin', dataIndex: 'origin', sorter: true },
    { title: 'Main Office', dataIndex: 'main_office', sorter: true },
    { title: 'Satellites', dataIndex: 'satellites' },
    { title: 'Designers', dataIndex: 'designers' },
    { title: 'Capacities', dataIndex: 'capacities' },
    { title: 'Projects', dataIndex: 'projects' },
    { title: 'Live', dataIndex: 'live', lightHeading: true },
    { title: 'On Hold', dataIndex: 'on_hold', lightHeading: true },
    { title: 'Archived', dataIndex: 'archived', lightHeading: true },
    { title: 'Status', dataIndex: 'status' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      render: () => {
        return (
          <HeaderDropdown
            containerClass={styles.customAction}
            arrow
            align={{ offset: [13, -10] }}
            placement="bottomRight"
            overlay={
              <MenuHeaderDropdown
                items={[
                  {
                    onClick: comingSoon,
                    icon: <ViewIcon />,
                    label: 'View',
                  },
                ]}
              />
            }
            trigger={['click']}
          >
            <ActionIcon />
          </HeaderDropdown>
        );
      },
    },
  ];

  return (
    <PageContainer
      pageHeaderRender={() => (
        <MenuSummary
          containerClass={styles.customMenuSummary}
          menuSummaryData={dataMenuFirm.leftData}
          typeMenu="subscription"
        />
      )}
    >
      <CustomTable
        title="DESIGN FIRMS"
        columns={TableColumns}
        ref={tableRef}
        fetchDataFunc={getDesignFirmPagination}
        hasPagination
      />
    </PageContainer>
  );
};

export default DesignFirmList;
