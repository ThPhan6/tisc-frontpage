import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table/types';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { getProductCategoryPagination } from './services/api';
import type { ICategoryListResponse } from './types';
// import styles from './styles/index.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-icon.svg';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';

const CategoryList: React.FC = () => {
  const tableRef = useRef<any>();

  const comingSoon = () => {
    alert('Coming Soon!');
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
      render: () => {
        return (
          <HeaderDropdown
            arrow
            overlay={
              <MenuHeaderDropdown
                items={[
                  {
                    onClick: comingSoon,
                    icon: <ViewIcon />,
                    label: 'Edit',
                  },
                  {
                    onClick: comingSoon,
                    icon: <EmailInviteIcon />,
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
        rightAction={
          <div style={{ cursor: 'pointer' }} onClick={() => pushTo(PATH.createCategories)}>
            <PlusIcon />
          </div>
        }
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
