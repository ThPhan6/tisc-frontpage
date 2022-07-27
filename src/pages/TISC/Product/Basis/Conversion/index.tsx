import React, { useRef } from 'react';
import CustomTable from '@/components/Table';
import type { TableColumnItem } from '@/components/Table/types';
import { deleteConversionMiddleware, getProductBasisConversionPagination } from '@/services';
import type { BasisConversionListResponse, SubBasisConversion } from '@/types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { confirmDelete } from '@/helper/common';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { ActionMenu } from '@/components/Action';
import { Button } from 'antd';
import { useBoolean } from '@/helper/hook';
import ProductCard from '@/components/Product/ProductCard';
import cardStyles from '@/components/Product/styles/cardList.less';

const MAIN_COL_WIDTH = 167;

const BasisConversionList: React.FC = () => {
  const gridView = useBoolean();
  useAutoExpandNestedTableColumn(MAIN_COL_WIDTH);
  const tableRef = useRef<any>();

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

  const MainColumns: TableColumnItem<BasisConversionListResponse>[] = [
    {
      title: 'Conversion Group',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: MAIN_COL_WIDTH,
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Conversion Between',
      dataIndex: 'conversion_between',
      width: 200,
      sorter: {
        multiple: 2,
      },
    },
    {
      title: '1st Formula',
      dataIndex: 'first_formula',
      width: 200,
    },
    {
      title: '2nd Formula',
      dataIndex: 'second_formula',
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value, record) => {
        return (
          <ActionMenu
            handleUpdate={() => handleUpdateConversion(record.id)}
            handleDelete={() => handleDeleteConversion(record.id)}
          />
        );
      },
    },
  ];

  const onShareCell =
    (type: 'main' | 'shared' = 'shared') =>
    () => ({
      colSpan: gridView.value ? (type === 'main' ? 6 : 0) : 1,
    });

  const SubColumns: TableColumnItem<SubBasisConversion>[] = [
    {
      title: 'Conversion Group',
      dataIndex: 'name',
      noBoxShadow: true,
      width: MAIN_COL_WIDTH,
      onCell: onShareCell('main'),
    },
    {
      title: 'Conversion Between',
      dataIndex: 'conversion_between',
      width: 200,
      noBoxShadow: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
      onCell: onShareCell(),
    },
    {
      title: '1st Formula',
      dataIndex: 'first_formula',
      width: 200,
      noBoxShadow: true,
      onCell: onShareCell(),
    },
    {
      title: '2nd Formula',
      dataIndex: 'second_formula',
      noBoxShadow: true,
      onCell: onShareCell(),
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
    <>
      <CustomTable
        rightAction={
          <>
            <CustomPlusButton onClick={() => pushTo(PATH.createConversions)} />
            <Button onClick={() => gridView.setValue(false)}>List</Button>
            <Button onClick={() => gridView.setValue(true)}>Card</Button>
          </>
        }
        title="CONVERSIONS"
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
    </>
  );
};

export default BasisConversionList;
