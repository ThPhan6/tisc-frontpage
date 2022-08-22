import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { TableColumnItem } from '@/components/Table/types';
import { getSpecifiedProductsByBrand } from '@/features/project/services';
import { FC, useRef } from 'react';
import { ProductItemBrand, SpecifiedProductByBrand } from '@/features/project/types';
import { showImageUrl } from '@/helper/utils';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import {
  onCellCancelled,
  renderActionCell,
  renderStatusDropdown,
  useSpecifyingModal,
} from '../../hooks';

const COL_WIDTH_BRAND = {
  brand: 124,
  collection: 143,
  productId: 93,
  status: 130,
};

interface BrandListProps {
  projectId?: string;
}

const SpecificationByBrand: FC<BrandListProps> = ({ projectId }) => {
  useAutoExpandNestedTableColumn(COL_WIDTH_BRAND.brand);
  const tableRef = useRef<any>();
  const { setSpecifyingProduct, renderSpecifyingModal } = useSpecifyingModal(tableRef);

  const BrandColumns: TableColumnItem<SpecifiedProductByBrand>[] = [
    {
      title: 'Brand',
      dataIndex: 'brand_order',
      sorter: true,
      width: COL_WIDTH_BRAND.brand,
      isExpandable: true,
      render: (value, record) => <span>{record.name}</span>,
    },
    {
      title: 'Collection',
      width: COL_WIDTH_BRAND.collection,
    },
    { title: 'Product' },
    { title: 'Option/Variant' },
    {
      title: 'Product ID',
      width: COL_WIDTH_BRAND.productId,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: '5%',
      align: 'center',
    },
    { title: 'Status', align: 'center', width: COL_WIDTH_BRAND.status },
    { title: 'Action', width: '5%', align: 'center' },
  ];

  const CollectionColumns: TableColumnItem<ProductItemBrand>[] = [
    {
      title: 'Brand',
      width: COL_WIDTH_BRAND.brand,
      noBoxShadow: true,
      dataIndex: 'image',
      align: 'right',
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
      title: 'Collection',
      dataIndex: 'collection_name',
      noBoxShadow: true,
      width: COL_WIDTH_BRAND.collection,
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
      width: COL_WIDTH_BRAND.productId,
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
      dataIndex: 'status',
      align: 'center',
      width: COL_WIDTH_BRAND.status,
      render: renderStatusDropdown(tableRef),
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
        columns={BrandColumns}
        extraParams={{ projectId }}
        ref={tableRef}
        hasPagination={false}
        multiSort={{
          brand_order: 'brand_order',
        }}
        fetchDataFunc={getSpecifiedProductsByBrand}
        expandable={GetExpandableTableConfig({
          columns: CollectionColumns,
          childrenColumnName: 'products',
          rowKey: 'specified_product_id',
        })}
      />

      {renderSpecifyingModal()}
    </>
  );
};

export default SpecificationByBrand;
