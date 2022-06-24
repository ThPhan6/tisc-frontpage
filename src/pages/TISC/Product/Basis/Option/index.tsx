import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table/types';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { getProductBasisOptionPagination, deleteBasisOption } from './services/api';
import { showImageUrl } from '@/helper/utils';
import type { IBasisOptionListResponse, ISubBasisOption } from './types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { confirmDelete } from '@/helper/common';

const BasisOptionList: React.FC = () => {
  const tableRef = useRef<any>();

  const handleUpdateBasisOption = (id: string) => {
    pushTo(PATH.updateOptions.replace(':id', id));
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

  const SameColumn: ICustomTableColumnType<any>[] = [
    {
      title: 'Image',
      dataIndex: 'image',
      width: '5%',
      render: (value) => {
        if (value) {
          return <img src={showImageUrl(value)} style={{ width: 30 }} />;
        }
        return null;
      },
    },
    {
      title: '1st Value',
      dataIndex: 'value_1',
      width: '10%',
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
      width: '10%',
    },
    {
      title: 'Unit',
      dataIndex: 'unit_2',
      lightHeading: true,
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
  ];

  const MainColumns: ICustomTableColumnType<IBasisOptionListResponse>[] = [
    {
      title: 'Option Group',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: 300,
      isExpandable: true,
    },
    {
      title: 'Option Name',
      dataIndex: 'option_name',
      width: 250,
      sorter: {
        multiple: 2,
      },
    },
    ...SameColumn,
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value: any, record: any) => {
        return (
          <HeaderDropdown
            arrow={true}
            items={[
              {
                onClick: () => handleUpdateBasisOption(record.id),
                icon: <EditIcon />,
                label: 'Edit',
              },
              {
                onClick: () => handleDeleteBasisOption(record.id),
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

  const SubColumns: ICustomTableColumnType<ISubBasisOption>[] = [
    {
      title: 'Option Group',
      dataIndex: 'option_group',
      width: 300,
      noBoxShadow: true,
    },
    {
      title: 'Option Name',
      dataIndex: 'name',
      width: 250,
      isExpandable: true,
    },
    ...SameColumn,
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const ChildColumns: ICustomTableColumnType<IBasisOptionListResponse>[] = [
    {
      title: 'Option Group',
      dataIndex: 'option_group',
      width: 300,
      noBoxShadow: true,
    },
    {
      title: 'Option Name',
      dataIndex: 'option_name',
      width: 250,
    },
    ...SameColumn,
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
        rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createOptions)} />}
        title="OPTIONS"
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getProductBasisOptionPagination}
        multiSort={{
          name: 'group_order',
          option_name: 'option_order',
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

export default BasisOptionList;
