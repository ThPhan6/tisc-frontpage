import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { TableColumnItem } from '@/components/Table/types';
import { deletePresetMiddleware, getProductBasisPresetPagination } from '@/services';
import type { BasisPresetListResponse, SubBasisPreset } from '@/types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { confirmDelete } from '@/helper/common';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/Action';

const BasisPresetList: React.FC = () => {
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
      width: 300,
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Preset Name',
      dataIndex: 'preset_name',
      width: 250,
      sorter: {
        multiple: 2,
      },
    },
    ...SameColumns,
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5px',
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
      width: 300,
      noBoxShadow: true,
    },
    {
      title: 'Preset Name',
      dataIndex: 'name',
      width: 250,
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
      width: 300,
      noBoxShadow: true,
    },
    {
      title: 'Preset Name',
      dataIndex: 'preset_name',
      width: 250,
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
