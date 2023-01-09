import React, { useEffect, useRef, useState } from 'react';

import { FilterStatusIcons, FilterValues, GlobalFilter } from './constants/filter';
import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { useAccess } from 'umi';

import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import {
  createAssignTeamByProjectId,
  deleteProject,
  getProjectPagination,
  getProjectSummary,
} from '@/features/project/services';
import { getTeamsByDesignFirm } from '@/features/user-group/services';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { getDesignDueDay, getFullName, setDefaultWidthForEachColumn } from '@/helper/utils';
import { isEmpty } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import type { TableColumnItem } from '@/components/Table/types';
import type { ProjectListProps, ProjectSummaryData } from '@/features/project/types';
import { TeamProfileGroupCountry } from '@/features/team-profiles/types';
import store from '@/reducers';
import { closeModal, openModal } from '@/reducers/modal';

import ProjectListHeader from './components/ProjectListHeader';
import { getAssignTeamCheck } from '@/components/AssignTeam';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { BodyText } from '@/components/Typography';

import styles from './styles/project-list.less';

const ProjectList: React.FC = () => {
  useAutoExpandNestedTableColumn(0, [6]);
  const tableRef = useRef<any>();
  const accessPermission = useAccess();
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);
  const [summaryData, setSummaryData] = useState<ProjectSummaryData>();

  const inAccessAllTab: boolean =
    accessPermission.design_project_basic_information === false &&
    accessPermission.design_project_zone_area_zoom === false &&
    accessPermission.design_project_product_considered === false &&
    accessPermission.design_project_product_specified === false
      ? true
      : false;

  // get list assign team to display inside popup
  const [assignTeam, setAssignTeam] = useState<TeamProfileGroupCountry[]>([]);

  // update assign team
  const handleSubmitAssignTeam =
    (projectInfo: ProjectListProps, teamProfile: TeamProfileGroupCountry[]) =>
    (checkedData: CheckboxValue[]) => {
      if (!projectInfo?.id) {
        return;
      }

      const { memberAssignTeamIds, noSelectionChange } = getAssignTeamCheck(
        projectInfo.assign_teams,
        teamProfile,
        checkedData,
      );

      // dont call api if havent changed
      if (noSelectionChange) return;

      // add member selected to data
      createAssignTeamByProjectId(projectInfo.id, memberAssignTeamIds).then((isSuccess) => {
        if (isSuccess) {
          // reload table after updating
          tableRef.current.reload();
          // close popup
          closeModal();
        }
      });
    };

  const showAssignTeams = (projectInfo: ProjectListProps) => () => {
    const openAssignTeamModal = (teams: TeamProfileGroupCountry[]) =>
      store.dispatch(
        openModal({
          type: 'Assign Team',
          title: 'Assign Team',
          props: {
            assignTeam: {
              memberAssigned: projectInfo.assign_teams,
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

    // get list team by design id(user's relation_id)
    getTeamsByDesignFirm(projectInfo.design_id).then((res) => {
      if (res) {
        /// set assignTeam state to display
        setAssignTeam(res);
        // open popup
        openAssignTeamModal(res);
      }
    });
  };

  const goToCreatePage = () => {
    pushTo(PATH.designerProjectCreate);
  };

  const goToUpdateProject = (id: string) => {
    pushTo(PATH.designerUpdateProject.replace(':id', id));
  };

  const loadProjectSummaryData = () => {
    getProjectSummary().then((res) => {
      if (res) {
        setSummaryData(res);
      }
    });
  };

  const handleDeleteProject = (id: string) => {
    confirmDelete(() => {
      deleteProject(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
          loadProjectSummaryData();
        }
      });
    });
  };

  /// reload table depends on filter
  useEffect(() => {
    tableRef.current.reload();
  }, [selectedFilter]);

  useEffect(() => {
    loadProjectSummaryData();
  }, []);

  const MainColumns: TableColumnItem<ProjectListProps>[] = [
    {
      title: 'Status',
      dataIndex: 'status',
      width: '5%',
      align: 'center',
      render: (value) => FilterStatusIcons[value] ?? '',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      sorter: true,
    },
    {
      title: 'Project Type',
      dataIndex: 'project_type',
      sorter: true,
    },
    {
      title: 'Building Type',
      dataIndex: 'building_type',
      sorter: true,
    },
    {
      title: 'Design Due',
      dataIndex: 'design_due',
      render: (value) => {
        const dueDay = getDesignDueDay(value);
        return (
          <BodyText
            level={5}
            fontFamily="Roboto"
            customClass={`${styles.dueDayText} ${dueDay.value < 0 ? 'late' : ''}`}
          >
            {dueDay.text}
          </BodyText>
        );
      },
    },
    {
      title: 'Assign Team',
      dataIndex: 'assign_teams',
      align: 'center',
      render: (_value, record) => {
        if (isEmpty(record.assign_teams)) {
          return (
            <UserAddIcon onClick={showAssignTeams(record)} className="icon-align cursor-pointer" />
          );
        }
        return (
          <div onClick={showAssignTeams(record)} className={styles.asignTeamMember}>
            {record.assign_teams.map((teamProfile, key) => (
              <TeamIcon key={key} avatar={teamProfile.avatar} name={getFullName(teamProfile)} />
            ))}
          </div>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'id',
      align: 'center',
      width: '5%',
      render: (projectId) => {
        return (
          <ActionMenu
            editActionOnMobile={false}
            actionItems={[
              {
                type: 'updated',
                onClick: () => goToUpdateProject(projectId),
                disabled: inAccessAllTab,
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteProject(projectId),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <ProjectListHeader
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              summaryData={summaryData}
            />
          );
        }}
      >
        <CustomTable
          rightAction={<CustomPlusButton onClick={goToCreatePage} />}
          title={'PROJECTS'}
          columns={setDefaultWidthForEachColumn(MainColumns, 6)}
          fetchDataFunc={getProjectPagination}
          extraParams={
            selectedFilter && selectedFilter.id !== FilterValues.global
              ? {
                  filter: {
                    status: selectedFilter.id,
                  },
                }
              : undefined
          }
          ref={tableRef}
          hasPagination
          autoLoad={false}
        />
      </PageContainer>
    </div>
  );
};

export default ProjectList;
