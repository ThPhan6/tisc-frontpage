import { useRef } from 'react';

import { PATH } from '@/constants/path';
import { USER_STATUS_TEXTS } from '@/constants/util';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useCheckPermission } from '@/helper/hook';
import {
  formatPhoneCode,
  getFullName,
  getValueByCondition,
  setDefaultWidthForEachColumn,
} from '@/helper/utils';

import { TeamProfileTableProps } from '../types';
import { TableColumnItem } from '@/components/Table/types';
import { useAppSelector } from '@/reducers';

import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import TeamIcon from '@/components/TeamIcon/TeamIcon';

import { deleteTeamProfile, getTeamProfileList } from '@/features/team-profiles/api';

const TeamProfilesTable = () => {
  useAutoExpandNestedTableColumn(0, { rightColumnExcluded: 3 });
  const tableRef = useRef<any>();
  const userId = useAppSelector((state) => state.user.user?.id);

  const isTISCAdmin = useCheckPermission('TISC Admin');
  const isBrandAdmin = useCheckPermission('Brand Admin');
  const isDesignAdmin = useCheckPermission('Design Admin');

  /// for user role path
  const userCreateRolePath = getValueByCondition(
    [
      [isTISCAdmin, PATH.tiscCreateTeamProfile],
      [isBrandAdmin, PATH.brandCreateTeamProfile],
      [isDesignAdmin, PATH.designCreateTeamProfile],
    ],
    '',
  );

  const userUpdateRolePath = getValueByCondition(
    [
      [isTISCAdmin, PATH.tiscUpdateTeamProfile],
      [isBrandAdmin, PATH.brandUpdateTeamProfile],
      [isDesignAdmin, PATH.designUpdateTeamProfile],
    ],
    '',
  );

  const handleUpdateTeamProfile = (id: string) => {
    pushTo(userUpdateRolePath.replace(':id', id));
  };

  const handleDeleteTeamProfile = (id: string) => {
    confirmDelete(() => {
      deleteTeamProfile(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current?.reload();
        }
      });
    });
  };
  const mainColumns: TableColumnItem<TeamProfileTableProps>[] = [
    {
      title: '',
      dataIndex: 'avatar',
      width: '50',
      render: (_, record) => (
        <TeamIcon avatar={record.avatar} name={getFullName(record)} size={20} />
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'firstname',
      render: (_v, record) => getFullName(record),
      sorter: true,
    },
    {
      title: 'Work Location',
      dataIndex: 'work_location',
      sorter: true,
    },
    {
      title: 'Position/Role',
      dataIndex: 'position',
    },
    {
      title: 'Work Email',
      dataIndex: 'email',
    },
    {
      title: 'Work Phone',
      dataIndex: 'phone',
      render: (value, record) => {
        return `${formatPhoneCode(record.phone_code)} ${value ?? ''}`;
      },
    },
    {
      title: 'Access Level',
      dataIndex: 'access_level',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '5%',
      sorter: true,
      render: (value) => USER_STATUS_TEXTS[value] ?? 'N/A',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '5%',
      align: 'center',
      render: (_value: any, record: any) => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateTeamProfile(record.id),
              },
              {
                type: 'deleted',
                disabled: userId === record.id,
                onClick: () =>
                  userId === record.id ? undefined : handleDeleteTeamProfile(record.id),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <CustomTable
      title="TEAM PROFILES"
      rightAction={<CustomPlusButton onClick={() => pushTo(userCreateRolePath)} />}
      columns={setDefaultWidthForEachColumn(mainColumns, 5)}
      fetchDataFunc={getTeamProfileList}
      ref={tableRef}
      hasPagination
    />
  );
};

export default TeamProfilesTable;
