import { BodyText } from '@/components/Typography';
import React, { useRef } from 'react';
import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import { ReactComponent as MenuIcon } from '@/assets/icons/ic-menu.svg';
import { ReactComponent as GridIcon } from '@/assets/icons/ic-grid.svg';
import ActionButton from '@/components/Button/ActionButton';
import { useBoolean } from '@/helper/hook';
import { ActionMenu } from '@/components/Action';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { TableColumnItem } from '@/components/Table/types';
import { BasisConversionListResponse, SubBasisConversion } from '@/types';
import { confirmDelete } from '@/helper/common';
import { deleteConversionMiddleware, getProductBasisConversionPagination } from '@/services';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import CustomTable from '@/components/Table';
import cardStyles from '@/components/Product/styles/cardList.less';
import ProductCard from '@/components/Product/ProductCard';

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
  useAutoExpandNestedTableColumn(COL_WIDTH.zones);
  const tableRef = useRef<any>();
  const gridView = useBoolean();

  const handleUpdateConversion = (id: string) => {
    pushTo(PATH.updateConversions.replace(':id', id));
  };

  const handleDeleteConversion = (id: string) => {
    confirmDelete(() => {
      deleteConversionMiddleware(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const onShareCell =
    (type: 'main' | 'shared' = 'shared') =>
    () => ({
      colSpan: gridView.value ? (type === 'main' ? 6 : 0) : 1,
    });

  const MainColumns: TableColumnItem<BasisConversionListResponse>[] = [
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
      dataIndex: 'conversion_between',
      width: COL_WIDTH.areas,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Rooms',
      dataIndex: 'first_formula',
      width: COL_WIDTH.rooms,
      sorter: true,
    },
    {
      title: 'Image',
      dataIndex: 'second_formula',
      width: COL_WIDTH.image,
    },
    {
      title: 'Brand',
      dataIndex: 'second_formula',
      width: COL_WIDTH.brand,
    },
    {
      title: 'Collection',
      dataIndex: 'second_formula',
      width: COL_WIDTH.collection,
    },
    {
      title: 'Product',
      dataIndex: 'second_formula',
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (v, record) => {
        return (
          <ActionMenu
            handleUpdate={() => handleUpdateConversion(record.id)}
            handleDelete={() => handleDeleteConversion(record.id)}
          />
        );
      },
    },
  ];

  const SubColumns: TableColumnItem<SubBasisConversion>[] = [
    {
      title: 'Zones',
      dataIndex: 'name',
      noBoxShadow: true,
      width: COL_WIDTH.zones,
      onCell: onShareCell('main'),
    },
    {
      title: 'Areas',
      dataIndex: 'conversion_between',
      width: COL_WIDTH.areas,
      noBoxShadow: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
      onCell: onShareCell(),
    },
    {
      title: 'Rooms',
      dataIndex: 'first_formula',
      width: COL_WIDTH.rooms,
      noBoxShadow: true,
      onCell: onShareCell(),
    },
    {
      title: 'Image',
      dataIndex: 'second_formula',
      noBoxShadow: true,
      onCell: onShareCell(),
      width: COL_WIDTH.image,
    },
    {
      title: 'Brand',
      dataIndex: 'second_formula',
      noBoxShadow: true,
      width: COL_WIDTH.brand,
    },
    {
      title: 'Collection',
      dataIndex: 'second_formula',
      width: COL_WIDTH.collection,
      noBoxShadow: true,
    },
    {
      title: 'Product',
      dataIndex: 'second_formula',
      noBoxShadow: true,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: '5%',
      align: 'center',
      noBoxShadow: true,
      onCell: onShareCell(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      noBoxShadow: true,
      onCell: onShareCell(),
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
        fetchDataFunc={getProductBasisConversionPagination}
        multiSort={{
          name: 'conversion_group_order',
          conversion_between: 'conversion_between_order',
        }}
        expandableConfig={{
          columns: SubColumns,
          childrenColumnName: 'subs',
          gridView: gridView.value,
          renderSubContent: (data) => {
            if (!data?.subs) {
              return;
            }
            return (
              <div className={cardStyles.productCardContainer} style={{ padding: 16 }}>
                {data.subs.map((item) => (
                  <div className={cardStyles.productCardItemWrapper} key={item.id}>
                    <ProductCard product={item} hasBorder productPage="brand" />
                  </div>
                ))}
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default ProductConsidered;
