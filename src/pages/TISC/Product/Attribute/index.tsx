import React, { useRef } from 'react';

import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';

import { useAttributeLocation } from './hooks/location';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { deleteAttribute, getProductAttributePagination } from '@/services';

import type { TableColumnItem } from '@/components/Table/types';
import type { AttributeListResponse, SubAttribute } from '@/types';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

const AttributeList: React.FC = () => {
  useAutoExpandNestedTableColumn(1);
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

  const MainColumns: TableColumnItem<AttributeListResponse>[] = [
    {
      title: 'Attribute Group',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Attribute Name',
      dataIndex: 'attribute_name',
      sorter: {
        multiple: 2,
      },
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Content Type',
      dataIndex: 'content_type',
      sorter: {
        multiple: 2,
      },
      defaultSortOrder: 'ascend',
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
        if (record.master) {
          return null;
        }
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateAttribute(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteAttribute(record.id),
              },
            ]}
          />
        );
      },
    },
  ];
  const SubColumns: TableColumnItem<SubAttribute>[] = [
    {
      title: 'Attribute Group',
      dataIndex: 'attribute_group',
      noBoxShadow: true,
    },
    {
      title: 'Attribute Name',
      dataIndex: 'name',
      noBoxShadow: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: 'Content Type',
      dataIndex: 'content_type',
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
        columns={setDefaultWidthForEachColumn(MainColumns, 3)}
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
          columns: setDefaultWidthForEachColumn(SubColumns, 3),
          childrenColumnName: 'subs',
          level: 2,
        })}
      />
    </>
  );
};

export default AttributeList;
