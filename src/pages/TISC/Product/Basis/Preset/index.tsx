import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { TableColumnItem } from '@/components/Table/types';
import { deletePresetMiddleware, getProductBasisPresetPagination } from '@/services';
import type { BasisPresetListResponse, SubBasisPreset } from '@/types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { confirmDelete } from '@/helper/common';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { ActionMenu } from '@/components/Action';

const MAIN_COL_WIDTH = 236;
const SUB_COL_WIDTH = 138;
const BasisPresetList: React.FC = () => {
  useAutoExpandNestedTableColumn(MAIN_COL_WIDTH, SUB_COL_WIDTH);
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

  const SameColumns: TableColumnItem<any>[] = [
    {
      title: '1st Value',
      dataIndex: 'value_1',
      width: 100,
    },
    {
      title: 'Unit',
      dataIndex: 'unit_1',
      width: '5%',
      lightHeading: true,
    },
    {
      title: '2nd Value',
      dataIndex: 'value_2',
      width: 100,
    },
    {
      title: 'Unit',
      dataIndex: 'unit_2',
      lightHeading: true,
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
  ];

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
    ...SameColumns,
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value, record) => {
        return (
          <ActionMenu
            handleUpdate={() => handleUpdatePreset(record.id)}
            handleDelete={() => handleDeletePreset(record.id)}
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
    ...SameColumns,
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
    },
    ...SameColumns,
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
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
          }),
        })}
      />
    </>
  );
};

export default BasisPresetList;
