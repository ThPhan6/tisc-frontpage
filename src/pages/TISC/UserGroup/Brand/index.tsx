import React, { useRef, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { USER_STATUSES } from '@/constants/util';
import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';

import { ReactComponent as ActionUnreadedIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';

import {
  createAssignTeamByBrandId,
  getBrandPagination,
  getListAssignTeamByBrandId,
} from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { showImageUrl } from '@/helper/utils';
import { isEmpty, isEqual } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import type { TableColumnItem } from '@/components/Table/types';
import { TeamProfileBrandAssignMember } from '@/features/team-profiles/type';
import {
  AssignTeamForm,
  BrandListItem,
  MemberAssignTeam,
} from '@/features/user-group/types/brand.types';

import AssignTeam from '@/components/AssignTeam';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { BodyText } from '@/components/Typography';
import MenuHeaderSummary from '@/features/user-group/components/MenuHeaderSummary';

import { inviteUser } from '@/features/team-profiles/api';
import styles from '@/features/user-group/styles/brand.less';

const BrandList: React.FC = () => {
  const tableRef = useRef<any>();

  // get each assign team
  const [recordAssignTeam, setRecordAssignTeam] = useState<BrandListItem>();

  const [visible, setVisible] = useState<boolean>(false);
  // get list assign team to display inside popup
  const [assignTeam, setAssignTeam] = useState<AssignTeamForm[]>([]);
  // seleted member
  const [selected, setSelected] = useState<CheckboxValue[]>([]);

  const showAssignTeams = (brandInfo: BrandListItem) => () => {
    // get list team
    getListAssignTeamByBrandId(brandInfo.id).then((res) => {
      if (res) {
        /// set assignTeam state to display
        setAssignTeam(res);

        // show user selected
        setSelected(
          brandInfo.assign_team.map((member) => {
            return {
              label: '',
              value: member.id,
            };
          }),
        );
        /// get brand info
        setRecordAssignTeam(brandInfo);
      }
    });
    // open popup
    setVisible(true);
  };

  // update assign team
  const handleSubmitAssignTeam = (checkedData: CheckboxValue[]) => {
    // new assign team
    const memberAssignTeam: MemberAssignTeam[] = [];

    // for reset member selected
    let newAssignTeamSelected: CheckboxValue[] = [];

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

          // set member selected for next display
          if (memberAssignTeam.length > 0) {
            newAssignTeamSelected = memberAssignTeam.map((member) => ({
              label: `${member.first_name} ${member.last_name}`,
              value: member.id,
            }));
          }
          setSelected(newAssignTeamSelected);

          // close popup
          setVisible(false);
        }
      });
    }
  };

  const handleEmailInvite = (teams: TeamProfileBrandAssignMember[]) => {
    if (teams.length === 0) {
      return message.error(MESSAGE_ERROR.NO_TEAMPROFILE);
    }

    return teams.map((team) => inviteUser(team.id));
  };

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
                  name={`${user.firstname} ${user.lastname}`}
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
      sorter: true,
      render: (_v, record) => {
        return (
          <BodyText level={5} fontFamily="Roboto">
            {record.status === USER_STATUSES.ACTIVE
              ? 'Active'
              : record.status === USER_STATUSES.INACTIVE
              ? 'Inactive'
              : 'Pending'}
          </BodyText>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      //  @typescript-eslint/no-unused-vars
      render: (_v, record: any) => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'view',
                onClick: () => pushTo(PATH.tiscUserGroupBrandViewDetail.replace(':id', record.id)),
              },
              {
                type: 'invite',
                disabled: record.status !== 3,
                onClick: () => handleEmailInvite(record.assign_team),
              },
            ]}
          />
        );
      },
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
          columns={TableColumns}
          ref={tableRef}
          fetchDataFunc={getBrandPagination}
          hasPagination
        />
      </PageContainer>
      <AssignTeam
        visible={visible}
        setVisible={setVisible}
        selected={selected}
        setSelected={handleSubmitAssignTeam}
        teams={assignTeam}
      />
    </div>
  );
};

export default BrandList;
