import React, { useRef } from 'react';
import CustomTable, { ICustomTableColumnType } from '@/components/Table';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { getDesignFirmPagination } from './services/api';
import { showImageUrl } from '@/helper/utils';
import type { IDesignFirmListResponse } from './types';
import styles from './styles/index.less';

const DesignFirmList: React.FC = () => {
  const tableRef = useRef<any>();

  const comingSoon = () => {
    alert('Coming Soon!');
  };

  const TableColumns: ICustomTableColumnType<IDesignFirmListResponse>[] = [
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
            className={styles.customAction}
            arrow={{
              pointAtCenter: true,
            }}
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
    <>
      <CustomTable
        title="DESIGN FIRMS"
        columns={TableColumns}
        ref={tableRef}
        fetchDataFunc={getDesignFirmPagination}
      />
    </>
  );
};

export default DesignFirmList;
