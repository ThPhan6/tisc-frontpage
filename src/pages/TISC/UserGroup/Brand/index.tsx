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
import { isEmpty, isEqual } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import type { TableColumnItem } from '@/components/Table/types';
import {
  BrandAssignTeamForm,
  BrandListItem,
  BrandMemberAssigned,
} from '@/features/user-group/types/brand.types';
import { ActiveStatus } from '@/types';

import AssignTeam from '@/components/AssignTeam';
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
  useAutoExpandNestedTableColumn(0);
  const tableRef = useRef<any>();

  /// for assign team modal
  const [visible, setVisible] = useState<boolean>(false);
  // get each member assigned
  const [recordAssignTeam, setRecordAssignTeam] = useState<BrandListItem>();
  // get list assign team to display inside popup
  const [assignTeam, setAssignTeam] = useState<BrandAssignTeamForm[]>([]);

  const showAssignTeams = (brandInfo: BrandListItem) => () => {
    /// get each brand member has already assgined
    setRecordAssignTeam(brandInfo);

    // get list team
    getListAssignTeamByBrandId(brandInfo.id).then((res) => {
      if (res) {
        /// set assignTeam state to display
        setAssignTeam(res);
        // open popup
        setVisible(true);
      }
    });
  };

  // update assign team
  const handleSubmitAssignTeam = (checkedData: CheckboxValue[]) => {
    // new assign team
    const memberAssignTeam: BrandMemberAssigned[] = [];

    checkedData.forEach((checked) => {
      assignTeam.forEach((team) => {
        const member = team.users.find((user) => user.id === checked.value);

        if (member) {
          memberAssignTeam.push(member);
        }
      });
    });

    if (recordAssignTeam?.id) {
      // dont call api if havent changed
      const checkedIds = checkedData.map((check) => check.value);
      const assignedTeamIds = recordAssignTeam.assign_team.map((team) => team.id);
      const noSelectionChange = isEqual(checkedIds, assignedTeamIds);
      if (noSelectionChange) return;

      // add member selected to data
      createAssignTeamByBrandId(
        recordAssignTeam.id,
        memberAssignTeam.map((member) => member.id),
      ).then((isSuccess) => {
        if (isSuccess) {
          // reload table after updating
          tableRef.current.reload();
          // close popup
          setVisible(false);
        }
      });
    }
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
          columns={setDefaultWidthForEachColumn(TableColumns, 11)}
          ref={tableRef}
          fetchDataFunc={getBrandPagination}
          hasPagination
        />
      </PageContainer>
      <AssignTeam
        visible={visible}
        setVisible={setVisible}
        onChange={handleSubmitAssignTeam}
        memberAssigned={recordAssignTeam?.assign_team}
        teams={assignTeam}
      />
    </div>
  );
};

export default BrandList;
