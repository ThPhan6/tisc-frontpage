import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table/types';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { deleteCategoryMiddleware, getProductCategoryPagination } from './services/api';
import type { ICategoryListResponse } from './types';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { confirmDelete } from '@/helper/common';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
const CategoryList: React.FC = () => {
  const tableRef = useRef<any>();

  const handleActionCategory = (actionType: 'edit' | 'delete', id: string) => {
    if (actionType === 'edit') {
      pushTo(PATH.updateCategories.replace(':id', id));
      return;
    }

    const onOk = () => {
      deleteCategoryMiddleware(id, (type: STATUS_RESPONSE, msg?: string) => {
        if (type === STATUS_RESPONSE.SUCCESS) {
          message.success(MESSAGE_NOTIFICATION.DELETE_CATEGORY_SUCCESS);
          tableRef.current.reload();
        } else {
          message.error(msg);
        }
      });
    };

    const onCancel = () => {
      pushTo(PATH.categories);
    };

    confirmDelete(onOk, onCancel);
  };

  const MainColumns: ICustomTableColumnType<ICategoryListResponse>[] = [
    {
      title: 'Main Category',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: 350,
      isExpandable: true,
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
      width: '5%',
      render: (_value, record) => {
        return (
          <HeaderDropdown
            arrow
            align={{ offset: [13, -10] }}
            placement="bottomRight"
            overlay={
              <MenuHeaderDropdown
                items={[
                  {
                    onClick: () => handleActionCategory('edit', record.id),
                    icon: <EditIcon />,
                    label: 'Edit',
                  },
                  {
                    onClick: () => handleActionCategory('delete', record.id),
                    icon: <DeleteIcon />,
                    label: 'Delete',
                  },
                ]}
              />
            }
            trigger={['click']}
          >
            <ActionIcon />
          </HeaderDropdown>
        );
      },
    },
  ];
  const SubColumns: ICustomTableColumnType<ICategoryListResponse>[] = [
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
  const ChildColumns: ICustomTableColumnType<ICategoryListResponse>[] = [
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
