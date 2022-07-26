import CustomTable from '@/components/Table';
import { TableColumnItem } from '@/components/Table/types';
import { deleteTeamProfile, getTeamProfileList } from '@/services';
import { TeamProfileTableProps } from '@/types';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { useRef } from 'react';
import { showImageUrl, formatPhoneCode, getFullName } from '@/helper/utils';
import { ProfileIcon } from '@/components/ProfileIcon';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { USER_STATUS_TEXTS } from '@/constants/util';
import { ActionMenu } from '@/components/Action';
import { useAppSelector } from '@/reducers';

const TeamProfilesList = () => {
  const tableRef = useRef<any>();
  const userId = useAppSelector((state) => state.user.user?.id);
  const handleUpdateTeamProfile = (id: string) => {
    pushTo(PATH.brandUpdateTeamProfile.replace(':id', id));
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
      width: '3%',
      render: (_, record) =>
        record.avatar ? (
          <img
            src={showImageUrl(record.avatar)}
            alt="avatar"
            style={{
              height: '18px',
              width: '18px',
              borderRadius: '50%',
              boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
              border: '1px solid #fff',
            }}
          />
        ) : (
          <ProfileIcon name={getFullName(record)} />
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
            handleUpdate={() => handleUpdateTeamProfile(record.id)}
            handleDelete={
              userId === record.id ? undefined : () => handleDeleteTeamProfile(record.id)
            }
          />
        );
      },
    },
  ];

  return (
    <CustomTable
      title="TEAM PROFILES"
      rightAction={<CustomPlusButton onClick={() => pushTo(PATH.brandCreateTeamProfile)} />}
      columns={mainColumns}
      fetchDataFunc={getTeamProfileList}
      ref={tableRef}
      hasPagination
    />
  );
};

export default TeamProfilesList;
