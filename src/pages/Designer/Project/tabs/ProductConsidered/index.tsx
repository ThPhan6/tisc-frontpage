import React, { useRef, useState } from 'react';

import { COLUMN_WIDTH } from '@/constants/util';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useParams } from 'umi';

import { ReactComponent as GridIcon } from '@/assets/icons/ic-grid.svg';
import { ReactComponent as MenuIcon } from '@/assets/icons/ic-menu.svg';
import { ReactComponent as CancelIcon } from '@/assets/icons/ic-square-cancel.svg';
import { ReactComponent as CheckIcon } from '@/assets/icons/ic-square-check.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/warning-circle-icon.svg';

import {
  onCellUnlisted,
  onOpenSpecifiyingProductModal,
  renderAvailability,
  renderImage,
  useSpecifyingModal,
} from '../../hooks';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import {
  getConsideredProducts,
  removeProductFromProject,
  updateProductConsiderStatus,
} from '@/features/project/services';
import { confirmDelete } from '@/helper/common';
import { useBoolean } from '@/helper/hook';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { ProductItem, ProjectProductItem } from '@/features/product/types';
import {
  ConsideredProduct,
  ConsideredProjectRoom,
  ProductConsiderStatus,
} from '@/features/project/types';

import { AvailabilityModal } from '../../components/AvailabilityModal';
import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import ActionButton from '@/components/Button/ActionButton';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';
import { BodyText, RobotoBodyText } from '@/components/Typography';
import { CustomDropDown } from '@/features/product/components';
import ProductCard from '@/features/product/components/ProductCard';
import cardStyles from '@/features/product/components/ProductCard.less';

import styles from './index.less';

const ProductConsidered: React.FC = () => {
  useAutoExpandNestedTableColumn(3, [7]);

  const [visible, setVisible] = useState<boolean>(false);

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
        key: ProductConsiderStatus['Re-considered'],
        label: 'Re-consider',
        icon: <CheckIcon style={{ width: 16, height: 16 }} />,
        disabled: record.specifiedDetail?.consider_status !== ProductConsiderStatus.Unlisted,
        onClick: () => {
          if (record.specifiedDetail?.consider_status !== ProductConsiderStatus.Unlisted) {
            return;
          }
          updateProductConsiderStatus(record.specifiedDetail?.id, {
            consider_status: ProductConsiderStatus['Re-considered'],
          }).then((success) => (success ? tableRef.current?.reload() : undefined));
        },
      },
      {
        key: ProductConsiderStatus.Unlisted,
        label: 'Unlist',
        icon: <CancelIcon style={{ width: 16, height: 16 }} />,
        disabled: record.specifiedDetail?.consider_status === ProductConsiderStatus.Unlisted,
        onClick: () => {
          if (record.specifiedDetail?.consider_status === ProductConsiderStatus.Unlisted) {
            return;
          }
          updateProductConsiderStatus(record.specifiedDetail?.id, {
            consider_status: ProductConsiderStatus.Unlisted,
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
        labelProps={{ className: 'flex-between' }}
      >
        {ProductConsiderStatus[record.specifiedDetail.consider_status]}
      </CustomDropDown>
    );
  };

  const renderActionCell = (_value: any, record: ProjectProductItem) => {
    if (record.rooms) {
      return null;
    }
    return (
      <ActionMenu
        editActionOnMobile={false}
        actionItems={[
          {
            type: 'specify',
            disabled: record.specifiedDetail?.consider_status === ProductConsiderStatus.Unlisted,
            onClick: () => {
              setSpecifyingProduct(record);
              onOpenSpecifiyingProductModal(record);
            },
          },
          {
            type: 'deleted',
            onClick: () =>
              confirmDelete(() => {
                removeProductFromProject(record.specifiedDetail?.id ?? '').then((success) =>
                  success ? tableRef.current?.reload() : undefined,
                );
              }),
          },
        ]}
      />
    );
  };

  const disabledClassname = gridView.value ? 'disabled' : undefined;

  const getSameColumns = (props: { noBoxShadow?: boolean; isAreaColumn?: boolean }) => {
    const SameColumn: TableColumnItem<any>[] = [
      {
        title: 'Image',
        dataIndex: 'images',
        width: '5%',
        align: 'center',
        noBoxShadow: props.noBoxShadow,
        className: disabledClassname,
        render: (value) => renderImage(value?.[0]),
        onCell: props.isAreaColumn ? onCellUnlisted : undefined,
      },
      {
        title: 'Brand',
        dataIndex: 'brand_order',
        noBoxShadow: props.noBoxShadow,
        className: disabledClassname,
        sorter: {
          multiple: 4,
        },
        render: (_value, record) => record.brand?.name,
        onCell: onCellUnlisted,
      },
      {
        title: 'Collection',
        className: disabledClassname,
        noBoxShadow: props.noBoxShadow,
        render: (_value, record) => record.collection?.name,
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
      isExpandable: true,
      render: (_value, record) => <span>{record.name}</span>,
    },
    {
      title: 'Areas',
      dataIndex: 'area_order',
      sorter: {
        multiple: 2,
      },
    },
    {
      title: 'Rooms',
      dataIndex: 'room_order',
      sorter: {
        multiple: 4,
      },
    },
    ...getSameColumns({ noBoxShadow: false }),
    {
      title: 'Product',
      className: disabledClassname,
    },
    {
      title: 'Assigned By',
      className: disabledClassname,
    },
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
      className: disabledClassname,
    },
    {
      title: 'Status',
      width: COLUMN_WIDTH.status,
      hidden: gridView.value,
      align: 'center',
      className: disabledClassname,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      className: disabledClassname,
    },
  ];

  const AreaColumns: TableColumnItem<any>[] = [
    {
      title: 'Zones',
      noBoxShadow: true,
      onCell: onCellUnlisted,
    },
    {
      title: 'Areas',
      noExpandIfEmptyData: 'rooms',
      isExpandable: true,
      render: (_value, record) => <span>{record.name}</span>,
      onCell: onCellUnlisted,
    },
    {
      title: 'Rooms',
      onCell: onCellUnlisted,
    },
    ...getSameColumns({
      noBoxShadow: false,
      isAreaColumn: true,
    }),
    {
      title: 'Product',
      render: (_value, record) => (record.rooms ? null : record.name), // For Entire project
      onCell: onCellUnlisted,
    },
    {
      title: 'Assigned By',
      dataIndex: 'assigned_name',
      render: (value, record) => (record.rooms ? null : value), // For Entire project
      onCell: onCellUnlisted,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: '5%',
      align: 'center',
      onCell: onCellUnlisted,
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      align: 'center',
      width: '5%',
      render: (_value, record) => renderAvailability(record),
      onCell: onCellUnlisted,
    },
    {
      title: 'Status',
      width: COLUMN_WIDTH.status,
      dataIndex: 'status_name',
      hidden: gridView.value,
      render: renderStatusDropdown, // For Entire project
      onCell: onCellUnlisted,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      render: renderActionCell,
      onCell: onCellUnlisted,
    },
  ];

  const RoomColumns: TableColumnItem<ConsideredProjectRoom>[] = [
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
      render: (_value, record) => <span>{record.room_name}</span>,
    },
    ...getSameColumns({ noBoxShadow: false }),
    {
      title: 'Product',
    },
    {
      title: 'Assigned By',
    },
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
      onCell: () => ({
        colSpan: gridView.value ? 9 : 1,
      }),
    },
    {
      title: 'Areas',
      noBoxShadow: true,
    },
    {
      title: 'Rooms',
      noBoxShadow: true,
    },
    ...getSameColumns({ noBoxShadow: true }),
    {
      title: 'Product',
      dataIndex: 'name',
      noBoxShadow: true,
      onCell: (data) => onCellUnlisted(data),
    },
    {
      title: 'Assigned By',
      dataIndex: 'assigned_name',
      noBoxShadow: true,
      onCell: (data) => onCellUnlisted(data),
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center', noBoxShadow: true },
    {
      title: 'Availability',
      dataIndex: 'availability',
      noBoxShadow: true,
      align: 'center',
      width: '5%',
      render: (_value, record) => renderAvailability(record),
    },

    {
      title: 'Status',
      width: COLUMN_WIDTH.status,
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
        style={{
          padding: '16px 16px 8px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 224px))',
        }}
      >
        {products.map((item, index: number) => (
          <ProductCard
            key={index}
            product={item}
            hasBorder
            hideFavorite
            hideAssign
            showInquiryRequest
            showSpecify
            onSpecifyClick={() => {
              setSpecifyingProduct(item);
              onOpenSpecifiyingProductModal(item);
            }}
            isCustomProduct={item.specifiedDetail?.custom_product}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div>
        <ProjectTabContentHeader>
          <BodyText
            level={4}
            fontFamily="Cormorant-Garamond"
            color="mono-color"
            style={{ fontWeight: '600', marginRight: 4 }}
          >
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
          footerClass={styles.summaryFooter}
          columns={setDefaultWidthForEachColumn(ZoneColumns, 7)}
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
            columns: setDefaultWidthForEachColumn(AreaColumns, 7),
            childrenColumnName: 'areas',
            subtituteChildrenColumnName: 'products',
            level: 2,

            gridView: gridView.value,
            gridViewContentIndex: 'products',
            renderGridContent,

            expandable: GetExpandableTableConfig({
              columns: setDefaultWidthForEachColumn(RoomColumns, 7),
              childrenColumnName: 'rooms',
              level: 3,

              expandable: GetExpandableTableConfig({
                columns: setDefaultWidthForEachColumn(ProductColumns, 7),
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

      <AvailabilityModal visible={visible} setVisible={setVisible} />
    </div>
  );
};

export default ProductConsidered;
