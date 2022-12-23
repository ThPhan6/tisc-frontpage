import React, { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import {
  deleteCategoryMiddleware,
  getProductCategoryPagination,
} from '@/features/categories/services';
import { confirmDelete, useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import type { TableColumnItem } from '@/components/Table/types';
import { CategoryNestedList } from '@/features/categories/types';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

const CategoryList: React.FC = () => {
  useAutoExpandNestedTableColumn(2, [2]);
  const tableRef = useRef<any>();
  const { isMobile } = useScreen();

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

  const MainColumns: TableColumnItem<CategoryNestedList>[] = [
    {
      title: 'Main Category',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      sorter: {
        multiple: 2,
      },
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: {
        multiple: 3,
      },
      defaultSortOrder: 'ascend',
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
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateCategory(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteCategory(record.id),
              },
            ]}
          />
        );
      },
    },
  ];
  const SubColumns: TableColumnItem<CategoryNestedList>[] = [
    {
      title: 'Main Category',
      dataIndex: 'maincategory',
      sorter: true,
      noBoxShadow: true,
    },
    {
      title: 'Subcategory',
      dataIndex: 'name',
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
  const ChildColumns: TableColumnItem<CategoryNestedList>[] = [
    {
      title: 'Main Category',
      dataIndex: 'maincategory',
      sorter: true,
      noBoxShadow: true,
    },
    {
      title: 'Subcategory',
      dataIndex: 'Subcategory',
      sorter: true,
      noBoxShadow: true,
    },
    {
      title: 'Category',
      dataIndex: 'name',
      noBoxShadow: true,
      sorter: true,
    },
    { title: 'Count', dataIndex: 'count', width: '5%', noBoxShadow: true },
    {
      title: 'Action',
      dataIndex: 'action2',
      width: '5%',
      noBoxShadow: true,
    },
  ];

  return (
    <>
      <CustomTable
        rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createCategories)} />}
        title="CATEGORIES"
        columns={setDefaultWidthForEachColumn(MainColumns, 2)}
        ref={tableRef}
        fetchDataFunc={getProductCategoryPagination}
        multiSort={{
          name: 'main_category_order',
          subcategory: 'sub_category_order',
          category: 'category_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(SubColumns, 2),
          childrenColumnName: 'subs',
          level: 2,
          expandable: GetExpandableTableConfig({
            columns: setDefaultWidthForEachColumn(ChildColumns, 2),
            childrenColumnName: 'subs',
            level: 3,
          }),
        })}
        footerClass={isMobile ? 'flex-end' : ''}
      />
    </>
  );
};

export default CategoryList;
