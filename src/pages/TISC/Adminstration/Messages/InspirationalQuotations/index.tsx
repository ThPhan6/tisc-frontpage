import { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { deleteQuotation, getQuotationPagination } from '@/services';

import { TableColumnItem } from '@/components/Table/types';
import { Quotation } from '@/types';

import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

const InspirationalQuotationsList: React.FC = () => {
  useAutoExpandNestedTableColumn(0, { rightColumnExcluded: 1 });
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
    },
    {
      title: 'Indentity ',
      dataIndex: 'identity',
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
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateQuotation(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteQuotation(record.id),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <CustomTable
      rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createQuotation)} />}
      ref={tableRef}
      columns={setDefaultWidthForEachColumn(mainColumns, 2)}
      fetchDataFunc={getQuotationPagination}
      title="INSPIRATIONAL QUOTES"
      hasPagination
    />
  );
};

export default InspirationalQuotationsList;
