import { ActionMenu } from '@/components/Action';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { TableColumnItem } from '@/components/Table/types';
import { CustomDropDown } from '@/features/product/components';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';
import { ReactComponent as CancelIcon } from '@/assets/icons/ic-circle-cancel.svg';
import { getSpecifiedProductsByBrand } from '@/features/project/services';
import { FC, useEffect, useRef } from 'react';
import { ProductItemBrand, SpecifiedProductBrand, SpecifyStatus } from '@/features/project/types';
import { showImageUrl } from '@/helper/utils';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';

const COL_WIDTH_BRAND = {
  brand: 124,
  collection: 90,
  product: 75,
  option: 569,
  productId: 93,
  count: 67,
  status: 120,
};

interface BrandListProps {
  projectId?: string;
}

const BrandList: FC<BrandListProps> = ({ projectId }) => {
  useAutoExpandNestedTableColumn(COL_WIDTH_BRAND.brand);
  const tableRef = useRef<any>();
  const BrandColumns: TableColumnItem<SpecifiedProductBrand>[] = [
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
    {
      title: 'Product',
      width: COL_WIDTH_BRAND.product,
    },
    {
      title: 'Option/Variant',
      width: COL_WIDTH_BRAND.option,
    },
    {
      title: 'ProductID',
      width: COL_WIDTH_BRAND.productId,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Status',
      width: COL_WIDTH_BRAND.status,
      align: 'center',
    },
    {
      title: 'Action',
      width: '5%',
      align: 'center',
    },
  ];

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
    },
    {
      title: 'Product',
      dataIndex: 'name',
      noBoxShadow: true,
      width: COL_WIDTH_BRAND.product,
    },
    {
      title: 'Option/Variant',
      dataIndex: 'variant',
      noBoxShadow: true,
      width: COL_WIDTH_BRAND.option,
    },
    {
      title: 'ProductID',
      noBoxShadow: true,
      width: COL_WIDTH_BRAND.productId,
      dataIndex: 'product_id',
    },
    {
      title: 'Count',
      noBoxShadow: true,
      width: COL_WIDTH_BRAND.count,
    },
    {
      title: 'Status',
      noBoxShadow: true,
      dataIndex: 'status',
      width: COL_WIDTH_BRAND.status,
      align: 'center',
      render: renderStatusDropdown,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      noBoxShadow: true,
      render: renderActionCell,
    },
  ];

  useEffect(() => {
    tableRef.current.reload();
  }, []);

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
        })}
        onFilterLoad={false}
        autoLoad={false}
      />
    </>
  );
};

export default BrandList;
