import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { TableColumnItem } from '@/components/Table/types';
import { CustomDropDown } from '@/features/product/components';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';
import { ReactComponent as CancelIcon } from '@/assets/icons/ic-circle-cancel.svg';
import { FC, useEffect, useRef } from 'react';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { ActionMenu } from '@/components/Action';
import { showImageUrl } from '@/helper/utils';
import { getSpecifiedProductBySpace } from '@/features/project/services';
import {
  ProductItemSpace,
  SpecifiedProductArea,
  SpecifiedProductRoom,
  SpecifiedProductSpace,
  SpecifyStatus,
} from '@/features/project/types';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';

const COL_WIDTH_SPACE = {
  zones: 164,
  areas: 88,
  rooms: 96,
  image: 65,
  brand: 88,
  product: 75,
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

  const renderStatusDropdown = (_value: any, record: any) => {
    if (record.rooms) {
      return null;
    }

    const menuItems: ItemType[] = [
      {
        key: SpecifyStatus['Specified'],
        label: 'Re-specify',
        icon: <DispatchIcon style={{ width: 16, height: 16 }} />,
        disabled: record.status !== SpecifyStatus.Canceled,
        onClick: () => {
          alert('Coming soon!');
        },
      },
      {
        key: SpecifyStatus.Canceled,
        label: 'Cancel',
        icon: <CancelIcon style={{ width: 16, height: 16 }} />,
        disabled: record.status === SpecifyStatus.Canceled,
        onClick: () => {
          alert('Coming soon!');
        },
      },
    ];

    return (
      <CustomDropDown
        arrow
        alignRight={false}
        textCapitalize={false}
        items={menuItems}
        menuStyle={{ width: 160, height: 'auto' }}
        labelProps={{ className: 'flex-center' }}
      >
        {record.status === SpecifyStatus.Specified
          ? 'Specified'
          : record.status === SpecifyStatus['Re-specified']
          ? 'Re-specified'
          : record.status === SpecifyStatus.Canceled
          ? 'Canceled'
          : ''}
      </CustomDropDown>
    );
  };

  const renderActionCell = (_value: any, record: any) => {
    if (record.rooms) {
      return null;
    }
    return (
      <ActionMenu
        handleSpecify={() => alert('Coming soon!')}
        handleDelete={() => alert('Coming soon!')}
      />
    );
  };

  const SameColummnsSpace: TableColumnItem<any>[] = [
    {
      title: 'Image',
      dataIndex: 'image',
      width: COL_WIDTH_SPACE.image,
      align: 'center',
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
      title: 'Brand',
      dataIndex: 'brand_order',
      width: COL_WIDTH_SPACE.brand,
      sorter: {
        multiple: 4,
      },
      render: (_value, record) => record.brand_name,
    },
    {
      title: 'Product',
      dataIndex: 'product_id',
      width: COL_WIDTH_SPACE.product,
    },
    {
      title: 'Material Code',
      dataIndex: 'material_code',
      width: COL_WIDTH_SPACE.material,
    },
    {
      title: 'Desciption',
      dataIndex: 'description',
      width: COL_WIDTH_SPACE.description,
    },
  ];
  const ZoneColumns: TableColumnItem<SpecifiedProductSpace>[] = [
    {
      title: 'Zones',
      dataIndex: 'zone_order',
      sorter: {
        multiple: 1,
      },
      width: COL_WIDTH_SPACE.zones,
      isExpandable: true,
      render: (_value, record) => <span className="text-uppercase">{record.name}</span>,
    },
    {
      title: 'Areas',
      dataIndex: 'area_order',
      sorter: {
        multiple: 2,
      },
      width: COL_WIDTH_SPACE.areas,
    },
    {
      title: 'Rooms',
      dataIndex: 'room_order',
      width: COL_WIDTH_SPACE.rooms,
      sorter: {
        multiple: 4,
      },
    },
    ...SameColummnsSpace,
    {
      title: 'Count',
      dataIndex: 'count',
      width: '5%',
      align: 'center',
    },
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
    ...SameColummnsSpace,
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Status',
      dataIndex: 'status',
      width: COL_WIDTH_SPACE.status,
      align: 'center',
      render: renderStatusDropdown,
    },

    {
      title: 'Action',
      align: 'center',
      width: '5%',
      render: renderActionCell,
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
    ...SameColummnsSpace,
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
    },
    {
      title: 'Rooms',
      width: COL_WIDTH_SPACE.rooms,
    },
    ...SameColummnsSpace,
    { title: 'Count', width: '5%', align: 'center' },
    {
      title: 'Status',
      dataIndex: 'status',
      width: COL_WIDTH_SPACE.status,
      align: 'center',
      render: renderStatusDropdown,
    },

    {
      title: 'Action',
      align: 'center',
      width: '5%',
      render: renderActionCell,
    },
  ];

  useEffect(() => {
    tableRef.current.reload();
  }, []);

  return (
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
          }),
        }),
      }}
    />
  );
};
export default SpecificationBySpace;
