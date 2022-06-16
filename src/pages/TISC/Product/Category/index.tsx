import React, { useRef } from 'react';
import CustomTable, { ICustomTableColumnType, GetExpandableTableConfig } from '@/components/Table';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { getBrandPagination } from './services/api';
import type { ICategoryListResponse } from './types';
import styles from './styles/index.less';
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
        compare: (a: any, b: any) => a.name - b.name,
        multiple: 1,
      },
      width: '40%',
      isExpandable: true,
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      width: '30%',
      sorter: {
        compare: (a: any, b: any) => a.name - b.name,
        multiple: 2,
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: '20%',
      sorter: {
        compare: (a: any, b: any) => a.name - b.name,
        multiple: 3,
      },
    },
    { title: 'Count', dataIndex: 'count', width: '5%' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: () => {
        return (
          <HeaderDropdown
            className={styles.customAction}
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
      width: '40%',
      sorter: true,
      noBoxShadow: true,
    },
    {
      title: 'Subcategory',
      dataIndex: 'name',
      width: '30%',
      sorter: true,
      isExpandable: true,
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      sorter: true,
      width: '20%',
    },
    { title: 'Count', dataIndex: 'count', width: '5%' },
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
      width: '40%',
      sorter: true,
      noBoxShadow: true,
    },
    {
      title: 'Subcategory',
      dataIndex: 'Subcategory',
      width: '30%',
      sorter: true,
    },
    {
      title: 'Category',
      dataIndex: 'name',
      width: '20%',
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
        rightAction={<PlusIcon onClick={() => pushTo(PATH.createCategories)} />}
        title="CATEGORIES"
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getBrandPagination}
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
