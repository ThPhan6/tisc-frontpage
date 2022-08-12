import ActionButton from '@/components/Button/ActionButton';
import { BodyText } from '@/components/Typography';
import React, { useRef, useState } from 'react';
import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as MaterialIcon } from '@/assets/icons/material-product-icon.svg';
import { ReactComponent as SpaceIcon } from '@/assets/icons/space-icon.svg';
import { ReactComponent as PrintIcon } from '@/assets/icons/print-icon.svg';
import CustomButton from '@/components/Button';
import styles from '../ProductSpecification/styles/index.less';
import CustomTable from '@/components/Table';
import { TableColumnItem } from '@/components/Table/types';
import {
  SpecifiedProductBrand,
  SpecifiedProductMaterial,
  SpecifiedProductSpace,
  SpecifyStatus,
} from '@/types';
import { getConsideredProducts } from '@/services';
import { ProductItem } from '@/features/product/types';
import cardStyles from '@/features/product/components/ProductCard.less';
import ProductCard from '@/features/product/components/ProductCard';
import { CustomDropDown } from '@/features/product/components';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';
import { ReactComponent as CancelIcon } from '@/assets/icons/ic-circle-cancel.svg';
import { ActionMenu } from '@/components/Action';
import { useParams } from 'umi';
import { showImageUrl } from '@/helper/utils';
import PDF from './PDF';

const COL_WIDTH_BRAND = {
  brand: 124,
  collection: 90,
  product: 75,
  option: 569,
  productId: 93,
  count: 67,
  status: 66,
};

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

const COL_WIDTH_SPACE = {
  zones: 164,
  areas: 88,
  room: 96,
  image: 65,
  brand: 88,
  product: 75,
  material: 115,
  description: 266,
  count: 63,
  status: 66,
};
type viewBy = 'brand' | 'material' | 'space' | 'pdf';
const ProductSpecification: React.FC = () => {
  const [viewBy, setViewBy] = useState<viewBy>('brand');
  const tableRef = useRef<any>();
  const params = useParams<{ id: string }>();
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
      dataIndex: 'collection',
      width: COL_WIDTH_BRAND.collection,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      width: COL_WIDTH_BRAND.product,
    },
    {
      title: 'Option/Variant',
      dataIndex: 'option',
      width: COL_WIDTH_BRAND.option,
    },
    {
      title: 'ProductID',
      dataIndex: 'prpoduct_id',
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
      dataIndex: 'status',
      width: COL_WIDTH_BRAND.status,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '5%',
      align: 'center',
    },
  ];

  const renderStatusDropdown = (v: any, record: any) => {
    const menuItems: ItemType[] = [
      {
        key: SpecifyStatus['Specified'],
        label: 'Re-specify',
        icon: <DispatchIcon style={{ width: 16, height: 16 }} />,
        onClick: () => {
          alert('Coming soon!');
        },
      },
      {
        key: SpecifyStatus.Canceled,
        label: 'Cancel',
        icon: <CancelIcon style={{ width: 16, height: 16 }} />,
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
        {record.status_name}
      </CustomDropDown>
    );
  };

  const renderActionCell = () => {
    return <ActionMenu />;
  };

  const CollectionColumns: TableColumnItem<ProductItem>[] = [
    {
      title: 'Collection',
      dataIndex: 'collection_name',
      width: COL_WIDTH_BRAND.collection,
    },

    {
      title: 'Product',
      dataIndex: 'product',
      width: COL_WIDTH_BRAND.product,
    },

    {
      title: 'Option/Variant',
      dataIndex: 'option',
      width: COL_WIDTH_BRAND.option,
    },

    {
      title: 'ProductID',
      width: COL_WIDTH_BRAND.productId,
      dataIndex: 'product_id',
    },
    {
      title: 'Count',
      width: COL_WIDTH_BRAND.count,
    },
    {
      title: 'Status',
      width: COL_WIDTH_BRAND.status,
      render: renderStatusDropdown,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      render: renderActionCell,
    },
  ];

  const renderGridContent = (products: ProductItem[]) => {
    if (!products) {
      return;
    }
    return (
      <div
        className={cardStyles.productCardContainer}
        style={{ padding: '16px 16px 8px', maxWidth: 'calc(83.33vw - 40px)' }}
      >
        {products.map((item, index: number) => (
          <div className={cardStyles.productCardItemWrapper} key={index}>
            <ProductCard
              product={item}
              hasBorder
              hideFavorite
              hideAssign
              showInquiryRequest
              showSpecify
            />
          </div>
        ))}
      </div>
    );
  };

  const MaterialColumns: TableColumnItem<SpecifiedProductMaterial>[] = [
    {
      title: 'Material',
      dataIndex: 'name',
      sorter: true,
      width: COL_WIDTH_MATERIAL.material,
      render: (value, record) => <span>{record.name}</span>,
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
    },
    {
      title: 'Brand',
      dataIndex: 'brand_name',
      width: COL_WIDTH_MATERIAL.brand,
      sorter: true,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      width: COL_WIDTH_MATERIAL.product,
    },
    {
      title: 'Quantitis',
      dataIndex: 'quantity',
      width: COL_WIDTH_MATERIAL.quantity,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      width: COL_WIDTH_MATERIAL.unit,
    },
    {
      title: 'Order Method',
      dataIndex: 'method',
      width: COL_WIDTH_MATERIAL.method,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: COL_WIDTH_MATERIAL.status,
      align: 'center',
      render: renderStatusDropdown,
    },
  ];

  const SpaceColumns: TableColumnItem<SpecifiedProductSpace>[] = [
    {
      title: 'Zones',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: COL_WIDTH_SPACE.zones,
      isExpandable: true,
      render: (value, record) => <span className="text-uppercase">{record.name}</span>,
    },
    {
      title: 'Areas',
      dataIndex: 'area',
      sorter: {
        multiple: 2,
      },
      width: COL_WIDTH_SPACE.areas,
    },
    {
      title: 'Rooms',
      dataIndex: 'rooms',
      width: COL_WIDTH_SPACE.room,
      sorter: {
        multiple: 4,
      },
    },
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
      dataIndex: 'brand',
      width: COL_WIDTH_SPACE.brand,
      sorter: {
        multiple: 4,
      },
    },
    {
      title: 'Product',
      dataIndex: 'products',
      width: COL_WIDTH_SPACE.product,
    },
    {
      title: 'Material Code',
      dataIndex: 'material',
      width: COL_WIDTH_SPACE.product,
    },
    {
      title: 'Desciption',
      dataIndex: 'description',
      width: COL_WIDTH_SPACE.product,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: COL_WIDTH_SPACE.count,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: COL_WIDTH_SPACE.status,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      render: renderActionCell,
    },
  ];

  const filteredColumns = (cols: TableColumnItem<any>[]) =>
    cols.filter((el) => Boolean(el.hidden) === false);

  return (
    <div>
      <ProjectTabContentHeader>
        <BodyText
          level={4}
          fontFamily="Cormorant-Garamond"
          color="mono-color"
          style={{ fontWeight: '600' }}
        >
          View By:
        </BodyText>
        <ActionButton
          active={viewBy === 'brand'}
          icon={<BrandIcon />}
          onClick={() => setViewBy('brand')}
          title="Brand"
        />
        <ActionButton
          active={viewBy === 'material'}
          icon={<MaterialIcon />}
          onClick={() => setViewBy('material')}
          title="Material"
        />
        <ActionButton
          active={viewBy === 'space'}
          icon={<SpaceIcon />}
          onClick={() => setViewBy('space')}
          title="Space"
        />
        <CustomButton
          properties="rounded"
          size="small"
          variant="secondary"
          buttonClass={styles.button}
          onClick={() => setViewBy('pdf')}
        >
          <PrintIcon />
          PDF
        </CustomButton>
      </ProjectTabContentHeader>
      {viewBy !== 'pdf' ? (
        <CustomTable
          columns={
            viewBy === 'brand'
              ? filteredColumns(BrandColumns)
              : viewBy === 'material'
              ? filteredColumns(MaterialColumns)
              : viewBy === 'space'
              ? filteredColumns(SpaceColumns)
              : []
          }
          ref={tableRef}
          hasPagination={false}
          multiSort={{
            brand_order: 'brand_order',
            zone_order: 'zone_order',
            area_order: 'area_order',
            room_order: 'room_order',
            material_order: 'material_order',
          }}
          extraParams={{ projectId: params.id }}
          fetchDataFunc={getConsideredProducts}
          expandableConfig={{
            columns: filteredColumns(CollectionColumns),
            childrenColumnName: 'collection',
            level: 2,
            gridView: viewBy,
            gridViewContentIndex: 'collection',
            renderGridContent,
          }}
        />
      ) : (
        <PDF />
      )}
    </div>
  );
};

export default ProductSpecification;
