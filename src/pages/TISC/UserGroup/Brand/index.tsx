import React, { useEffect, useRef, useState } from 'react';
import CustomTable from '@/components/Table';
import type { TableColumnItem } from '@/components/Table/types';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';
import { ReactComponent as ActionUnreadedIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { getBrandPagination } from '@/services';
import { showImageUrl } from '@/helper/utils';
import type { BrandListItem } from '@/types';
import styles from './styles/index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import BrandMenuSummary from './components/BrandMenuSummary';
import Popover from '@/components/Modal/Popover';

const BrandList: React.FC = () => {
  const tableRef = useRef<any>();

  const comingSoon = () => {
    alert('Coming Soon!');
  };

  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {});

  const TableColumns: TableColumnItem<BrandListItem>[] = [
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
    { title: 'Cards', dataIndex: 'cards' },
    { title: 'Products', dataIndex: 'products' },
    {
      title: 'Assign Team',
      dataIndex: 'assign_team',
      align: 'center',
      render: () => {
        return (
          <a
            style={{ color: 'black' }}
            onClick={() => {
              setVisible(true);
            }}
          >
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
      render: (_v, record: any) => {
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
                    onClick: () =>
                      pushTo(PATH.tiscUserGroupBrandViewDetail.replace(':id', record.id)),
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
    <div>
      <PageContainer pageHeaderRender={() => <BrandMenuSummary />}>
        <CustomTable
          title="BRANDS"
          rightAction={
            <CustomPlusButton onClick={() => pushTo(PATH.tiscUserGroupBrandEntryFrom)} />
          }
          columns={TableColumns}
          ref={tableRef}
          fetchDataFunc={getBrandPagination}
          hasPagination
        />
      </PageContainer>
      {visible && (
        <Popover
          title="ASSIGN TEAM"
          visible={visible}
          setVisible={setVisible}
          dropdownCheckboxList={map(attributes, (item) => {
            return {
              name: item.name,
              options: item.subs.map((sub) => {
                return {
                  label: renderCheckBoxLabel(sub),
                  value: sub.id,
                };
              }),
            };
          })}
          dropdownCheckboxTitle={(data) => data.name}
          // chosenValue={selected}
          // setChosenValue={setSelected}
        />
      )}
    </div>
  );
};

export default BrandList;
