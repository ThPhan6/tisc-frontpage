// import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';
import { ActionMenu } from '@/components/Action';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import type { TableColumnItem } from '@/components/Table/types';
// import { confirmDelete } from '@/helper/common';
// import { pushTo } from '@/helper/history';
import { getProductAttributePagination } from '@/services';
import type { ProjectSpaceZone, ProjectSpaceArea, ProjectSpaceRoom } from '@/types';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import React, { useRef } from 'react';

const MAIN_COL_WIDTH = 200;

interface SpaceListProps {
  handleUpdateSpace: (record: ProjectSpaceZone) => void;
}

const SpaceList: React.FC<SpaceListProps> = ({ handleUpdateSpace }) => {
  useAutoExpandNestedTableColumn(MAIN_COL_WIDTH);
  const tableRef = useRef<any>();

  // const handleUpdateAttribute = (id: string) => {
  //   pushTo(`${activePath}/${id}`);
  // };
  // const handleDeleteAttribute = (id: string) => {
  //   confirmDelete(() => {
  //     deleteAttribute(id).then((isSuccess) => {
  //       if (isSuccess) {
  //         tableRef.current.reload();
  //       }
  //     });
  //   });
  // };

  const GeneralColumns: TableColumnItem<ProjectSpaceZone>[] = [
    {
      title: 'Room Size',
      dataIndex: 'size',
      width: 136,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: '5%',
    },
    {
      title: 'Sub-total',
      dataIndex: 'quantity',
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
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
    },
    {
      title: 'Areas',
      dataIndex: 'area_coumn',
      width: 150,
      sorter: {
        multiple: 2,
      },
    },
    {
      title: 'Room',
      dataIndex: 'room_column',
      width: 106,
      sorter: {
        multiple: 3,
      },
    },
    {
      title: 'Room ID',
      dataIndex: 'room_id_column',
      width: 106,
      sorter: {
        multiple: 4,
      },
    },
    ...GeneralColumns,
    {
      title: 'Action',
      dataIndex: 'id',
      align: 'center',
      width: '5%',
      render: (_v, record) => {
        return <ActionMenu handleUpdate={() => handleUpdateSpace(record)} />;
      },
    },
  ];

  const SubGeneralColumns: any = [
    {
      title: 'Room',
      dataIndex: 'room_name',
      width: 106,
    },
    {
      title: 'Room ID',
      dataIndex: 'room_id',
      width: 106,
    },
    ...GeneralColumns,
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];

  const AreaColumns: TableColumnItem<ProjectSpaceArea>[] = [
    {
      title: 'Zone',
      dataIndex: 'zone',
      width: MAIN_COL_WIDTH,
    },
    {
      title: 'Areas',
      dataIndex: 'name',
      width: 150,
      isExpandable: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    ...SubGeneralColumns,
  ];

  const RoomColumns: TableColumnItem<ProjectSpaceRoom>[] = [
    {
      title: 'Zone',
      dataIndex: 'zone',
      width: MAIN_COL_WIDTH,
    },
    {
      title: 'Areas',
      dataIndex: 'name',
      width: 150,
    },
    ...SubGeneralColumns,
  ];

  return (
    <>
      <CustomTable
        rightAction={<CustomPlusButton />}
        columns={ZoneColumns}
        ref={tableRef}
        fetchDataFunc={getProductAttributePagination}
        multiSort={{
          name: 'name_order',
          area_coumn: 'area_coumn_order',
          room_column: 'room_column_order',
          room_id_column: 'room_id_column_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: AreaColumns,
          childrenColumnName: 'subs',
          expandable: GetExpandableTableConfig({
            columns: RoomColumns,
            childrenColumnName: 'subs',
          }),
        })}
      />
    </>
  );
};

export default SpaceList;
