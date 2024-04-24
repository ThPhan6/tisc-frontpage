import React, { useRef } from 'react';

import { useParams } from 'umi';

import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';

import { useAttributeLocation } from './hooks/location';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { deleteAttribute, getProductAttributePagination } from '@/services';

import { BrandAttributeParamProps } from '../BrandAttribute/types';
import type { TableColumnItem } from '@/components/Table/types';
import type { AttributeListResponse, SubAttribute } from '@/types';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

import { BranchHeader } from '../BrandAttribute/BranchHeader';

const colTitle = {
  group: 'Main Attribute',
  main: 'Sub Attribute',
  sub: 'Attribute Name',
};

const dataIndexDefault = 'name';

const colsDataIndex = {
  group: 'attribute_group',
  main: 'name 1',
  sub: 'attribute_name',
};

const AttributeList: React.FC = () => {
  useAutoExpandNestedTableColumn(3, [4]);
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

  const getSameColumns = (noBoxShadow?: boolean) => {
    const SameColumns: TableColumnItem<any>[] = [
      {
        title: 'Content Type',
        dataIndex: 'content_type',
        noBoxShadow: noBoxShadow,
        sorter: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        noBoxShadow: noBoxShadow,
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
        noBoxShadow: noBoxShadow,
      },
    ];
    return SameColumns;
  };

  const MainColumns: TableColumnItem<AttributeListResponse>[] = [
    {
      title: colTitle.group,
      dataIndex: dataIndexDefault,
      sorter: {
        multiple: 1,
      },
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: colTitle.main,
      dataIndex: colsDataIndex.main,
      sorter: {
        multiple: 2,
      },
      // defaultSortOrder: 'ascend',
    },
    {
      title: colTitle.sub,
      dataIndex: colsDataIndex.sub,
      sorter: {
        multiple: 3,
      },
      // defaultSortOrder: 'ascend',
    },
    ...getSameColumns(false),
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

  const MainSubColumns: TableColumnItem<any>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
    },
    {
      title: colTitle.main,
      dataIndex: dataIndexDefault,
      isExpandable: true,
    },
    {
      title: colTitle.sub,
      dataIndex: colsDataIndex.sub,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const SubColumns: TableColumnItem<SubAttribute>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
    },
    {
      title: colTitle.main,
      dataIndex: colsDataIndex.main,
      noBoxShadow: true,
    },
    {
      title: colTitle.sub,
      dataIndex: dataIndexDefault,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  return (
    <CustomTable
      header={<BranchHeader />}
      title={attributeLocation.NAME}
      columns={setDefaultWidthForEachColumn(MainColumns, 4)}
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
        columns: setDefaultWidthForEachColumn(MainSubColumns, 4),
        childrenColumnName: 'subs',
        level: 2,
        expandable: GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(SubColumns, 4),
          childrenColumnName: 'subs',
          level: 3,
        }),
      })}
    />
  );
};

export default AttributeList;
