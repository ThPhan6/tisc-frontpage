import React, { useRef } from 'react';

import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useParams } from 'umi';

import { ReactComponent as GridIcon } from '@/assets/icons/ic-grid.svg';
import { ReactComponent as MenuIcon } from '@/assets/icons/ic-menu.svg';
import { ReactComponent as CancelIcon } from '@/assets/icons/ic-square-cancel.svg';
import { ReactComponent as CheckIcon } from '@/assets/icons/ic-square-check.svg';

import { useSpecifyingModal } from '../../hooks';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import {
  getConsideredProducts,
  removeProductFromProject,
  updateProductConsiderStatus,
} from '@/features/project/services';
import { confirmDelete } from '@/helper/common';
import { useBoolean } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { ProductItem } from '@/features/product/types';
import {
  AssigningStatus,
  ConsideredProduct,
  ConsideredProjectArea,
  ConsideredProjectRoom,
} from '@/features/project/types';

import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import ActionButton from '@/components/Button/ActionButton';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';
import { BodyText } from '@/components/Typography';
import { CustomDropDown } from '@/features/product/components';
import ProductCard from '@/features/product/components/ProductCard';
import cardStyles from '@/features/product/components/ProductCard.less';

const COL_WIDTH = {
  zones: 165,
  areas: 88,
  rooms: 96,
  image: 65,
  brand: 100,
  collection: 128,
  product: 171,
  assignedBy: 169,
  status: 130,
};

const ProductConsidered: React.FC = () => {
  useAutoExpandNestedTableColumn(3, {
    autoWidthColIndex: 6, // Product column
    rightColumnExcluded: 3,
  });

  const params = useParams<{ id: string }>();
  const tableRef = useRef<any>();
  const gridView = useBoolean();
  const { setSpecifyingProduct, renderSpecifyingModal } = useSpecifyingModal(tableRef);

  const renderStatusDropdown = (_value: any, record: any) => {
    if (record.rooms) {
      return null;
    }

    const menuItems: ItemType[] = [
      {
        key: AssigningStatus['Re-considered'],
        label: 'Re-consider',
        icon: <CheckIcon style={{ width: 16, height: 16 }} />,
        disabled: record.status !== AssigningStatus.Unlisted,
        onClick: () => {
          updateProductConsiderStatus(record.considered_id, {
            status: AssigningStatus['Re-considered'],
          }).then((success) => (success ? tableRef.current?.reload() : undefined));
        },
      },
      {
        key: AssigningStatus.Unlisted,
        label: 'Unlist',
        icon: <CancelIcon style={{ width: 16, height: 16 }} />,
        disabled: record.status === AssigningStatus.Unlisted,
        onClick: () => {
          updateProductConsiderStatus(record.considered_id, {
            status: AssigningStatus.Unlisted,
          }).then((success) => (success ? tableRef.current?.reload() : undefined));
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
        labelProps={{ className: 'flex-between' }}>
        {record.status_name}
      </CustomDropDown>
    );
  };

  const renderActionCell = (_value: any, record: any) => {
    if (record.rooms) {
      return null;
    }
    return (
      <ActionMenu
        actionItems={[
          {
            type: 'specify',
            disabled: record.status === AssigningStatus.Unlisted,
            onClick: () => setSpecifyingProduct(record),
          },
          {
            type: 'deleted',
            onClick: () =>
              confirmDelete(() => {
                removeProductFromProject(record.considered_id).then((success) =>
                  success ? tableRef.current?.reload() : undefined,
                );
              }),
          },
        ]}
      />
    );
  };

  const disabledClassname = gridView.value ? 'disabled' : undefined;

  const onCellUnlisted = (data: any) => ({
    className: data.status === AssigningStatus.Unlisted ? 'light-content' : undefined,
  });

  const getSameColumns = (noBoxShadow?: boolean) => {
    const SameColumn: TableColumnItem<any>[] = [
      {
        title: 'Image',
        dataIndex: 'image',
        width: COL_WIDTH.image,
        align: 'center',
        noBoxShadow: noBoxShadow,
        className: disabledClassname,
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
        width: COL_WIDTH.brand,
        noBoxShadow: noBoxShadow,
        className: disabledClassname,
        sorter: {
          multiple: 4,
        },
        render: (_value, record) => record.brand_name,
        onCell: onCellUnlisted,
      },
      {
        title: 'Collection',
        className: disabledClassname,
        dataIndex: 'collection_name',
        width: COL_WIDTH.collection,
        noBoxShadow: noBoxShadow,
        onCell: onCellUnlisted,
      },
    ];
    return SameColumn;
  };

  const ZoneColumns: TableColumnItem<ConsideredProduct>[] = [
    {
      title: 'Zones',
      dataIndex: 'zone_order',
      sorter: { multiple: 1 },
      width: COL_WIDTH.zones,
      isExpandable: true,
      render: (_value, record) => <span>{record.name}</span>,
    },
    {
      title: 'Areas',
      dataIndex: 'area_order',
      sorter: {
        multiple: 2,
      },
      width: COL_WIDTH.areas,
    },
    {
      title: 'Rooms',
      dataIndex: 'room_order',
      width: COL_WIDTH.rooms,
      sorter: {
        multiple: 4,
      },
    },
    ...getSameColumns(false),
    {
      title: 'Product',
      className: disabledClassname,
      width: COL_WIDTH.product,
    },
    {
      title: 'Assigned By',
      className: disabledClassname,
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Status',
      width: COL_WIDTH.status,
      hidden: gridView.value,
      align: 'center',
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      className: disabledClassname,
    },
  ];

  const AreaColumns: TableColumnItem<ConsideredProjectArea>[] = [
    {
      title: 'Zones',
      width: COL_WIDTH.zones,
      noBoxShadow: true,
      onCell: (data) => ({
        className: data.rooms ? '' : 'no-box-shadow',
      }),
    },
    {
      title: 'Areas',
      noExpandIfEmptyData: 'rooms',
      width: COL_WIDTH.areas,
      isExpandable: true,
      render: (_value, record) => <span>{record.name}</span>,
      onCell: (data) => ({
        className: data.rooms ? '' : 'no-box-shadow',
      }),
    },
    {
      title: 'Rooms',
      width: COL_WIDTH.rooms,
      onCell: (data) => ({
        className: data.rooms ? '' : 'no-box-shadow',
      }),
    },
    ...getSameColumns(false),
    {
      title: 'Product',
      width: COL_WIDTH.product,
      render: (_value, record) => (record.rooms ? null : record.name), // For Entire project
      onCell: onCellUnlisted,
    },
    {
      title: 'Assigned By',
      dataIndex: 'assigned_name',
      render: (value, record) => (record.rooms ? null : value), // For Entire project
      onCell: onCellUnlisted,
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Status',
      dataIndex: 'status_name',
      width: COL_WIDTH.status,
      hidden: gridView.value,
      render: renderStatusDropdown, // For Entire project
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      render: renderActionCell,
    },
  ];

  const RoomColumns: TableColumnItem<ConsideredProjectRoom>[] = [
    {
      title: 'Zones',
      width: COL_WIDTH.zones,
      noBoxShadow: true,
    },
    {
      title: 'Areas',
      width: COL_WIDTH.areas,
      noBoxShadow: true,
    },
    {
      title: 'Rooms',
      width: COL_WIDTH.rooms,
      isExpandable: true,
      render: (_value, record) => <span>{record.room_name}</span>,
    },
    ...getSameColumns(false),
    {
      title: 'Product',
      width: COL_WIDTH.product,
    },
    {
      title: 'Assigned By',
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Status',
      width: COL_WIDTH.status,
      hidden: gridView.value,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
    },
  ];

  const ProductColumns: TableColumnItem<ProductItem>[] = [
    {
      title: 'Zones',
      noBoxShadow: true,
      width: COL_WIDTH.zones,
      onCell: () => ({
        colSpan: gridView.value ? 9 : 1,
      }),
    },
    {
      title: 'Areas',
      width: COL_WIDTH.areas,
      noBoxShadow: true,
    },
    {
      title: 'Rooms',
      width: COL_WIDTH.rooms,
      noBoxShadow: true,
    },
    ...getSameColumns(true),
    {
      title: 'Product',
      dataIndex: 'name',
      width: COL_WIDTH.product,
      noBoxShadow: true,
      onCell: onCellUnlisted,
    },
    {
      title: 'Assigned By',
      dataIndex: 'assigned_name',
      noBoxShadow: true,
      onCell: onCellUnlisted,
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center', noBoxShadow: true },
    {
      title: 'Status',
      width: COL_WIDTH.status,
      hidden: gridView.value,
      noBoxShadow: true,
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

  const renderGridContent = (products: ProductItem[]) => {
    if (!products) {
      return;
    }
    return (
      <div
        className={cardStyles.productCardContainer}
        style={{ padding: '16px 16px 8px', maxWidth: 'calc(83.33vw - 40px)' }}>
        {products.map((item, index: number) => (
          <div className={cardStyles.productCardItemWrapper} key={index}>
            <ProductCard
              product={item}
              hasBorder
              hideFavorite
              hideAssign
              showInquiryRequest
              showSpecify
              onSpecifyClick={() => setSpecifyingProduct(item)}
            />
          </div>
        ))}
      </div>
    );
  };

  const filteredColumns = (cols: TableColumnItem<any>[]) =>
    cols.filter((el) => Boolean(el.hidden) === false);

  return (
    <div>
      <ProjectTabContentHeader>
        <BodyText
          level={4}
          fontFamily="Cormorant-Garamond"
          color="mono-color"
          style={{ fontWeight: '600', marginRight: 4 }}>
          View By:
        </BodyText>

        <ActionButton
          active={gridView.value === false}
          icon={<MenuIcon style={{ width: 13.33, height: 10 }} />}
          onClick={() => gridView.setValue(false)}
          title="List"
        />
        <ActionButton
          active={gridView.value}
          icon={<GridIcon style={{ width: 13.33, height: 13.33 }} />}
          onClick={() => gridView.setValue(true)}
          title="Card"
        />
      </ProjectTabContentHeader>

      <CustomTable
        columns={filteredColumns(ZoneColumns)}
        ref={tableRef}
        fetchDataFunc={getConsideredProducts}
        extraParams={{ projectId: params.id }}
        hasPagination={false}
        multiSort={{
          zone_order: 'zone_order',
          area_order: 'area_order',
          room_order: 'room_order',
          brand_order: 'brand_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: filteredColumns(AreaColumns),
          childrenColumnName: 'areas',
          subtituteChildrenColumnName: 'products',
          level: 2,

          gridView: gridView.value,
          gridViewContentIndex: 'products',
          renderGridContent,

          expandable: GetExpandableTableConfig({
            columns: filteredColumns(RoomColumns),
            childrenColumnName: 'rooms',
            level: 3,

            expandable: GetExpandableTableConfig({
              columns: filteredColumns(ProductColumns),
              childrenColumnName: 'products',
              level: 4,

              gridView: gridView.value,
              gridViewContentIndex: 'products',
              renderGridContent,
            }),
          }),
        })}
      />

      {renderSpecifyingModal()}
    </div>
  );
};

export default ProductConsidered;
