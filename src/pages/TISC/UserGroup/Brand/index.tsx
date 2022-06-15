import React, { useRef } from 'react';
import CustomTable, { ICustomTableColumnType } from '@/components/Table';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';
import { ReactComponent as ActionUnreadedIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { getBrandPagination } from './services/api';
import { showImageUrl } from '@/helper/utils';
import type { IBrandListResponse } from './types';
import styles from './styles/index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { MenuSummary } from '@/components/MenuSummary';
import { dataBrands } from '@/constants/util';

const BrandList: React.FC = () => {
  const tableRef = useRef<any>();

  const comingSoon = () => {
    alert('Coming Soon!');
  };

  const TableColumns: ICustomTableColumnType<IBrandListResponse>[] = [
    {
      title: '',
      dataIndex: 'logo',
      width: 36,
      render: (value) => {
        if (value) {
          return <img src={showImageUrl(value)} style={{ width: 18 }} />;
        }
        return null;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      render: (value, record) => {
        return (
          <div className={styles.customBrandName}>
            {value}
            {record.status === 0 ? <ActionUnreadedIcon /> : null}
          </div>
        );
      },
    },
    { title: 'Origin', dataIndex: 'origin', sorter: true },
    { title: 'Locations', dataIndex: 'locations' },
    { title: 'Teams', dataIndex: 'teams' },
    { title: 'Distributors', dataIndex: 'distributors' },
    { title: 'Coverages', dataIndex: 'coverages' },
    { title: 'Categories', dataIndex: 'categories' },
    { title: 'Collections', dataIndex: 'collections' },
    { title: 'Collections', dataIndex: 'cards' },
    { title: 'Collections', dataIndex: 'products' },
    {
      title: 'Assign Team',
      dataIndex: 'assign_team',
      align: 'center',
      render: () => {
        return (
          <a style={{ color: 'black' }} onClick={comingSoon}>
            <UserAddIcon />
          </a>
        );
      },
    },
    { title: 'Status', dataIndex: 'status', sorter: true },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      //  @typescript-eslint/no-unused-vars
      render: () => {
        return (
          <HeaderDropdown
            containerClass={styles.customAction}
            arrow
            align={{ offset: [13, -10] }}
            placement="bottomRight"
            overlay={
              <MenuHeaderDropdown
                items={[
                  {
                    onClick: comingSoon,
                    icon: <ViewIcon />,
                    label: 'View',
                  },
                  {
                    onClick: comingSoon,
                    icon: <EmailInviteIcon />,
                    label: 'Email Invite',
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

  return (
    <PageContainer
      pageHeaderRender={() => (
        <MenuSummary containerClass={styles.customMenuSummary} dataBrands={dataBrands} />
      )}
    >
      <CustomTable
        title="BRANDS"
        columns={TableColumns}
        ref={tableRef}
        fetchDataFunc={getBrandPagination}
      />
    </PageContainer>
  );
};

export default BrandList;
