import { useRef } from 'react';

import { PATH } from '@/constants/path';

import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { deleteQuotation, getQuotationPagination } from '@/services';

import { TableColumnItem } from '@/components/Table/types';
import { Quotation } from '@/types';

import { ActionMenu } from '@/components/Action';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const InspirationalQuotationsList: React.FC = () => {
  const tableRef = useRef<any>();

  const handleUpdateQuotation = (id: string) => {
    pushTo(PATH.updateQuotation.replace(':id', id));
  };

  const handleDeleteQuotation = (id: string) => {
    confirmDelete(() => {
      deleteQuotation(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const mainColumns: TableColumnItem<Quotation>[] = [
    {
      title: 'Author',
      dataIndex: 'author',
      sorter: true,
      width: '10%',
    },
    {
      title: 'Indentity ',
      dataIndex: 'identity',
      width: '15%',
    },
    {
      title: 'Quotes',
      dataIndex: 'quotation',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value: any, record: any) => {
        return (
          <ActionMenu
            handleUpdate={() => handleUpdateQuotation(record.id)}
            handleDelete={() => handleDeleteQuotation(record.id)}
          />
        );
      },
    },
  ];

  return (
    <CustomTable
      rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createQuotation)} />}
      ref={tableRef}
      columns={mainColumns}
      fetchDataFunc={getQuotationPagination}
      title="INSPIRATIONAL QUOTES"
      hasPagination
    />
  );
};

export default InspirationalQuotationsList;
