import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table/types';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { getProductAttributePagination, deleteAttribute } from './services/api';
import { pushTo } from '@/helper/history';
import { useAttributeLocation } from './hooks/location';
import { confirmDelete } from '@/helper/common';
import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import type { IAttributeListResponse, ISubAttribute } from './types';

const AttributeList: React.FC = () => {
  const tableRef = useRef<any>();
  const { activePath, attributeLocation } = useAttributeLocation();

  const handleUpdateAttribute = (id: string) => {
    pushTo(`${activePath}/${id}`);
  };
  const handleDeleteAttribute = (id: string) => {
    confirmDelete(() => {
      deleteAttribute(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const MainColumns: ICustomTableColumnType<IAttributeListResponse>[] = [
    {
      title: 'Attribute Group',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: 200,
      isExpandable: true,
    },
    {
      title: 'Attribute Name',
      dataIndex: 'attribute_name',
      width: 150,
      sorter: {
        multiple: 2,
      },
    },
    {
      title: 'Content Type',
      dataIndex: 'content_type',
      width: 150,
      sorter: {
        multiple: 3,
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
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
            arrow={true}
            overlay={
              <MenuHeaderDropdown
                items={[
                  {
                    onClick: () => handleUpdateAttribute(record.id),
                    icon: <EditIcon />,
                    label: 'Edit',
                  },
                  {
                    onClick: () => handleDeleteAttribute(record.id),
                    icon: <DeleteIcon />,
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
  const SubColumns: ICustomTableColumnType<ISubAttribute>[] = [
    {
      title: 'Attribute Group',
      dataIndex: 'attribute_group',
      width: 200,
      noBoxShadow: true,
    },
    {
      title: 'Attribute Name',
      dataIndex: 'name',
      width: 150,
      noBoxShadow: true,
    },
    {
      title: 'Content Type',
      dataIndex: 'content_type',
      width: 150,
      noBoxShadow: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      noBoxShadow: true,
      render: (value, record) => {
        if (record.description_1) {
          return (
            <span className="basis-conversion-group">
              {record.description_1}
              <SwapIcon />
              {record.description_2}
            </span>
          );
        }
        return value;
      },
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
        rightAction={<CustomPlusButton onClick={() => pushTo(`${activePath}/create`)} />}
        title={attributeLocation.NAME}
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getProductAttributePagination}
        extraParams={{
          type: attributeLocation.TYPE,
        }}
        multiSort={{
          name: 'group_order',
          attribute_name: 'attribute_order',
          content_type: 'content_type_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: SubColumns,
          childrenColumnName: 'subs',
        })}
      />
    </>
  );
};

export default AttributeList;
