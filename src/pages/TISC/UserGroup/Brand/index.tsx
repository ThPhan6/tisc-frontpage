import { ReactComponent as ActionUnreadedIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';
import { ActionForm } from '@/components/Action';
import AssignTeam from '@/components/AssignTeam';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import type { TableColumnItem } from '@/components/Table/types';
import TeamIcon from '@/components/TeamProfile/components/TeamIcon';
import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { showImageUrl } from '@/helper/utils';
import { getBrandPagination, getListAssignTeamByBrandId, inviteUser } from '@/services';
import type { AssignTeamForm, BrandListItem, TeamProfileBrandAssignMember } from '@/types';
import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';
import { isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';
import BrandMenuSummary from './components/BrandMenuSummary';
import styles from './styles/index.less';

const BrandList: React.FC = () => {
  const tableRef = useRef<any>();

  const [visible, setVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<CheckboxValue[]>([]);

  const [assignTeam, setAssignTeam] = useState<AssignTeamForm[]>([]);
  const handleAssignTeams = (brandId: string) => () => {
    // open popup
    setVisible(true);
    // get list team
    getListAssignTeamByBrandId(brandId).then(setAssignTeam);
  };

  const handleSubmitAssignTeam = () => {
    // update assign team
    // call api here
    // reload table after updating
    tableRef.current.reload();
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
      render: (_v, record) => {
        if (isEmpty(record.assign_team)) {
          return (
            <UserAddIcon onClick={handleAssignTeams(record.id)} style={{ cursor: 'pointer' }} />
          );
        }
        return (
          <div onClick={handleAssignTeams(record.id)} style={{ cursor: 'pointer' }}>
            {record.assign_team.map((user, key) => (
              <TeamIcon
                key={user.id ?? key}
                avatar={user.avatar}
                name={`${user.firstName}${user.lastname}`}
                customClass={styles.member}
              />
            ))}
          </div>
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
        const actionItems = [];
        actionItems.push({
          onClick: () => pushTo(PATH.tiscUserGroupBrandViewDetail.replace(':id', record.id)),
          icon: <ViewIcon />,
          label: 'View',
        });
        if (record.status === 3) {
          actionItems.push({
            onClick: () => handleEmailInvite(record.assign_team),
            icon: <EmailInviteIcon />,
            label: 'Email Invite',
          });
        }
        return <ActionForm actionItems={actionItems} />;
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
      <AssignTeam
        visible={visible}
        setVisible={setVisible}
        selected={selected}
        setSelected={setSelected}
        teams={assignTeam}
        handleSubmit={handleSubmitAssignTeam}
      />
    </div>
  );
};

export default BrandList;
