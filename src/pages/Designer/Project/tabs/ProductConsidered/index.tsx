import { BodyText } from '@/components/Typography';
import React, { useRef } from 'react';
import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import { ReactComponent as MenuIcon } from '@/assets/icons/ic-menu.svg';
import { ReactComponent as GridIcon } from '@/assets/icons/ic-grid.svg';
import ActionButton from '@/components/Button/ActionButton';
import { useBoolean } from '@/helper/hook';
import { ActionMenu } from '@/components/Action';
import { TableColumnItem } from '@/components/Table/types';
import { ConsideredProduct, ConsideredProjectArea, ConsideredProjectRoom } from '@/types';
import { getConsideredProducts } from '@/services';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { useParams } from 'umi';
import { showImageUrl } from '@/helper/utils';
import { ProductItem } from '@/features/product/types';
import cardStyles from '@/features/product/components/ProductCard.less';
import ProductCard from '@/features/product/components/ProductCard';

const COL_WIDTH = {
  zones: 165,
  areas: 88,
  rooms: 96,
  image: 65,
  brand: 180,
  collection: 128,
  product: 171,
};
const ProductConsidered: React.FC = () => {
  useAutoExpandNestedTableColumn(COL_WIDTH.zones, COL_WIDTH.areas);
  const tableRef = useRef<any>();
  const gridView = useBoolean();
  const params = useParams<{ id: string }>();

  // const handleUpdateConversion = (id: string) => {
  //   pushTo(PATH.updateConversions.replace(':id', id));
  // };

  // const handleDeleteConversion = (id: string) => {
  //   confirmDelete(() => {
  //     deleteConversionMiddleware(id).then((isSuccess) => {
  //       if (isSuccess) {
  //         tableRef.current.reload();
  //       }
  //     });
  //   });
  // };

  // const onShareCell =
  //   (type: 'main' | 'shared' = 'shared') =>
  //   () => ({
  //     colSpan: gridView.value ? (type === 'main' ? 6 : 0) : 1,
  //   });

  const SameColumn: TableColumnItem<any>[] = [
    {
      title: 'Image',
      dataIndex: 'image',
      width: COL_WIDTH.image,
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
      dataIndex: 'brand_name',
      width: COL_WIDTH.brand,
    },
    {
      title: 'Collection',
      dataIndex: 'collection_name',
      width: COL_WIDTH.collection,
    },
  ];

  const MainColumns: TableColumnItem<ConsideredProduct>[] = [
    {
      title: 'Zones',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: COL_WIDTH.zones,
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Areas',
      dataIndex: 'area_id',
      width: COL_WIDTH.areas,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Rooms',
      dataIndex: 'room_id',
      width: COL_WIDTH.rooms,
      sorter: true,
    },
    ...SameColumn,
    {
      title: 'Product',
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const SubColumns: TableColumnItem<ConsideredProjectArea>[] = [
    {
      title: 'Zones',
      dataIndex: 'zone_id',
      noBoxShadow: true,
      width: COL_WIDTH.zones,
      onCell: () => ({
        colSpan: gridView.value ? 6 : 1,
      }),
    },
    {
      title: 'Areas',
      dataIndex: 'name',
      width: COL_WIDTH.areas,
      isExpandable: true,
      noExpandIfEmptyData: 'rooms',
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: 'Rooms',
      width: COL_WIDTH.rooms,
    },
    ...SameColumn,
    {
      title: 'Product',
      dataIndex: 'name',
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (v, record) => {
        if (record.rooms) {
          return <div />;
        }
        return <ActionMenu handleSpecify={() => {}} handleDelete={() => {}} />;
      },
    },
  ];

  const SubSubColumns: TableColumnItem<ConsideredProjectRoom>[] = [
    {
      title: 'Zones',
      dataIndex: 'name',
      noBoxShadow: true,
      width: COL_WIDTH.zones,
    },
    {
      title: 'Areas',
      dataIndex: 'name',
      width: COL_WIDTH.areas,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: 'Rooms',
      dataIndex: 'room_id',
      width: COL_WIDTH.rooms,
      isExpandable: true,
    },
    ...SameColumn,
    {
      title: 'Product',
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const ChildColumns: TableColumnItem<ProductItem>[] = [
    {
      title: 'Zones',
      dataIndex: 'zone_id',
      noBoxShadow: true,
      width: COL_WIDTH.zones,
    },
    {
      title: 'Areas',
      dataIndex: 'area_id',
      width: COL_WIDTH.areas,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: 'Rooms',
      dataIndex: 'room_id',
      width: COL_WIDTH.rooms,
    },
    ...SameColumn,
    {
      title: 'Product',
      dataIndex: 'name',
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: () => {
        return <ActionMenu handleSpecify={() => {}} handleDelete={() => {}} />;
      },
    },
  ];

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
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getConsideredProducts}
        extraParams={{ projectId: params.id }}
        hasPagination={false}
        expandableConfig={{
          columns: SubColumns,
          childrenColumnName: 'areas',
          subtituteChildrenColumnName: 'products',
          gridView: gridView.value,
          level: 2,
          renderSubContent: (data) => {
            // console.log('data', data);
            if (!data?.products) {
              return;
            }
            return (
              <div
                className={cardStyles.productCardContainer}
                style={{ padding: 16, maxWidth: 'calc(100vw - 255px)' }}
              >
                {data.products.map((item: any, index: number) => (
                  <div className={cardStyles.productCardItemWrapper} key={index}>
                    <ProductCard
                      product={{ ...item, images: [item.image] }}
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
          },

          expandable: GetExpandableTableConfig({
            columns: SubSubColumns,
            childrenColumnName: 'rooms',
            level: 3,
            expandable: GetExpandableTableConfig({
              columns: ChildColumns,
              childrenColumnName: 'products',
            }),
          }),
        }}
      />
    </div>
  );
};

export default ProductConsidered;
