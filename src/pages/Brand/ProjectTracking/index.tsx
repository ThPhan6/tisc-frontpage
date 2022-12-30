import { useEffect, useRef, useState } from 'react';

import {
  Global,
  GlobalFilter,
  PriorityIcons,
  ProjectPriorityFilters,
  ProjectTrackingPriority,
} from './constant';
import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as HighPriorityIcon } from '@/assets/icons/high-priority-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';
import { ReactComponent as LowPriorityIcon } from '@/assets/icons/low-priority-icon.svg';
import { ReactComponent as MidPriorityIcon } from '@/assets/icons/mid-priority-icon.svg';
import { ReactComponent as NonPriorityIcon } from '@/assets/icons/non-priority-icon.svg';
import { ReactComponent as ProjectArchivedIcon } from '@/assets/icons/project-archived-icon.svg';
import { ReactComponent as ProjectLiveIcon } from '@/assets/icons/project-live-icon.svg';
import { ReactComponent as ProjectOnHoldIcon } from '@/assets/icons/project-on-hold-icon.svg';
import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { pushTo } from '@/helper/history';
import { getFullName, setDefaultWidthForEachColumn } from '@/helper/utils';
import {
  getProjectTrackingPagination,
  updateProjectTrackingPriority,
} from '@/services/project-tracking.api';
import { isEmpty } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { TableColumnItem } from '@/components/Table/types';
import { TeamProfileGroupCountry } from '@/features/team-profiles/types';
import store, { useAppSelector } from '@/reducers';
import { closeModal, openModal } from '@/reducers/modal';
import { ProjecTrackingList } from '@/types/project-tracking.type';

import { ProjectTrackingHeader } from './components/ProjectTrackingHeader';
import { getAssignTeamCheck } from '@/components/AssignTeam';
import CustomTable from '@/components/Table';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import TopBarDropDownFilter from '@/components/TopBar/TopBarDropDownFilter';
import { CustomDropDown } from '@/features/product/components';

import styles from './index.less';
import { getListTeamProfileUserGroupByBrandId } from '@/features/team-profiles/api';
import moment from 'moment';

const ProjectTracking = () => {
  useAutoExpandNestedTableColumn(0, [7]);
  const tableRef = useRef<any>();
  const userInfo = useAppSelector((state) => state.user.user);

  const [assignTeam, setAssignTeam] = useState<TeamProfileGroupCountry[]>([]);

  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);
  const [selectedPriority, setSelectedPriority] = useState(GlobalFilter);

  const reloadWithFilter = () => {
    tableRef.current?.reload();
  };

  // update assign team
  const handleSubmitAssignTeam =
    (projectInfo: ProjecTrackingList, teamProfile: TeamProfileGroupCountry[]) =>
    (checkedData: CheckboxValue[]) => {
      if (!projectInfo?.id) {
        return;
      }

      const { memberAssignTeamIds, noSelectionChange } = getAssignTeamCheck(
        projectInfo.assignedTeams,
        teamProfile,
        checkedData,
      );

      // dont call api if havent changed
      if (noSelectionChange) return;

      // add member selected to data
      updateProjectTrackingPriority(projectInfo.id, {
        assigned_teams: memberAssignTeamIds,
      }).then((isSuccess) => {
        if (isSuccess) {
          // reload table after updating
          reloadWithFilter();
          // close popup
          closeModal();
        }
      });
    };

  const showAssignTeams = (projectInfo: ProjecTrackingList) => (event: any) => {
    event?.stopPropagation();

    const openAssignTeamModal = (teams: TeamProfileGroupCountry[]) =>
      store.dispatch(
        openModal({
          type: 'Assign Team',
          title: 'Assign Team',
          props: {
            assignTeam: {
              memberAssigned: projectInfo.assignedTeams,
              teams,
              onChange: handleSubmitAssignTeam(projectInfo, teams),
            },
          },
        }),
      );

    if (assignTeam.length) {
      openAssignTeamModal(assignTeam);
      return;
    }

    getListTeamProfileUserGroupByBrandId(userInfo?.brand?.id as string).then((res) => {
      if (res) {
        /// set assignTeam state to display
        setAssignTeam(res);
        // open popup
        openAssignTeamModal(res);
      }
    });
  };

  useEffect(() => {
    reloadWithFilter();
  }, [selectedFilter, selectedPriority]);

  const renderStatus = (value: string) => {
    if (value === 'On Hold') {
      return <ProjectOnHoldIcon className="icon-align" />;
    }
    return value === 'Live' ? (
      <ProjectLiveIcon className="icon-align" />
    ) : (
      <ProjectArchivedIcon className="icon-align" />
    );
  };

  const renderPriorityDropdown = (_value: any, record: any) => {
    const menuItems: ItemType[] = [
      {
        key: ProjectTrackingPriority['Non'],
        label: 'Non',
        icon: <NonPriorityIcon />,
        onClick: () => {
          updateProjectTrackingPriority(record.id, {
            priority: ProjectTrackingPriority['Non'],
          }).then((success) => (success ? reloadWithFilter() : undefined));
        },
      },
      {
        key: ProjectTrackingPriority['High priority'],
        label: 'High priority',
        icon: <HighPriorityIcon />,
        onClick: () => {
          updateProjectTrackingPriority(record.id, {
            priority: ProjectTrackingPriority['High priority'],
          }).then((success) => (success ? reloadWithFilter() : undefined));
        },
      },
      {
        key: ProjectTrackingPriority['Mid priority'],
        label: 'Mid priority',
        icon: <MidPriorityIcon />,
        onClick: () => {
          updateProjectTrackingPriority(record.id, {
            priority: ProjectTrackingPriority['Mid priority'],
          }).then((success) => (success ? reloadWithFilter() : undefined));
        },
      },
      {
        key: ProjectTrackingPriority['Low priority'],
        label: 'Low priority',
        icon: <LowPriorityIcon />,
        onClick: () => {
          updateProjectTrackingPriority(record.id, {
            priority: ProjectTrackingPriority['Low priority'],
          }).then((success) => (success ? reloadWithFilter() : undefined));
        },
      },
    ];

    return (
      <CustomDropDown
        items={menuItems}
        menuStyle={{ width: 160, height: 'auto' }}
        labelProps={{ className: 'flex-between' }}
        hideDropdownIcon
        alignRight={false}
        textCapitalize={false}
        placement="bottomRight"
      >
        {PriorityIcons[record.priority] ?? 'n.a'}
      </CustomDropDown>
    );
  };
  const MainColumns: TableColumnItem<ProjecTrackingList>[] = [
    {
      title: 'Created',
      dataIndex: 'created_at',
      sorter: true,
      render: (_value, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {moment(record.created_at).format('YYYY-MM-DD')}{' '}
            {record.newTracking ? <UnreadIcon style={{ marginLeft: '8px' }} /> : ''}
          </div>
        );
      },
    },
    {
      title: 'Project Name',
      dataIndex: 'project_name',
      sorter: true,
      render: (_value, record) => record.projectName,
    },
    {
      title: 'Project Location',
      dataIndex: 'project_location',
      sorter: true,
      render: (_value, record) => record.projectLocation,
    },
    {
      title: 'Project Type',
      dataIndex: 'project_type',
      sorter: true,
      render: (_value, record) => record.projectType,
    },
    {
      title: 'Design Firm',
      dataIndex: 'design_firm',
      sorter: true,
      render: (_value, record) => record.designFirm,
    },
    {
      title: 'Status',
      dataIndex: 'projectStatus',
      width: '5%',
      align: 'center',
      render: (value) => renderStatus(value) ?? 'n.a',
    },
    {
      title: 'Requests',
      dataIndex: 'requestCount',
      render: (_value, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {record.requestCount}{' '}
            {record.newRequest ? <UnreadIcon style={{ marginLeft: '8px' }} /> : ''}
          </div>
        );
      },
    },
    {
      title: 'Notifications',
      dataIndex: 'notificationCount',
      render: (_value, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', width: 85 }}>
            {record.notificationCount}{' '}
            {record.newNotification ? <UnreadIcon style={{ marginLeft: '8px' }} /> : ''}
          </div>
        );
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: renderPriorityDropdown,
    },
    {
      title: 'Assign Team',
      dataIndex: 'assignedTeams',
      align: 'center',
      render: (_value, record) => {
        if (isEmpty(record.assignedTeams)) {
          return (
            <UserAddIcon
              className="icon-align"
              onClick={showAssignTeams(record)}
              style={{ cursor: 'pointer' }}
            />
          );
        }
        return (
          <div className={styles.asignTeamMember} onClick={showAssignTeams(record)}>
            {record.assignedTeams.map((teamProfile, key) => (
              <TeamIcon key={key} avatar={teamProfile.avatar} name={getFullName(teamProfile)} />
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <ProjectTrackingHeader
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            >
              <TopBarDropDownFilter
                selectedFilter={selectedPriority}
                setSelectedFilter={setSelectedPriority}
                filterLabel="Project Priority"
                globalFilter={GlobalFilter}
                dynamicFilter={ProjectPriorityFilters}
                isShowFilter
              />
            </ProjectTrackingHeader>
          );
        }}
      >
        <CustomTable
          title={'PROJECT TRACKING'}
          rightAction={
            <InfoIcon
              className={styles.iconInfor}
              onClick={() =>
                store.dispatch(openModal({ type: 'Project Tracking Legend', title: 'legend' }))
              }
            />
          }
          columns={setDefaultWidthForEachColumn(MainColumns, 7)}
          fetchDataFunc={getProjectTrackingPagination}
          extraParams={
            (selectedFilter && selectedFilter.id !== Global['VIEW ALL']) ||
            (selectedPriority && selectedPriority.id !== Global['VIEW ALL']) ||
            (selectedFilter &&
              selectedFilter.id !== Global['VIEW ALL'] &&
              selectedPriority &&
              selectedPriority.id !== Global['VIEW ALL'])
              ? {
                  project_status:
                    selectedFilter.id === Global['VIEW ALL'] ? undefined : selectedFilter.id,
                  priority:
                    selectedPriority.id === Global['VIEW ALL'] ? undefined : selectedPriority.id,
                }
              : undefined
          }
          ref={tableRef}
          hasPagination
          autoLoad={false}
          headerClass={styles.customTitle}
          onRow={(rowRecord: ProjecTrackingList) => ({
            onClick: () => {
              pushTo(PATH.brandProjectTrackingDetail.replace(':id', rowRecord.id));
            },
          })}
        />
      </PageContainer>
    </div>
  );
};
export default ProjectTracking;
