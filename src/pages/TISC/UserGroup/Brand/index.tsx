import React, { useRef, useState } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';

import { ReactComponent as ActionUnreadedIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import {
  createAssignTeamByBrandId,
  getBrandPagination,
  getListAssignTeamByBrandId,
} from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { getFullName, setDefaultWidthForEachColumn } from '@/helper/utils';
import { isEmpty } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import type { TableColumnItem } from '@/components/Table/types';
import { BrandAssignTeamForm, BrandListItem } from '@/features/user-group/types/brand.types';
import store from '@/reducers';
import { closeModal, openModal } from '@/reducers/modal';
import { ActiveStatus } from '@/types';

import { getAssignTeamCheck } from '@/components/AssignTeam';
import { LogoIcon } from '@/components/LogoIcon';
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
  useAutoExpandNestedTableColumn(0, [10]);
  const tableRef = useRef<any>();

  // get list assign team to display inside popup
  const [assignTeam, setAssignTeam] = useState<BrandAssignTeamForm[]>([]);

  const handleSubmitAssignTeam =
    (brandInfo: BrandListItem, teamProfile: BrandAssignTeamForm[]) =>
    (checkedData: CheckboxValue[]) => {
      if (!brandInfo?.id) {
        return;
      }

      const { memberAssignTeamIds, noSelectionChange } = getAssignTeamCheck(
        brandInfo.assign_team,
        teamProfile,
        checkedData,
      );

      // dont call api if havent changed
      if (noSelectionChange) return;

      // add member selected to data
      createAssignTeamByBrandId(brandInfo.id, memberAssignTeamIds).then((isSuccess) => {
        if (isSuccess) {
          // reload table after updating
          tableRef.current.reload();
          // close popup
          closeModal();
        }
      });
    };

  const showAssignTeams = (brandInfo: BrandListItem) => () => {
    const openAssignTeamModal = (teams: BrandAssignTeamForm[]) =>
      store.dispatch(
        openModal({
          type: 'Assign Team',
          title: 'Assign Team',
          props: {
            assignTeam: {
              memberAssigned: brandInfo?.assign_team,
              teams,
              onChange: handleSubmitAssignTeam(brandInfo, teams),
            },
          },
        }),
      );

    if (assignTeam.length) {
      openAssignTeamModal(assignTeam);
      return;
    }

    getListAssignTeamByBrandId(brandInfo.id).then((res) => {
      if (res) {
        setAssignTeam(res);
        openAssignTeamModal(res);
      }
    });
  };

  const handleEmailInvite = (brandId: string) => {
    if (brandId) inviteBrand(brandId);
  };

  const TableColumns: TableColumnItem<BrandListItem>[] = [
    {
      title: '',
      dataIndex: 'logo',
      width: '5%',
      render: (value) => {
        return <LogoIcon logo={value} className={styles.img} />;
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
          <div onClick={showAssignTeams(record)} className="flex-center">
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
            {ActiveStatus[record.status]}
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
          columns={setDefaultWidthForEachColumn(TableColumns, 10)}
          ref={tableRef}
          fetchDataFunc={getBrandPagination}
          hasPagination
        />
      </PageContainer>
    </div>
  );
};

export default BrandList;
