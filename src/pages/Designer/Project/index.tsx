import React, { useEffect, useRef, useState } from 'react';

import { FilterStatusIcons, FilterValues, GlobalFilter } from './constants/filter';
import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';

import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';

import {
  deleteProject,
  getProjectPagination,
  getProjectSummary,
} from '@/features/project/services';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { isEmpty } from 'lodash';

import type { TableColumnItem } from '@/components/Table/types';
import type { ProjectListProps, ProjectSummaryData } from '@/features/project/types';

import ProjectListHeader from './components/ProjectListHeader';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { BodyText } from '@/components/Typography';

import styles from './styles/project-list.less';
import moment from 'moment';

const ProjectList: React.FC = () => {
  const tableRef = useRef<any>();
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);
  const [summaryData, setSummaryData] = useState<ProjectSummaryData>();
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

  const handleAssignTeams = () => {
    message.info('This feature will coming at Phase 4!');
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
        if (isEmpty(record.assign_teams)) {
          return <UserAddIcon onClick={handleAssignTeams} className="icon-align" />;
        }
        return (
          <div onClick={handleAssignTeams} className={styles.asignTeamMember}>
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
        columns={MainColumns}
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
  );
};

export default ProjectList;
