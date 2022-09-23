import React, { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { deletePresetMiddleware, getProductBasisPresetPagination } from '@/services';

import type { TableColumnItem } from '@/components/Table/types';
import type { BasisPresetListResponse, SubBasisPreset } from '@/types';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

const MAIN_COL_WIDTH = 236;
const SUB_COL_WIDTH = 138;
const BasisPresetList: React.FC = () => {
  useAutoExpandNestedTableColumn(2);
  const tableRef = useRef<any>();

  const handleUpdatePreset = (id: string) => {
    pushTo(PATH.updatePresets.replace(':id', id));
  };

  const handleDeletePreset = (id: string) => {
    confirmDelete(() => {
      deletePresetMiddleware(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const getSameColumns = (noBoxShadow?: boolean) => {
    const SameColumns: TableColumnItem<any>[] = [
      {
        title: '1st Value',
        dataIndex: 'value_1',
        width: 100,
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Unit',
        dataIndex: 'unit_1',
        width: '5%',
        lightHeading: true,
        noBoxShadow: noBoxShadow,
      },
      {
        title: '2nd Value',
        dataIndex: 'value_2',
        width: 100,
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Unit',
        dataIndex: 'unit_2',
        lightHeading: true,
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
    return SameColumns;
  };

  const MainColumns: TableColumnItem<BasisPresetListResponse>[] = [
    {
      title: 'Preset Group',
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
      title: 'Preset Name',
      dataIndex: 'preset_name',
      width: SUB_COL_WIDTH,
      sorter: {
        multiple: 2,
      },
    },
    ...getSameColumns(false),
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
                onClick: () => handleUpdatePreset(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeletePreset(record.id),
              },
            ]}
          />
        );
      },
    },
  ];

  const SubColumns: TableColumnItem<SubBasisPreset>[] = [
    {
      title: 'Preset Group',
      dataIndex: 'preset_group',
      width: MAIN_COL_WIDTH,
      noBoxShadow: true,
    },
    {
      title: 'Preset Name',
      dataIndex: 'name',
      width: SUB_COL_WIDTH,
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

  const ChildColumns: TableColumnItem<BasisPresetListResponse>[] = [
    {
      title: 'Preset Group',
      dataIndex: 'preset_group',
      width: MAIN_COL_WIDTH,
      noBoxShadow: true,
    },
    {
      title: 'Preset Name',
      dataIndex: 'preset_name',
      width: SUB_COL_WIDTH,
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
        rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createPresets)} />}
        title="PRESETS"
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getProductBasisPresetPagination}
        multiSort={{
          name: 'group_order',
          preset_name: 'preset_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: SubColumns,
          childrenColumnName: 'subs',
          level: 2,
          expandable: GetExpandableTableConfig({
            columns: ChildColumns,
            childrenColumnName: 'subs',
            level: 3,
          }),
        })}
      />
    </>
  );
};

export default BasisPresetList;
