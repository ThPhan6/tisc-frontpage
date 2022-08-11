import React, { useRef } from 'react';
import CustomTable from '@/components/Table';
import type { TableColumnItem } from '@/components/Table/types';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { getDesignFirmPagination } from '@/services';
import { showImageUrl } from '@/helper/utils';
import type { DesignFirm } from '@/types';
import styles from './styles/index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import DesignFirmSummary from './components/DesignFirmSummary';
import { DESIGN_STATUSES } from '@/constants/util';

const DesignFirmList: React.FC = () => {
  const tableRef = useRef<any>();

  const handleViewDesignFirm = (id: string) => {
    pushTo(PATH.tiscUserGroupViewDesigner.replace(':id', id));
  };

  const TableColumns: TableColumnItem<DesignFirm>[] = [
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
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => {
        return (
          <span>
            {value === DESIGN_STATUSES.ACTIVE
              ? 'Active'
              : value === DESIGN_STATUSES.INACTIVE
              ? 'Inactive'
              : ''}
          </span>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      render: (_value, record) => {
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
                    onClick: () => handleViewDesignFirm(record.id),
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
    <PageContainer pageHeaderRender={() => <DesignFirmSummary />}>
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
