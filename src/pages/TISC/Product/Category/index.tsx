import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { TableColumnItem } from '@/components/Table/types';
import { deleteCategoryMiddleware, getProductCategoryPagination } from '@/services';
import type { CategoryListResponse } from '@/types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { confirmDelete } from '@/helper/common';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/Action';
const CategoryList: React.FC = () => {
  const tableRef = useRef<any>();

  const handleUpdateCategory = (id: string) => {
    pushTo(PATH.updateCategories.replace(':id', id));
  };

  const handleDeleteCategory = (id: string) => {
    confirmDelete(() => {
      deleteCategoryMiddleware(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const MainColumns: TableColumnItem<CategoryListResponse>[] = [
    {
      title: 'Main Category',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: 350,
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      width: 250,
      sorter: {
        multiple: 2,
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: {
        multiple: 3,
      },
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5px',
      render: (_value, record) => {
        return (
          <ActionMenu
            handleUpdate={() => handleUpdateCategory(record.id)}
            handleDelete={() => handleDeleteCategory(record.id)}
          />
        );
      },
    },
  ];
  const SubColumns: TableColumnItem<CategoryListResponse>[] = [
    {
      title: 'Main Category',
      dataIndex: 'maincategory',
      width: 350,
      sorter: true,
      noBoxShadow: true,
    },
    {
      title: 'Subcategory',
      dataIndex: 'name',
      width: 250,
      sorter: true,
      isExpandable: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      sorter: true,
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action2',
      width: '5%',
    },
  ];
  const ChildColumns: TableColumnItem<CategoryListResponse>[] = [
    {
      title: 'Main Category',
      dataIndex: 'maincategory',
      width: 350,
      sorter: true,
      noBoxShadow: true,
    },
    {
      title: 'Subcategory',
      dataIndex: 'Subcategory',
      width: 250,
      sorter: true,
    },
    {
      title: 'Category',
      dataIndex: 'name',

      sorter: true,
    },
    { title: 'Count', dataIndex: 'count', width: '5%' },
    {
      title: 'Action',
      dataIndex: 'action2',
      width: '5%',
    },
  ];

  return (
    <>
      <CustomTable
        rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createCategories)} />}
        title="CATEGORIES"
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getProductCategoryPagination}
        multiSort={{
          name: 'main_category_order',
          subcategory: 'sub_category_order',
          category: 'category_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: SubColumns,
          childrenColumnName: 'subs',
          level: 2,
          expandable: GetExpandableTableConfig({
            columns: ChildColumns,
            childrenColumnName: 'subs',
          }),
        })}
      />
    </>
  );
};

export default CategoryList;
