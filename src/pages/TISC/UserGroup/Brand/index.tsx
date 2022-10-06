import React, { useRef } from 'react';

import { PATH } from '@/constants/path';
import { BRAND_STATUSES_TEXTS } from '@/constants/util';
import { PageContainer } from '@ant-design/pro-layout';

import { ReactComponent as ActionUnreadedIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';

import { useAssignTeam } from '@/components/AssignTeam/hook';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getBrandPagination } from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { getFullName, setDefaultWidthForEachColumn, showImageUrl } from '@/helper/utils';
import { isEmpty } from 'lodash';

import type { TableColumnItem } from '@/components/Table/types';
import { BrandListItem } from '@/features/user-group/types/brand.types';

import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { BodyText } from '@/components/Typography';
import MenuHeaderSummary from '@/features/user-group/components/MenuHeaderSummary';

import { inviteBrand } from '@/features/team-profiles/api';
import styles from '@/features/user-group/styles/brand.less';

const BrandList: React.FC = () => {
  // set width for each cell
  useAutoExpandNestedTableColumn(0);
  const tableRef = useRef<any>();
  const { AssignTeam, showAssignTeams } = useAssignTeam(tableRef);

  const handleEmailInvite = (brandId: string) => {
    if (brandId) inviteBrand(brandId);
  };

  const TableColumns: TableColumnItem<BrandListItem>[] = [
    {
      title: '',
      dataIndex: 'logo',
      width: '5%',
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
    {
      title: 'Origin',
      dataIndex: 'origin',
      sorter: true,
    },
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
      render: (_v, record) => {
        if (isEmpty(record.assign_team)) {
          return <UserAddIcon onClick={showAssignTeams(record)} style={{ cursor: 'pointer' }} />;
        }
        return (
          <div onClick={showAssignTeams(record)} className={styles.avatar}>
            {record.assign_team.map((user, key) => {
              return (
                <TeamIcon
                  key={user.id ?? key}
                  avatar={user.avatar}
                  name={getFullName(user)}
                  customClass={styles.member}
                />
              );
            })}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '5%',
      sorter: true,
      render: (_v, record) => {
        return (
          <BodyText level={5} fontFamily="Roboto">
            {BRAND_STATUSES_TEXTS[record.status]}
          </BodyText>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '5%',
      align: 'center',
      render: (_v, record: any) => (
        <ActionMenu
          actionItems={[
            {
              type: 'view',
              onClick: () => pushTo(PATH.tiscUserGroupBrandViewDetail.replace(':id', record.id)),
            },
            {
              type: 'invite',
              disabled: record.status !== 3,
              onClick: () => handleEmailInvite(record.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <PageContainer pageHeaderRender={() => <MenuHeaderSummary type="brand" />}>
        <CustomTable
          title="BRANDS"
          rightAction={
            <CustomPlusButton onClick={() => pushTo(PATH.tiscUserGroupBrandEntryFrom)} />
          }
          columns={setDefaultWidthForEachColumn(TableColumns, 11)}
          ref={tableRef}
          fetchDataFunc={getBrandPagination}
          hasPagination
        />
      </PageContainer>
      <AssignTeam />
    </div>
  );
};

export default BrandList;
