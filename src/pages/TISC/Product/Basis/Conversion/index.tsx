import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { TableColumnItem } from '@/components/Table/types';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { deleteConversionMiddleware, getProductBasisConversionPagination } from '@/services';
import type { BasisConversionListResponse, SubBasisConversion } from '@/types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { confirmDelete } from '@/helper/common';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';

const MAIN_COL_WIDTH = 167;
const BasisConversionList: React.FC = () => {
  useAutoExpandNestedTableColumn(MAIN_COL_WIDTH);
  const tableRef = useRef<any>();

  const handleAction = (actionType: 'edit' | 'delete', id: string) => {
    if (actionType === 'edit') {
      pushTo(PATH.updateConversions.replace(':id', id));
      return;
    }

    const onOk = () => {
      deleteConversionMiddleware(id, () => {
        tableRef.current.reload();
        message.success(MESSAGE_NOTIFICATION.DELETE_CONVERSION_SUCCESS);
      });
    };

    const onCancel = () => {
      pushTo(PATH.conversions);
    };

    confirmDelete(onOk, onCancel);
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
          <HeaderDropdown
            arrow
            align={{ offset: [13, -10] }}
            placement="bottomRight"
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
        })}
      />
    </>
  );
};

export default BasisConversionList;
