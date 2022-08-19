import { ActionMenu } from '@/components/Action';
import CustomTable from '@/components/Table';
import { TableColumnItem } from '@/components/Table/types';
import { CustomDropDown } from '@/features/product/components';
import { OrderMethod, SpecifiedProductMaterial, SpecifyStatus } from '@/features/project/types';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { FC, useRef } from 'react';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';
import { ReactComponent as CancelIcon } from '@/assets/icons/ic-circle-cancel.svg';
import { showImageUrl } from '@/helper/utils';
import { getSpecifiedProductByMaterial } from '@/features/project/services';
import { useParams } from 'umi';

const COL_WIDTH_MATERIAL = {
  material: 141,
  description: 223,
  image: 65,
  brand: 98,
  product: 231,
  quantity: 91,
  unit: 52,
  method: 125,
  status: 120,
};

export const SpecificationByMaterial: FC = () => {
  const tableRef = useRef<any>();
  const params = useParams<{ id: string }>();

  const renderStatusDropdown = (_value: any, record: any) => {
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
          : 'Canceled'}
      </CustomDropDown>
    );
  };

  const renderActionCell = () => {
    return (
      <ActionMenu
        handleUpdate={() => alert('Coming soon!')}
        handleDelete={() => alert('Coming soon!')}
      />
    );
  };

  const MaterialColumns: TableColumnItem<SpecifiedProductMaterial>[] = [
    {
      title: 'Material',
      dataIndex: 'material_order',
      sorter: true,
      width: COL_WIDTH_MATERIAL.material,
      render: (_value, record) => <span>{record.material_code}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: COL_WIDTH_MATERIAL.description,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      width: COL_WIDTH_MATERIAL.image,
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
      width: COL_WIDTH_MATERIAL.brand,
      sorter: true,
      render: (_value, record) => <span>{record.brand_name}</span>,
    },
    {
      title: 'Product',
      dataIndex: 'product_name',
      width: COL_WIDTH_MATERIAL.product,
    },
    {
      title: 'Quantitis',
      dataIndex: 'quantity',
      width: COL_WIDTH_MATERIAL.quantity,
      align: 'center',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      width: COL_WIDTH_MATERIAL.unit,
    },
    {
      title: 'Order Method',
      dataIndex: 'order_method',
      width: COL_WIDTH_MATERIAL.method,
      render: (_value, record) => (
        <span>
          {record.order_method === OrderMethod['Direct Purchase']
            ? 'Direct Purchase'
            : 'Custom Order'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: COL_WIDTH_MATERIAL.status,
      align: 'center',
      render: renderStatusDropdown,
    },
    {
      title: 'Action',
      width: '5%',
      align: 'center',
      render: renderActionCell,
    },
  ];

  return (
    <CustomTable
      columns={MaterialColumns}
      ref={tableRef}
      hasPagination={false}
      multiSort={{
        brand_order: 'brand_order',
        material_order: 'material_order',
      }}
      extraParams={{ projectId: params.id }}
      fetchDataFunc={getSpecifiedProductByMaterial}
    />
  );
};
