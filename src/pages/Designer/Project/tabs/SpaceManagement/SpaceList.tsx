import React, { useEffect, useRef } from 'react';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { deleteProjectSpace, getProjectSpaceListPagination } from '@/features/project/services';
import { confirmDelete } from '@/helper/common';
import { formatCurrencyNumber, setDefaultWidthForEachColumn } from '@/helper/utils';

import type { TableColumnItem } from '@/components/Table/types';
import type {
  ProjectSpaceArea,
  ProjectSpaceRoom,
  ProjectSpaceZone,
} from '@/features/project/types';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

interface SpaceListProps {
  handleUpdateSpace: (record: ProjectSpaceZone) => void;
  projectId?: string;
}

const SpaceList: React.FC<SpaceListProps> = ({ handleUpdateSpace, projectId }) => {
  useAutoExpandNestedTableColumn(2, [7]);
  const tableRef = useRef<any>();

  const handleDeleteZone = (id: string) => {
    confirmDelete(() => {
      deleteProjectSpace(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const GeneralColumns: TableColumnItem<any>[] = [
    {
      title: 'Room Size',
      dataIndex: 'room_size',
      noBoxShadow: true,
      render: (value, record) => {
        if (value) {
          return `${formatCurrencyNumber(value)} ${record.room_size_unit ?? ''}`;
        }
        return '';
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      align: 'center',
      noBoxShadow: true,
    },
    {
      title: 'Sub-total',
      dataIndex: 'room_size',
      noBoxShadow: true,
      render: (value, record) => {
        if (value && record.quantity) {
          return `${formatCurrencyNumber(value * record.quantity)} ${record.room_size_unit ?? ''}`;
        }
        return '';
      },
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center', noBoxShadow: true },
  ];

  const ZoneColumns: TableColumnItem<ProjectSpaceZone>[] = [
    {
      title: 'Zone',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      isExpandable: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: 'Areas',
      dataIndex: 'area_column',
      defaultSortOrder: 'ascend',
      sorter: {
        multiple: 2,
      },
    },
    {
      title: 'Rooms',
      dataIndex: 'room_column',
      defaultSortOrder: 'ascend',
      sorter: {
        multiple: 3,
      },
    },
    {
      title: 'Room ID',
      dataIndex: 'room_id_column',
      sorter: {
        multiple: 3,
      },
    },
    ...GeneralColumns,
    {
      title: 'Action',
      dataIndex: 'id',
      align: 'center',
      width: '5%',
      render: (zoneId, record) => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateSpace(record),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteZone(zoneId),
              },
            ]}
          />
        );
      },
    },
  ];

  const SubGeneralColumns: any = [
    {
      title: 'Room',
      dataIndex: 'room_name',
      noBoxShadow: true,
    },
    {
      title: 'Room ID',
      dataIndex: 'room_id',
      noBoxShadow: true,
    },
    ...GeneralColumns,
    {
      title: 'Action',
      dataIndex: 'action',
      width: '5%',
      noBoxShadow: true,
    },
  ];

  const AreaColumns: TableColumnItem<ProjectSpaceArea>[] = [
    {
      title: 'Zone',
      dataIndex: 'zone',
      noBoxShadow: true,
    },
    {
      title: 'Areas',
      dataIndex: 'name',
      isExpandable: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: 'Room',
    },
    {
      title: 'Room ID',
    },
    {
      title: 'Room Size',
    },
    {
      title: 'Quantity',
      align: 'center',
    },
    {
      title: 'Sub-total',
    },
    { title: 'Count', width: '5%', align: 'center', dataIndex: 'count' },
    {
      title: 'Action',
      width: '5%',
    },
  ];

  const RoomColumns: TableColumnItem<ProjectSpaceRoom>[] = [
    {
      title: 'Zone',
      dataIndex: 'zone',
      noBoxShadow: true,
    },
    {
      title: 'Areas',
      dataIndex: 'name',
      noBoxShadow: true,
    },
    ...SubGeneralColumns,
  ];

  useEffect(() => {
    tableRef.current.reload();
  }, []);

  return (
    <>
      <CustomTable
        rightAction={<CustomPlusButton />}
        columns={setDefaultWidthForEachColumn(ZoneColumns, 6)}
        ref={tableRef}
        fetchDataFunc={getProjectSpaceListPagination}
        multiSort={{
          name: 'zone_order',
          area_column: 'area_order',
          room_column: 'room_name_order',
          room_id_column: 'room_id_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(AreaColumns, 6),
          childrenColumnName: 'areas',
          level: 2,

          expandable: GetExpandableTableConfig({
            columns: setDefaultWidthForEachColumn(RoomColumns, 6),
            childrenColumnName: 'rooms',
            level: 3,
          }),
        })}
        extraParams={{
          project_id: projectId,
        }}
        autoLoad={false}
      />
    </>
  );
};

export default SpaceList;
