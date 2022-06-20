import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table/types';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { deletePresetMiddleware, getProductBasisPresetPagination } from './services/api';
import type { IBasisPresetListResponse, ISubBasisPreset } from './types';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-icon.svg';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';

const BasisPresetList: React.FC = () => {
  const tableRef = useRef<any>();

  const handleAction = (actionType: 'edit' | 'delete', id: string) => {
    if (actionType === 'edit') {
      //redirect update page and get id of preset
      pushTo(PATH.updatePresets.replace(':id', id));
      return;
    }
    deletePresetMiddleware(id, () => {
      // after delete success -> update data in table and send mess
      tableRef.current.reload();
      message.success(MESSAGE_NOTIFICATION.DELETE_CONVERSION_SUCCESS);
    });
  };

  const SameColumns: ICustomTableColumnType<any>[] = [
    {
      title: '1st Value',
      dataIndex: 'value_1',
      width: '5%',
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
      width: '5%',
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
      width: 250,
      isExpandable: true,
    },
    {
      title: 'Preset Name',
      dataIndex: 'preset_name',
      width: 150,
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
            overlay={
              <MenuHeaderDropdown
                items={[
                  {
                    onClick: () => handleAction('edit', record.id),
                    icon: <ViewIcon />,
                    label: 'Edit',
                  },
                  {
                    onClick: () => handleAction('delete', record.id),
                    icon: <EmailInviteIcon />,
                    label: 'Delete',
                  },
                ]}
              />
            }
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
      width: 250,
      noBoxShadow: true,
    },
    {
      title: 'Preset Name',
      dataIndex: 'name',
      width: 150,
      isExpandable: true,
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
      width: 250,
      noBoxShadow: true,
    },
    {
      title: 'Preset Name',
      dataIndex: 'preset_name',
      width: 150,
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
        rightAction={
          <div style={{ cursor: 'pointer' }} onClick={() => pushTo(PATH.createPresets)}>
            <PlusIcon />
          </div>
        }
        title="PRESET"
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
