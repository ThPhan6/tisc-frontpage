import React, { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { deleteConversionMiddleware, getProductBasisConversionPagination } from '@/services';

import type { TableColumnItem } from '@/components/Table/types';
import type { BasisConversionListResponse, SubBasisConversion } from '@/types';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

const BasisConversionList: React.FC = () => {
  useAutoExpandNestedTableColumn(1);
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
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Conversion Between',
      dataIndex: 'conversion_between',
      sorter: {
        multiple: 2,
      },
      defaultSortOrder: 'ascend',
    },
    {
      title: '1st Formula',
      dataIndex: 'first_formula',
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
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateConversion(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteConversion(record.id),
              },
            ]}
          />
        );
      },
    },
  ];
  const SubColumns: TableColumnItem<SubBasisConversion>[] = [
    {
      title: 'Conversion Group',
      dataIndex: 'name',
      noBoxShadow: true,
    },
    {
      title: 'Conversion Between',
      dataIndex: 'conversion_between',
      noBoxShadow: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: '1st Formula',
      dataIndex: 'first_formula',
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
        columns={setDefaultWidthForEachColumn(MainColumns, 3)}
        ref={tableRef}
        fetchDataFunc={getProductBasisConversionPagination}
        multiSort={{
          name: 'conversion_group_order',
          conversion_between: 'conversion_between_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: SubColumns,
          childrenColumnName: 'subs',
          level: 2,
        })}
      />
    </>
  );
};

export default BasisConversionList;
