import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { TableColumnItem } from '@/components/Table/types';
import { deleteConversionMiddleware, getProductBasisConversionPagination } from '@/services';
import type { BasisConversionListResponse, SubBasisConversion } from '@/types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { confirmDelete } from '@/helper/common';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/Action';

const BasisConversionList: React.FC = () => {
  const tableRef = useRef<any>();

  const handleUpdateConversion = (id: string) => {
    pushTo(PATH.updateConversions.replace(':id', id));
  };

  const handleDeleteConversion = (id: string) => {
    confirmDelete(() => {
      deleteConversionMiddleware(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const MainColumns: TableColumnItem<BasisConversionListResponse>[] = [
    {
      title: 'Conversion Group',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: 250,
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Conversion Between',
      dataIndex: 'conversion_between',
      width: 250,
      sorter: {
        multiple: 2,
      },
    },
    {
      title: '1st Formula',
      dataIndex: 'first_formula',
      width: 250,
    },
    {
      title: '2nd Formula',
      dataIndex: 'second_formula',
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value, record) => {
        return (
          <ActionMenu
            handleUpdate={() => handleUpdateConversion(record.id)}
            handleDelete={() => handleDeleteConversion(record.id)}
          />
        );
      },
    },
  ];
  const SubColumns: TableColumnItem<SubBasisConversion>[] = [
    {
      title: 'Conversion Group',
      dataIndex: 'name',
      width: 250,
      noBoxShadow: true,
    },
    {
      title: 'Conversion Between',
      dataIndex: 'conversion_between',
      width: 250,
      noBoxShadow: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: '1st Formula',
      dataIndex: 'first_formula',
      width: 250,
      noBoxShadow: true,
    },
    {
      title: '2nd Formula',
      dataIndex: 'second_formula',
      noBoxShadow: true,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: '5%',
      align: 'center',
      noBoxShadow: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      noBoxShadow: true,
    },
  ];

  return (
    <>
      <CustomTable
        rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createConversions)} />}
        title="CONVERSIONS"
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getProductBasisConversionPagination}
        multiSort={{
          name: 'conversion_group_order',
          conversion_between: 'conversion_between_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: SubColumns,
          childrenColumnName: 'subs',
        })}
      />
    </>
  );
};

export default BasisConversionList;
