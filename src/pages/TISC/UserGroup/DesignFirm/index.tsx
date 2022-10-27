import React, { useRef } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getDesignFirmPagination } from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import type { TableColumnItem } from '@/components/Table/types';
import { DesignFirm } from '@/features/user-group/types';
import { ActiveStatus } from '@/types';

import { ShowLogo } from '@/components/ShowLogo';
import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';
import MenuHeaderSummary from '@/features/user-group/components/MenuHeaderSummary';

import styles from './index.less';

const DesignFirmList: React.FC = () => {
  useAutoExpandNestedTableColumn(0);
  const tableRef = useRef<any>();

  const handleViewDesignFirm = (id: string) => {
    pushTo(PATH.tiscUserGroupViewDesigner.replace(':id', id));
  };

  const TableColumns: TableColumnItem<DesignFirm>[] = [
    {
      title: '',
      dataIndex: 'logo',
      render: (value) => {
        return <ShowLogo logo={value} className={styles.img} />;
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
    { title: 'Capacity', dataIndex: 'capacities' },
    { title: 'Projects', dataIndex: 'projects' },
    { title: 'Live', dataIndex: 'live', lightHeading: true },
    { title: 'On Hold', dataIndex: 'on_hold', lightHeading: true },
    { title: 'Archived', dataIndex: 'archived', lightHeading: true },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '5%',
      render: (value) => {
        return <span>{ActiveStatus[value]}</span>;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value, record) => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'view',
                onClick: () => handleViewDesignFirm(record.id),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <PageContainer pageHeaderRender={() => <MenuHeaderSummary type="design" />}>
      <CustomTable
        title="DESIGN FIRMS"
        columns={setDefaultWidthForEachColumn(TableColumns, 10)}
        ref={tableRef}
        fetchDataFunc={getDesignFirmPagination}
        hasPagination
      />
    </PageContainer>
  );
};

export default DesignFirmList;
