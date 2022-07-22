import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { TableColumnItem } from '@/components/Table/types';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { getProductBasisOptionPagination, deleteBasisOption } from '@/services';
import { showImageUrl } from '@/helper/utils';
import type { BasisOptionListResponse, SubBasisOption } from '@/types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { confirmDelete } from '@/helper/common';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';

const MAIN_COL_WIDTH = 253;
const SUB_COL_WIDTH = 135;
const BasisOptionList: React.FC = () => {
  useAutoExpandNestedTableColumn(MAIN_COL_WIDTH, SUB_COL_WIDTH);
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

  const SameColumn: TableColumnItem<any>[] = [
    {
      title: 'Image',
      dataIndex: 'image',
      width: '5%',
      render: (value) => {
        if (value) {
          return (
            <img
              src={showImageUrl(value)}
              style={{ width: 18, height: 18, objectFit: 'contain' }}
            />
          );
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

  const MainColumns: TableColumnItem<BasisOptionListResponse>[] = [
    {
      title: 'Option Group',
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
      title: 'Option Name',
      dataIndex: 'option_name',
      width: SUB_COL_WIDTH,
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
            align={{ offset: [-14, -10] }}
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

  const SubColumns: TableColumnItem<SubBasisOption>[] = [
    {
      title: 'Option Group',
      dataIndex: 'option_group',
      width: MAIN_COL_WIDTH,
      noBoxShadow: true,
    },
    {
      title: 'Option Name',
      dataIndex: 'name',
      width: SUB_COL_WIDTH,
      isExpandable: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    ...SameColumn,
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const ChildColumns: TableColumnItem<BasisOptionListResponse>[] = [
    {
      title: 'Option Group',
      dataIndex: 'option_group',
      width: MAIN_COL_WIDTH,
      noBoxShadow: true,
    },
    {
      title: 'Option Name',
      dataIndex: 'option_name',
      width: SUB_COL_WIDTH,
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
