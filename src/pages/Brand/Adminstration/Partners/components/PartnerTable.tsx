import { PartnerTableContext } from '..';

import { useContext, useMemo } from 'react';

import { PATH } from '@/constants/path';
import { TableColumnProps } from 'antd';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { getFullName, setDefaultWidthForEachColumn } from '@/helper/utils';
import { deletePartnerContact, getListPartnerContacts } from '@/services';

import { Contact, PartnerContactStatus } from '@/types';

import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';
import TeamIcon from '@/components/TeamIcon/TeamIcon';

interface ContactTableProps {
  tableRef: React.MutableRefObject<any>;
}

export const ContactTable: React.FC<ContactTableProps> = ({ tableRef }) => {
  useAutoExpandNestedTableColumn(0, [7], Date.now());

  const { filters } = useContext(PartnerTableContext);

  const handlePushToUpdate = (id: string) => () => {
    pushTo(PATH.brandUpdatePartnerContact.replace(':id', id));
  };

  const handleDeletePartner = (id: string) => () => {
    confirmDelete(async () => {
      const res = await deletePartnerContact(id);
      if (res) tableRef.current.reload();
    });
  };

  console.log('filters', filters);

  const columns: TableColumnProps<Contact>[] = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'avatar',
        width: '50',
        render: (_, record) => {
          return <TeamIcon avatar={record.avatar} name={getFullName(record)} size={20} />;
        },
      },
      {
        title: 'Full Name',
        dataIndex: 'fullname',
        sorter: true,
        render: (_, record) => <span className="text-capitalize ">{record.fullname}</span>,
      },
      {
        title: 'Company',
        dataIndex: 'company_name',
        sorter: true,
        render: (_, record) => <span className="text-capitalize ">{record.company_name}</span>,
      },
      {
        title: 'Country',
        dataIndex: 'country_name',
        sorter: true,
      },
      {
        title: 'Title/Position',
        dataIndex: 'position',
        render: (_, record) => <span className="text-capitalize ">{record.position}</span>,
      },
      {
        title: 'Work Email',
        dataIndex: 'email',
      },
      {
        title: 'Work Phone',
        dataIndex: 'phone',
      },
      {
        title: 'Work Mobile',
        dataIndex: 'mobile',
      },
      {
        title: 'Activation',
        dataIndex: 'status',
        width: '5%',
        render: (_, record) => {
          switch (record.status) {
            case PartnerContactStatus.Uninitiate:
              return <span className="text-capitalize">Uninitiate</span>;
            case PartnerContactStatus.Pending:
              return <span className="text-capitalize">Pending</span>;
            case PartnerContactStatus.Activated:
              return <span className="text-capitalize">Activated</span>;
            default:
              return '';
          }
        },
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
    ],
    [handleDeletePartner, handlePushToUpdate],
  );

  return (
    <CustomTable
      columns={setDefaultWidthForEachColumn(columns, 7)}
      fetchDataFunc={getListPartnerContacts}
      hasPagination
      ref={tableRef}
    />
  );
};
