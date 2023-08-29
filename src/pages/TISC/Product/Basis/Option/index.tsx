import React, { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { deleteBasisOption, getProductBasisOptionPagination } from '@/services';

import type { TableColumnItem } from '@/components/Table/types';
import type { BasisOptionListResponse, SubBasisOption } from '@/types';

import { LogoIcon } from '@/components/LogoIcon';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

const colTitle = {
  group: 'Group Name',
  main: 'Main Options',
  sub: 'Sub Options',
};

const dataIndexDefault = 'name';

const colsDataIndex = {
  group: 'option_group',
  main: 'main_group',
  sub: 'sub_group',
};

const BasisOptionList: React.FC = () => {
  useAutoExpandNestedTableColumn(3, [8]);
  const tableRef = useRef<any>();

  const handleUpdateBasisOption = (id: string) => {
    pushTo(PATH.updateOptions.replace(':id', id));
  };
  const handleLinkageBasisOption = (id: string) => {
    pushTo(PATH.LinkageDataSet.replace(':id', id));
  };
  const handleDeleteBasisOption = (id: string) => {
    confirmDelete(() => {
      deleteBasisOption(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };
  const getSameColumns = (noBoxShadow?: boolean) => {
    const SameColumn: TableColumnItem<any>[] = [
      {
        title: 'Image',
        dataIndex: 'image',
        width: '5%',
        noBoxShadow: noBoxShadow,
        render: (value) => (value ? <LogoIcon logo={value} size={18} /> : null),
      },
      {
        title: '1st Value',
        dataIndex: 'value_1',
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Unit',
        dataIndex: 'unit_1',
        lightHeading: true,
        noBoxShadow: noBoxShadow,
      },
      {
        title: '2nd Value',
        dataIndex: 'value_2',
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Unit',
        dataIndex: 'unit_2',
        lightHeading: true,
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Product ID',
        dataIndex: 'product_id',
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Count',
        dataIndex: 'count',
        width: '5%',
        align: 'center',
        noBoxShadow: noBoxShadow,
      },
    ];
    return SameColumn;
  };

  const MainColumns: TableColumnItem<BasisOptionListResponse>[] = [
    {
      title: colTitle.group,
      dataIndex: 'name', // key in data
      sorter: {
        multiple: 1,
      },
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: colTitle.main,
      dataIndex: colsDataIndex.main,
      sorter: {
        multiple: 2,
      },
      defaultSortOrder: 'descend',
    },
    {
      title: colTitle.sub,
      dataIndex: colsDataIndex.sub,
      sorter: {
        multiple: 3,
      },
      defaultSortOrder: 'ascend',
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value: any, record: any) => {
        if (record.master) {
          return null;
        }
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateBasisOption(record.id),
              },
              {
                type: 'linkage',
                onClick: () => handleLinkageBasisOption(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteBasisOption(record.id),
              },
            ]}
          />
        );
      },
    },
  ];

  const MainSubColumns: TableColumnItem<SubBasisOption>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
    },
    {
      title: colTitle.main,
      dataIndex: dataIndexDefault,
      isExpandable: true,
    },
    {
      title: colTitle.sub,
      dataIndex: colsDataIndex.sub,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const SubColumns: TableColumnItem<SubBasisOption>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
    },
    {
      title: colTitle.main,
      dataIndex: colsDataIndex.main,
      isExpandable: true,
      noBoxShadow: true,
    },
    {
      title: colTitle.sub,
      dataIndex: dataIndexDefault,
      isExpandable: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const ChildColumns: TableColumnItem<BasisOptionListResponse>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
    },
    {
      title: colTitle.main,
      dataIndex: colsDataIndex.main,
      noBoxShadow: true,
    },
    {
      title: colTitle.sub,
      dataIndex: colsDataIndex.sub,
      noBoxShadow: true,
    },
    ...getSameColumns(true),
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
        rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createOptions)} />}
        title="OPTIONS"
        columns={setDefaultWidthForEachColumn(MainColumns, 8)}
        ref={tableRef}
        fetchDataFunc={getProductBasisOptionPagination}
        multiSort={{
          // colsDataIndex is sort keys
          name: 'group_order',
          main_group: 'main_order',
          sub_group: 'option_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(MainSubColumns, 8),
          childrenColumnName: 'subs',
          level: 2,
          expandable: GetExpandableTableConfig({
            columns: setDefaultWidthForEachColumn(SubColumns, 8),
            childrenColumnName: 'subs',
            level: 3,
            expandable: GetExpandableTableConfig({
              columns: setDefaultWidthForEachColumn(ChildColumns, 8),
              childrenColumnName: 'subs',
              level: 4,
            }),
          }),
        })}
      />
    </>
  );
};

export default BasisOptionList;
