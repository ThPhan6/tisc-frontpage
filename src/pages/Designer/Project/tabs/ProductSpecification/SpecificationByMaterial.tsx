import CustomTable from '@/components/Table';
import { TableColumnItem } from '@/components/Table/types';
import { OrderMethod, SpecifiedProductByMaterial } from '@/features/project/types';
import { FC, useRef } from 'react';
import { showImageUrl } from '@/helper/utils';
import { getSpecifiedProductByMaterial } from '@/features/project/services';
import { useParams } from 'umi';
import {
  onCellCancelled,
  renderActionCell,
  renderStatusDropdown,
  useSpecifyingModal,
} from '../../hooks';

const COL_WIDTH_MATERIAL = {
  material: 141,
  image: 65,
  quantity: 91,
  unit: 52,
  method: 125,
  status: 130,
};

export const SpecificationByMaterial: FC = () => {
  const tableRef = useRef<any>();
  const params = useParams<{ id: string }>();
  const { setSpecifyingProduct, renderSpecifyingModal } = useSpecifyingModal(tableRef);

  const MaterialColumns: TableColumnItem<SpecifiedProductByMaterial>[] = [
    {
      title: 'Material Code',
      dataIndex: 'material_order',
      sorter: true,
      width: COL_WIDTH_MATERIAL.material,
      render: (_value, record) => <span>{record.material_code}</span>,
      onCell: onCellCancelled,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      onCell: onCellCancelled,
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
      sorter: true,
      render: (_value, record) => <span>{record.brand_name}</span>,
      onCell: onCellCancelled,
    },
    {
      title: 'Product',
      dataIndex: 'product_name',
      onCell: onCellCancelled,
    },
    {
      title: 'Quantities',
      dataIndex: 'quantity',
      width: COL_WIDTH_MATERIAL.quantity,
      align: 'center',
      onCell: onCellCancelled,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      width: COL_WIDTH_MATERIAL.unit,
      onCell: onCellCancelled,
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
      onCell: onCellCancelled,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: COL_WIDTH_MATERIAL.status,
      render: renderStatusDropdown(tableRef),
      onCell: onCellCancelled,
    },
    {
      title: 'Action',
      width: '5%',
      align: 'center',
      render: renderActionCell(setSpecifyingProduct, tableRef),
    },
  ];

  return (
    <>
      <CustomTable
        columns={MaterialColumns}
        rowKey="specified_product_id"
        ref={tableRef}
        hasPagination={false}
        multiSort={{
          brand_order: 'brand_order',
          material_order: 'material_order',
        }}
        extraParams={{ projectId: params.id }}
        fetchDataFunc={getSpecifiedProductByMaterial}
      />
      {renderSpecifyingModal()}
    </>
  );
};
