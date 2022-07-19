import { HeaderDropdown } from '@/components/HeaderDropdown';
import CustomTable from '@/components/Table';
import { ICustomTableColumnType } from '@/components/Table/types';
import { deleteTeamProfile, getTeamProfileList } from '@/services';
import { ITeamProfilesResponseForm } from '@/types';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { useRef } from 'react';
import { showImageUrl } from '@/helper/utils';
import { ProfileIcon } from '@/components/ProfileIcon';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const TeamProfilesList = () => {
  const tableRef = useRef<any>();
  const handleUpdateTeamProfile = (id: string) => {
    pushTo(PATH.updateTeamProfile.replace(':id', id));
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
  const mainColumns: ICustomTableColumnType<ITeamProfilesResponseForm>[] = [
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
            }}
          />
        ) : (
          <ProfileIcon name={record.fullname} />
        ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullname',
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
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '5%',
      render: (_value: any, record: any) => {
        return (
          <HeaderDropdown
            arrow={true}
            align={{ offset: [-14, -10] }}
            items={[
              {
                onClick: () => handleUpdateTeamProfile(record.id),
                icon: <EditIcon />,
                label: 'Edit',
              },
              {
                onClick: () => handleDeleteTeamProfile(record.id),
                icon: <DeleteIcon />,
                label: 'Delete',
              },
            ]}
            trigger={['click']}
          >
            <ActionIcon />
          </HeaderDropdown>
        );
      },
    },
  ];

  return (
    <CustomTable
      title="TEAM PROFILES"
      rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createTeamProfile)} />}
      columns={mainColumns}
      fetchDataFunc={getTeamProfileList}
      ref={tableRef}
    />
  );
};

export default TeamProfilesList;
