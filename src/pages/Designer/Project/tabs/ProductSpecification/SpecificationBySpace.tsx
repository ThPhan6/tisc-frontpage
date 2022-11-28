import { FC, useEffect, useRef, useState } from 'react';

import { COLUMN_WIDTH } from '@/constants/util';

import { ReactComponent as InfoIcon } from '@/assets/icons/warning-circle-icon.svg';

import {
  onCellCancelled,
  renderActionCell,
  renderAvailability,
  renderSpecifiedStatusDropdown,
  useSpecifyingModal,
} from '../../hooks';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getSpecifiedProductBySpace } from '@/features/project/services';
import { setDefaultWidthForEachColumn, showImageUrl } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { SpecifiedProductBySpace } from '@/features/project/types';

import { AvailabilityModal } from '../../components/AvailabilityModal';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { RobotoBodyText } from '@/components/Typography';

export interface SpaceListProps {
  projectId?: string;
}
const SpecificationBySpace: FC<SpaceListProps> = ({ projectId }) => {
  useAutoExpandNestedTableColumn(3, {
    rightColumnExcluded: 4,
  });
  const tableRef = useRef<any>();
  const [visible, setVisible] = useState<boolean>(false);

  const { setSpecifyingProduct, renderSpecifyingModal } = useSpecifyingModal(tableRef);

  const getSameColumns = (noBoxShadow: boolean, hideProductName?: boolean) => {
    const SameColummnsSpace: TableColumnItem<any>[] = [
      {
        title: 'Image',
        dataIndex: 'images',
        width: '5%',
        noBoxShadow: noBoxShadow,
        align: 'center',
        render: (value) =>
          value ? (
            <img
              src={showImageUrl(value[0])}
              style={{ width: 24, height: 24, objectFit: 'contain' }}
            />
          ) : null,
      },
      {
        title: 'Brand',
        dataIndex: 'brand_order',
        noBoxShadow: noBoxShadow,
        sorter: { multiple: 4 },
        render: (_value, record) => record.brand?.name,
        onCell: onCellCancelled,
      },
      {
        title: 'Product',
        dataIndex: 'product_name',
        onCell: onCellCancelled,
        noBoxShadow: noBoxShadow,
        render: (_value, record) => (record.rooms || hideProductName ? null : record.name),
      },
      {
        title: 'Material Code',
        dataIndex: 'material_code',
        noBoxShadow: noBoxShadow,
        onCell: onCellCancelled,
        render: (_value, record) => record.specifiedDetail?.material_code,
      },
      {
        title: 'Description',
        dataIndex: 'specified_description',
        noBoxShadow: noBoxShadow,
        onCell: onCellCancelled,
        render: (_value, record) => record.specifiedDetail?.description,
      },
    ];
    return SameColummnsSpace;
  };

  const ZoneColumns: TableColumnItem<SpecifiedProductBySpace>[] = [
    {
      title: 'Zones',
      dataIndex: 'zone_order',
      sorter: { multiple: 1 },
      isExpandable: true,
      render: (_value, record) => <span className="text-uppercase">{record.name}</span>,
    },
    {
      title: 'Areas',
      dataIndex: 'area_order',
      sorter: { multiple: 2 },
    },
    {
      title: 'Rooms',
      dataIndex: 'room_order',
      sorter: { multiple: 3 },
    },
    ...getSameColumns(false, true),
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: (
        <div className="flex-start">
          <RobotoBodyText level={5} style={{ fontWeight: 500 }}>
            Availability
          </RobotoBodyText>
          <InfoIcon style={{ cursor: 'pointer' }} onClick={() => setVisible(true)} />
        </div>
      ),
      dataIndex: 'availability',
      align: 'center',
      noBoxShadow: true,
    },
    {
      title: 'Status',
      width: COLUMN_WIDTH.status,
      align: 'center',
    },
    { title: 'Action', align: 'center', width: '5%' },
  ];

  const AreaColumns: TableColumnItem<any>[] = [
    {
      title: 'Zones',
      noBoxShadow: true,
      onCell: (data) => ({
        className: data.rooms ? '' : 'no-box-shadow',
      }),
    },
    {
      title: 'Areas',
      noExpandIfEmptyData: 'rooms',
      isExpandable: true,
      render: (_value, record) => <span className="text-uppercase">{record.name}</span>,
      onCell: (data) => ({
        className: data.rooms ? '' : 'no-box-shadow',
      }),
    },
    {
      title: 'Rooms',
      onCell: (data) => ({
        className: data.rooms ? '' : 'no-box-shadow',
      }),
    },
    ...getSameColumns(false),
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Availability',
      dataIndex: 'availability',
      align: 'center',
      width: '5%',
      render: (_value, record) => renderAvailability(record),
    },
    {
      title: 'Status',
      width: COLUMN_WIDTH.status,
      dataIndex: 'status',
      align: 'center',
      render: renderSpecifiedStatusDropdown(tableRef, true),
      onCell: onCellCancelled,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      render: renderActionCell(setSpecifyingProduct, tableRef, true),
    },
  ];

  const RoomColumns: TableColumnItem<any>[] = [
    {
      title: 'Zones',
      noBoxShadow: true,
    },
    {
      title: 'Areas',
      noBoxShadow: true,
    },
    {
      title: 'Rooms',
      isExpandable: true,
      render: (_value, record) => <span className="text-uppercase">{record.room_name}</span>,
    },
    ...getSameColumns(false),
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Availability',
      dataIndex: 'availability',
      align: 'center',
      width: '5%',
    },
    {
      title: 'Status',
      width: COLUMN_WIDTH.status,
      align: 'center',
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
    },
  ];

  const ProductColumns: TableColumnItem<any>[] = [
    {
      title: 'Zones',
      noBoxShadow: true,
    },
    {
      title: 'Areas',
      noBoxShadow: true,
    },
    {
      title: 'Rooms',
      noBoxShadow: true,
    },
    ...getSameColumns(true),
    { title: 'Count', width: '5%', align: 'center', noBoxShadow: true },
    {
      title: 'Availability',
      dataIndex: 'availability',
      align: 'center',
      width: '5%',

      render: (_value, record) => renderAvailability(record),
    },
    {
      title: 'Status',
      width: COLUMN_WIDTH.status,
      dataIndex: 'status',
      align: 'center',
      noBoxShadow: true,
      render: renderSpecifiedStatusDropdown(tableRef, true),
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
        columns={setDefaultWidthForEachColumn(ZoneColumns, 7)}
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
          columns: setDefaultWidthForEachColumn(AreaColumns, 7),
          childrenColumnName: 'areas',
          subtituteChildrenColumnName: 'products',
          level: 2,

          expandable: GetExpandableTableConfig({
            columns: setDefaultWidthForEachColumn(RoomColumns, 7),
            childrenColumnName: 'rooms',
            level: 3,

            expandable: GetExpandableTableConfig({
              columns: setDefaultWidthForEachColumn(ProductColumns, 7),
              childrenColumnName: 'products',
              level: 4,
              rowKey: 'specified_product_id',
            }),
          }),
        }}
      />
      {renderSpecifyingModal()}

      <AvailabilityModal visible={visible} setVisible={setVisible} />
    </>
  );
};
export default SpecificationBySpace;
