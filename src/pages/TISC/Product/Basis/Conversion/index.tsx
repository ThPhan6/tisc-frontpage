import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table/types';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { deleteConversionMiddleware, getProductBasisConversionPagination } from './services/api';
import type { IBasisConversionListResponse, ISubBasisConversion } from './types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-icon.svg';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';

const BasisConversionList: React.FC = () => {
  const tableRef = useRef<any>();

  const handleAction = (actionType: 'edit' | 'delete', id: string) => {
    if (actionType === 'edit') {
      pushTo(PATH.updateConversions.replace(':id', id));
      return;
    }
    deleteConversionMiddleware(id, () => {
      tableRef.current.reload();
      message.success(MESSAGE_NOTIFICATION.DELETE_CONVERSION_SUCCESS);
    });
  };

  const MainColumns: ICustomTableColumnType<IBasisConversionListResponse>[] = [
    {
      title: 'Conversion Group',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: 200,
      isExpandable: true,
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
          <HeaderDropdown
            arrow
            align={{ offset: [13, -10] }}
            placement="bottomRight"
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
  const SubColumns: ICustomTableColumnType<ISubBasisConversion>[] = [
    {
      title: 'Conversion Group',
      dataIndex: 'name',
      width: 200,
      noBoxShadow: true,
    },
    {
      title: 'Conversion Between',
      dataIndex: 'conversion_between',
      width: 200,
      noBoxShadow: true,
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
        rightAction={
          <div style={{ cursor: 'pointer' }} onClick={() => pushTo(PATH.createConversions)}>
            <PlusIcon />
          </div>
        }
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
