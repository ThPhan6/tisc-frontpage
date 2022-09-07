import { FC, useEffect, useRef } from 'react';

import {
  onCellCancelled,
  renderActionCell,
  renderStatusDropdown,
  useSpecifyingModal,
} from '../../hooks';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getSpecifiedProductBySpace } from '@/features/project/services';
import { showImageUrl } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import {
  ProductItemSpace,
  SpecifiedProductArea,
  SpecifiedProductBySpace,
  SpecifiedProductRoom,
} from '@/features/project/types';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';

const COL_WIDTH_SPACE = {
  zones: 165,
  areas: 88,
  rooms: 96,
  image: 65,
  brand: 180,
  product: 171,
  material: 115,
  description: 266,
  status: 130,
};

export interface SpaceListProps {
  projectId?: string;
}
const SpecificationBySpace: FC<SpaceListProps> = ({ projectId }) => {
  useAutoExpandNestedTableColumn(
    COL_WIDTH_SPACE.zones,
    COL_WIDTH_SPACE.areas,
    COL_WIDTH_SPACE.rooms,
  );
  const tableRef = useRef<any>();
  const { setSpecifyingProduct, renderSpecifyingModal } = useSpecifyingModal(tableRef);

  const getSameColumns = (noBoxShadow?: boolean) => {
    const SameColummnsSpace: TableColumnItem<any>[] = [
      {
        title: 'Image',
        dataIndex: 'image',
        width: COL_WIDTH_SPACE.image,
        noBoxShadow: noBoxShadow,
        align: 'center',
        render: (value) =>
          value ? (
            <img
              src={showImageUrl(value)}
              style={{ width: 24, height: 24, objectFit: 'contain' }}
            />
          ) : null,
      },
      {
        title: 'Brand',
        dataIndex: 'brand_order',
        width: COL_WIDTH_SPACE.brand,
        noBoxShadow: noBoxShadow,
        sorter: { multiple: 4 },
        render: (_value, record) => record.brand_name,
        onCell: onCellCancelled,
      },
      {
        title: 'Product',
        dataIndex: 'product_name',
        onCell: onCellCancelled,
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Material Code',
        dataIndex: 'material_code',
        width: COL_WIDTH_SPACE.material,
        noBoxShadow: noBoxShadow,
        onCell: onCellCancelled,
      },
      {
        title: 'Description',
        dataIndex: 'specified_description',
        width: COL_WIDTH_SPACE.description,
        noBoxShadow: noBoxShadow,
        onCell: onCellCancelled,
      },
    ];
    return SameColummnsSpace;
  };

  const ZoneColumns: TableColumnItem<SpecifiedProductBySpace>[] = [
    {
      title: 'Zones',
      dataIndex: 'zone_order',
      sorter: { multiple: 1 },
      width: COL_WIDTH_SPACE.zones,
      isExpandable: true,
      render: (_value, record) => <span className="text-uppercase">{record.name}</span>,
    },
    {
      title: 'Areas',
      dataIndex: 'area_order',
      sorter: { multiple: 2 },
      width: COL_WIDTH_SPACE.areas,
    },
    {
      title: 'Rooms',
      dataIndex: 'room_order',
      width: COL_WIDTH_SPACE.rooms,
      sorter: { multiple: 3 },
    },
    ...getSameColumns(false),
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Status',
      width: COL_WIDTH_SPACE.status,
      align: 'center',
    },
    { title: 'Action', align: 'center', width: '5%' },
  ];

  const AreaColumns: TableColumnItem<SpecifiedProductArea>[] = [
    {
      title: 'Zones',
      width: COL_WIDTH_SPACE.zones,
      noBoxShadow: true,
    },
    {
      title: 'Areas',
      noExpandIfEmptyData: 'rooms',
      width: COL_WIDTH_SPACE.areas,
      isExpandable: true,
      render: (_value, record) => <span className="text-uppercase">{record.name}</span>,
    },
    {
      title: 'Rooms',
      width: COL_WIDTH_SPACE.rooms,
    },
    ...getSameColumns(false),
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Status',
      dataIndex: 'status',
      width: COL_WIDTH_SPACE.status,
      align: 'center',
      render: renderStatusDropdown(tableRef, true),
      onCell: onCellCancelled,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      render: renderActionCell(setSpecifyingProduct, tableRef, true),
    },
  ];

  const RoomColumns: TableColumnItem<SpecifiedProductRoom>[] = [
    {
      title: 'Zones',
      width: COL_WIDTH_SPACE.zones,
      noBoxShadow: true,
    },
    {
      title: 'Areas',
      width: COL_WIDTH_SPACE.areas,
      noBoxShadow: true,
    },
    {
      title: 'Rooms',
      width: COL_WIDTH_SPACE.rooms,
      isExpandable: true,
      render: (_value, record) => <span className="text-uppercase">{record.room_name}</span>,
    },
    ...getSameColumns(false),
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Status',
      width: COL_WIDTH_SPACE.status,
      align: 'center',
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
    },
  ];

  const ProductColumns: TableColumnItem<ProductItemSpace>[] = [
    {
      title: 'Zones',
      noBoxShadow: true,
      width: COL_WIDTH_SPACE.zones,
    },
    {
      title: 'Areas',
      width: COL_WIDTH_SPACE.areas,
      noBoxShadow: true,
    },
    {
      title: 'Rooms',
      width: COL_WIDTH_SPACE.rooms,
      noBoxShadow: true,
    },
    ...getSameColumns(true),
    { title: 'Count', width: '5%', align: 'center', noBoxShadow: true },
    {
      title: 'Status',
      dataIndex: 'status',
      width: COL_WIDTH_SPACE.status,
      align: 'center',
      noBoxShadow: true,
      render: renderStatusDropdown(tableRef, true),
      onCell: onCellCancelled,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      noBoxShadow: true,
      render: renderActionCell(setSpecifyingProduct, tableRef, true),
    },
  ];

  useEffect(() => {
    tableRef.current.reload();
  }, []);

  return (
    <>
      <CustomTable
        columns={ZoneColumns}
        extraParams={{ projectId }}
        ref={tableRef}
        hasPagination={false}
        multiSort={{
          zone_order: 'zone_order',
          area_order: 'area_order',
          room_order: 'room_order',
          brand_order: 'brand_order',
        }}
        fetchDataFunc={getSpecifiedProductBySpace}
        expandableConfig={{
          columns: AreaColumns,
          childrenColumnName: 'areas',
          subtituteChildrenColumnName: 'products',
          level: 2,

          expandable: GetExpandableTableConfig({
            columns: RoomColumns,
            childrenColumnName: 'rooms',
            level: 3,

            expandable: GetExpandableTableConfig({
              columns: ProductColumns,
              childrenColumnName: 'products',
              level: 4,
              rowKey: 'specified_product_id',
            }),
          }),
        }}
      />
      {renderSpecifyingModal()}
    </>
  );
};
export default SpecificationBySpace;
