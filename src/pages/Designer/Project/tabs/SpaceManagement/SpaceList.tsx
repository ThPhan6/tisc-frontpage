import React, { useEffect, useRef, useState } from 'react';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { deleteProjectSpace, getProjectSpaceListPagination } from '@/features/project/services';
import { confirmDelete } from '@/helper/common';
import { formatNumberDisplay } from '@/helper/utils';

import type { TableColumnItem } from '@/components/Table/types';
import type {
  ProjectSpaceArea,
  ProjectSpaceRoom,
  ProjectSpaceZone,
} from '@/features/project/types';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

const MAIN_COL_WIDTH = 200;
const SUB_COL_WIDTH = 150;

interface SpaceListProps {
  handleUpdateSpace: (record: ProjectSpaceZone) => void;
  projectId?: string;
}

const SpecificationBySpace: React.FC<SpaceListProps> = ({ handleUpdateSpace, projectId }) => {
  useAutoExpandNestedTableColumn([MAIN_COL_WIDTH, SUB_COL_WIDTH]);
  const tableRef = useRef<any>();
  const [combinableSorter, setCombinableSorter] = useState<{ key: string; value: string }>({
    key: '',
    value: '',
  });
  const handleDeleteZone = (id: string) => {
    confirmDelete(() => {
      deleteProjectSpace(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const reUpdateCombinableSorterState = () => {
    setCombinableSorter((oldState) => {
      return {
        key: oldState.key,
        value: oldState.value,
      };
    });
  };

  const GeneralColumns: TableColumnItem<any>[] = [
    {
      title: 'Room Size',
      dataIndex: 'room_size',
      width: 106,
      noBoxShadow: true,
      render: (value, record) => {
        if (value) {
          return `${formatNumberDisplay(value)} ${record.room_size_unit ?? ''}`;
        }
        return '';
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: '5%',
      align: 'center',
      noBoxShadow: true,
    },
    {
      title: 'Sub-total',
      dataIndex: 'room_size',
      noBoxShadow: true,
      render: (value, record) => {
        if (value && record.quantity) {
          return `${formatNumberDisplay(value * record.quantity)} ${record.room_size_unit ?? ''}`;
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
      width: MAIN_COL_WIDTH,
      isExpandable: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
      onHeaderCell: () => {
        return {
          onClick: reUpdateCombinableSorterState,
        };
      },
    },
    {
      title: 'Areas',
      dataIndex: 'area_coumn',
      width: SUB_COL_WIDTH,
      sorter: {
        multiple: 2,
      },
      onHeaderCell: () => {
        return {
          onClick: reUpdateCombinableSorterState,
        };
      },
    },
    {
      title: 'Rooms',
      dataIndex: 'room_column',
      width: 106,
      sorter: {
        multiple: 3,
      },
      onHeaderCell: () => {
        return {
          onClick: () => {
            setCombinableSorter(() => {
              return {
                key: 'room_column',
                value: 'room_name_order',
              };
            });
          },
        };
      },
    },
    {
      title: 'Room ID',
      dataIndex: 'room_id_column',
      width: 106,
      sorter: {
        multiple: 4,
      },
      onHeaderCell: () => {
        return {
          onClick: () => {
            setCombinableSorter(() => {
              return {
                key: 'room_id_column',
                value: 'room_id_order',
              };
            });
          },
        };
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
      width: 106,
      noBoxShadow: true,
    },
    {
      title: 'Room ID',
      dataIndex: 'room_id',
      width: 106,
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
      width: MAIN_COL_WIDTH,
      noBoxShadow: true,
    },
    {
      title: 'Areas',
      dataIndex: 'name',
      width: SUB_COL_WIDTH,
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
      width: '5%',
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
      width: MAIN_COL_WIDTH,
      noBoxShadow: true,
    },
    {
      title: 'Areas',
      dataIndex: 'name',
      width: SUB_COL_WIDTH,
      noBoxShadow: true,
    },
    ...SubGeneralColumns,
  ];

  useEffect(() => {
    tableRef.current.reload();
  }, [combinableSorter]);

  return (
    <>
      <CustomTable
        rightAction={<CustomPlusButton />}
        columns={ZoneColumns}
        ref={tableRef}
        fetchDataFunc={getProjectSpaceListPagination}
        multiSort={{
          name: 'zone_order',
          area_coumn: 'area_order',
          [combinableSorter.key]: combinableSorter.value,
        }}
        expandable={GetExpandableTableConfig({
          columns: AreaColumns,
          childrenColumnName: 'areas',
          expandable: GetExpandableTableConfig({
            columns: RoomColumns,
            childrenColumnName: 'rooms',
          }),
        })}
        extraParams={{
          project_id: projectId,
        }}
        onFilterLoad={false}
        autoLoad={false}
      />
    </>
  );
};

export default SpecificationBySpace;
