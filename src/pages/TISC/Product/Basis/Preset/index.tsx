import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table/types';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { deletePresetMiddleware, getProductBasisPresetPagination } from '@/services';
import type { IBasisPresetListResponse, ISubBasisPreset } from '@/types';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { confirmDelete } from '@/helper/common';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
const BasisPresetList: React.FC = () => {
  const tableRef = useRef<any>();

  const handleAction = (actionType: 'edit' | 'delete', id: string) => {
    if (actionType === 'edit') {
      pushTo(PATH.updatePresets.replace(':id', id));
      return;
    }

    const onOk = () => {
      deletePresetMiddleware(id, () => {
        tableRef.current.reload();
        message.success(MESSAGE_NOTIFICATION.DELETE_PRESET_SUCCESS);
      });
    };

    const onCancel = () => {
      pushTo(PATH.presets);
    };

    confirmDelete(onOk, onCancel);
  };

  const SameColumns: ICustomTableColumnType<any>[] = [
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

  const MainColumns: ICustomTableColumnType<IBasisPresetListResponse>[] = [
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
      width: '5%',
      render: (_value, record) => {
        return (
          <HeaderDropdown
            arrow={true}
            align={{ offset: [-14, -10] }}
            items={[
              {
                onClick: () => handleAction('edit', record.id),
                icon: <EditIcon />,
                label: 'Edit',
              },
              {
                onClick: () => handleAction('delete', record.id),
                icon: <DeleteIcon />,
                label: 'Delete',
              },
            ]}
            trigger={['click']}
          >
            <ActionIcon />
          </HeaderDropdown>
        );
      },
    },
  ];

  const SubColumns: ICustomTableColumnType<ISubBasisPreset>[] = [
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

  const ChildColumns: ICustomTableColumnType<IBasisPresetListResponse>[] = [
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
