import { useRef } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { getFullName } from '@/helper/utils';

import { Documentation } from './types';
import { TableColumnItem } from '@/components/Table/types';

import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

import { getPolicyTemplates } from './api';
import moment from 'moment';

const PolicyTemplatePage: React.FC = () => {
  const tableRef = useRef<any>();

  const mainColumns: TableColumnItem<Documentation>[] = [
    {
      title: 'Last Updated',
      dataIndex: 'updated_at',
      sorter: true,
      width: '15%',
      render: (value) => {
        return moment(value).format('YYYY-MM-DD');
      },
    },
    {
      title: 'Author',
      dataIndex: 'author',
      width: '15%',
      sorter: true,
      render: (_value, record) => getFullName(record.author),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: true,
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
                label: 'Edit',
                onClick: () => pushTo(PATH.policyUpdate.replace(':id', record.id)),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <CustomTable
      ref={tableRef}
      columns={mainColumns}
      fetchDataFunc={getPolicyTemplates}
      title="AGREEMENT / POLICIES / TERMS"
      hasPagination
    />
  );
};

export default PolicyTemplatePage;
