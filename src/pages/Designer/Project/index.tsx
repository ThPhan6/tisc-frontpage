import React, { useEffect, useRef, useState } from 'react';

import { FilterStatusIcons, FilterValues, GlobalFilter } from './constants/filter';
import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';

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
import { getFullName, setDefaultWidthForEachColumn } from '@/helper/utils';
import { isEmpty, isEqual } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import type { TableColumnItem } from '@/components/Table/types';
import type { ProjectListProps, ProjectSummaryData } from '@/features/project/types';
import { BrandTeam, TeamProfileGroupCountry } from '@/features/team-profiles/types';

import ProjectListHeader from './components/ProjectListHeader';
import AssignTeam from '@/components/AssignTeam';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { BodyText } from '@/components/Typography';

import styles from './styles/project-list.less';
import moment from 'moment';

const ProjectList: React.FC = () => {
  useAutoExpandNestedTableColumn(0, { rightColumnExcluded: 1 });
  const tableRef = useRef<any>();
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);
  const [summaryData, setSummaryData] = useState<ProjectSummaryData>();

  const [visible, setVisible] = useState<boolean>(false);

  // get each assign team
  const [recordAssignTeam, setRecordAssignTeam] = useState<ProjectListProps>();
  // get list assign team to display inside popup
  const [assignTeam, setAssignTeam] = useState<TeamProfileGroupCountry[]>([]);
  // seleted member
  const [selected, setSelected] = useState<CheckboxValue[]>([]);

  const showAssignTeams = (projectInfo: ProjectListProps) => () => {
    // get list team
    getTeamsByDesignFirm(projectInfo.design_id).then((res) => {
      console.log(res);

      if (res) {
        /// set assignTeam state to display
        setAssignTeam(res);

        // show user selected
        setSelected(
          projectInfo.assign_teams?.map((member) => {
            return {
              label: '',
              value: member.id,
            };
          }),
        );
        /// get brand info
        setRecordAssignTeam(projectInfo);
      }
    });

    // open popup
    setVisible(true);
  };

  // update assign team
  const handleSubmitAssignTeam = (checkedData: CheckboxValue[]) => {
    // new assign team
    const memberAssignTeam: BrandTeam[] = [];

    // for reset member selected
    let newAssignTeamSelected: CheckboxValue[] = [];

    checkedData?.forEach((checked) => {
      assignTeam.forEach((team) => {
        const member = team.users.find((user) => user.id === checked.value);

        if (member) {
          memberAssignTeam.push(member);
        }
      });
    });

    if (recordAssignTeam?.id) {
      // dont call api if havent changed
      const checkedIds = checkedData?.map((check) => check.value);
      const assignedTeamIds = recordAssignTeam.assign_teams?.map((team) => team.id);
      const noSelectionChange = isEqual(checkedIds, assignedTeamIds);
      if (noSelectionChange) return;

      // add member selected to data
      createAssignTeamByProjectId(
        recordAssignTeam.id,
        memberAssignTeam.map((member) => member.id),
      ).then((isSuccess) => {
        if (isSuccess) {
          // reload table after updating
          tableRef.current.reload();

          // set member selected for next display
          if (memberAssignTeam.length > 0) {
            newAssignTeamSelected = memberAssignTeam.map((member) => ({
              label: getFullName(member),
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
  const goToCreatePage = () => {
    pushTo(PATH.designerCreateProject);
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
        const dueDay = moment(value).diff(moment(moment().format('YYYY-MM-DD')), 'days') ?? 0;
        let suffix = 'day';
        if (dueDay > 1 || dueDay < -1) {
          suffix += 's';
        }
        return (
          <BodyText
            level={5}
            fontFamily="Roboto"
            customClass={`${styles.dueDayText} ${dueDay < 0 ? 'late' : ''}`}>
            {dueDay === 0 ? 'Today' : `${dueDay} ${suffix}`}
          </BodyText>
        );
      },
    },
    {
      title: 'Assign Team',
      dataIndex: 'assign_teams',
      align: 'center',
      render: (_value, record) => {
        console.log(record);

        if (isEmpty(record.assign_teams)) {
          return <UserAddIcon onClick={showAssignTeams(record)} className="icon-align" />;
        }
        return (
          <div onClick={showAssignTeams(record)} className={styles.asignTeamMember}>
            {record.assign_teams.map((teamProfile, key) => (
              <TeamIcon key={key} avatar={teamProfile.avatar} name={teamProfile.name} />
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
            actionItems={[
              {
                type: 'updated',
                onClick: () => goToUpdateProject(projectId),
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
        }}>
        <CustomTable
          rightAction={<CustomPlusButton onClick={goToCreatePage} />}
          title={'PROJECTS'}
          columns={setDefaultWidthForEachColumn(MainColumns, 7)}
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

export default ProjectList;
