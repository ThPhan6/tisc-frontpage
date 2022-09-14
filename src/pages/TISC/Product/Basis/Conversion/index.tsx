import React, { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { deleteConversionMiddleware, getProductBasisConversionPagination } from '@/services';

import type { TableColumnItem } from '@/components/Table/types';
import type { BasisConversionListResponse, SubBasisConversion } from '@/types';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

const MAIN_COL_WIDTH = 167;
const BasisConversionList: React.FC = () => {
  useAutoExpandNestedTableColumn([MAIN_COL_WIDTH]);
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
      width: MAIN_COL_WIDTH,
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Conversion Between',
      dataIndex: 'conversion_between',
      width: 200,
      sorter: {
        multiple: 2,
      },
    },
    {
      title: '1st Formula',
      dataIndex: 'first_formula',
      width: 200,
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
      width: MAIN_COL_WIDTH,
    },
    {
      title: 'Conversion Between',
      dataIndex: 'conversion_between',
      width: 200,
      noBoxShadow: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: '1st Formula',
      dataIndex: 'first_formula',
      width: 200,
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
          level: 2,
        })}
      />
    </>
  );
};

export default BasisConversionList;
