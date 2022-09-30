import { FC, useRef } from 'react';

import { useParams } from 'umi';

import {
  onCellCancelled,
  renderActionCell,
  renderStatusDropdown,
  useSpecifyingModal,
} from '../../hooks';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getSpecifiedProductByMaterial } from '@/features/project/services';
import { setDefaultWidthForEachColumn, showImageUrl } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { OrderMethod, SpecifiedProductByMaterial } from '@/features/project/types';

import CustomTable from '@/components/Table';

export const SpecificationByMaterial: FC = () => {
  useAutoExpandNestedTableColumn(0, { rightColumnExcluded: 1 });
  const tableRef = useRef<any>();
  const params = useParams<{ id: string }>();
  const { setSpecifyingProduct, renderSpecifyingModal } = useSpecifyingModal(tableRef);

  const MaterialColumns: TableColumnItem<SpecifiedProductByMaterial>[] = [
    {
      title: 'Material Code',
      dataIndex: 'material_order',
      sorter: true,
      render: (_value, record) => <span>{record.material_code}</span>,
      onCell: onCellCancelled,
    },
    {
      title: 'Description',
      dataIndex: 'specified_description',
      onCell: onCellCancelled,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      width: '5%',
      align: 'center',
      render: (value) => {
        if (value) {
          return (
            <img
              src={showImageUrl(value)}
              style={{ width: 24, height: 24, objectFit: 'contain' }}
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
      align: 'center',
      onCell: onCellCancelled,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      onCell: onCellCancelled,
    },
    {
      title: 'Order Method',
      dataIndex: 'order_method',
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
      width: '8%',
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
        columns={setDefaultWidthForEachColumn(MaterialColumns, 7)}
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
