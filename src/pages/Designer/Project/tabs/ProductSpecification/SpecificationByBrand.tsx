import { FC, useRef } from 'react';

import { COLUMN_WIDTH } from '@/constants/util';

import {
  onCellCancelled,
  renderActionCell,
  renderSpecifiedStatusDropdown,
  useSpecifyingModal,
} from '../../hooks';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getSpecifiedProductsByBrand } from '@/features/project/services';
import { setDefaultWidthForEachColumn, showImageUrl } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { ProjectProductItem } from '@/features/product/types';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';

interface BrandListProps {
  projectId?: string;
}

const SpecificationByBrand: FC<BrandListProps> = ({ projectId }) => {
  useAutoExpandNestedTableColumn(1, {
    rightColumnExcluded: 3,
  });
  const tableRef = useRef<any>();
  const { setSpecifyingProduct, renderSpecifyingModal } = useSpecifyingModal(tableRef, true);

  const BrandColumns: TableColumnItem<ProjectProductItem>[] = [
    {
      title: 'Brand',
      dataIndex: 'brand_order',
      sorter: true,
      isExpandable: true,
      render: (_value, record) => <span>{record.name}</span>,
    },
    {
      title: 'Collection',
    },
    {
      title: 'Product',
    },
    { title: 'Option/Variant' },
    {
      title: 'Product ID',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: '5%',
      align: 'center',
    },
    { title: 'Status', align: 'center', width: COLUMN_WIDTH.status },
    { title: 'Action', width: '5%', align: 'center' },
  ];

  const CollectionColumns: TableColumnItem<ProjectProductItem>[] = [
    {
      title: 'Brand',
      noBoxShadow: true,
      dataIndex: 'brand_logo',
      align: 'right',
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
      title: 'Collection',
      dataIndex: 'collection_name',
      noBoxShadow: true,
      onCell: onCellCancelled,
    },
    {
      title: 'Product',
      dataIndex: 'name',
      noBoxShadow: true,
      onCell: onCellCancelled,
    },
    {
      title: 'Option/Variant',
      dataIndex: 'variant',
      noBoxShadow: true,
      onCell: onCellCancelled,
    },
    {
      title: 'ProductID',
      noBoxShadow: true,
      dataIndex: 'product_id',
      onCell: onCellCancelled,
    },
    {
      title: 'Count',
      noBoxShadow: true,
      width: '5%',
    },
    {
      title: 'Status',
      noBoxShadow: true,
      dataIndex: 'specified_status',
      align: 'center',
      width: COLUMN_WIDTH.status,
      render: renderSpecifiedStatusDropdown(tableRef),
      onCell: onCellCancelled,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      noBoxShadow: true,
      render: renderActionCell(setSpecifyingProduct, tableRef),
    },
  ];

  return (
    <>
      <CustomTable
        columns={setDefaultWidthForEachColumn(BrandColumns, 4)}
        extraParams={{ projectId }}
        ref={tableRef}
        hasPagination={false}
        multiSort={{
          brand_order: 'brand_order',
        }}
        fetchDataFunc={getSpecifiedProductsByBrand}
        expandable={GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(CollectionColumns, 4),
          childrenColumnName: 'products',
          rowKey: 'specified_product_id',
          level: 2,
        })}
      />

      {renderSpecifyingModal()}
    </>
  );
};

export default SpecificationByBrand;
