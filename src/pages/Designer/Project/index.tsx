import { useState, useEffect } from 'react';
import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';
import { ActionMenu } from '@/components/Action';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText } from '@/components/Typography';
import type { TableColumnItem } from '@/components/Table/types';
// import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { getProjectPagination } from '@/services';
import type { ProjectListProps } from '@/types';
import React, { useRef } from 'react';
import ProjectListHeader from './components/ProjectListHeader';
import { ProfileIcon } from '@/components/ProfileIcon';
import { PageContainer } from '@ant-design/pro-layout';
import { FilterStatusIcons } from './constants/filter';
import { getFullName } from '@/helper/utils';
import { isEmpty } from 'lodash';
import { message } from 'antd';
import { FilterValues, GlobalFilter } from './constants/filter';

import styles from './styles/project-list.less';

const ProjectList: React.FC = () => {
  const tableRef = useRef<any>();
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);

  const goToCreatePage = () => {
    pushTo(PATH.designerCreateProject);
  };

  // const handleUpdateProject = (id: string) => {
  // pushTo(`${activePath}/${id}`);
  // };
  // const handleCreateProject = (id: string) => {
  //   pushTo(`${activePath}/${id}`);
  // };
  // const handleDeleteAttribute = (id: string) => {
  //   confirmDelete(() => {
  //     deleteAttribute(id).then((isSuccess) => {
  //       if (isSuccess) {
  //         tableRef.current.reload();
  //       }
  //     });
  //   });
  // };

  const handleAssignTeams = () => {
    message.info('This feature will coming at Phase 4!');
  };

  /// reload table depends on filter
  useEffect(() => {
    tableRef.current.reload();
  }, [selectedFilter]);

  const MainColumns: TableColumnItem<ProjectListProps>[] = [
    {
      title: 'Status',
      dataIndex: 'status',
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
      dataIndex: 'building',
      sorter: true,
    },
    {
      title: 'Design Due',
      dataIndex: 'design_due',
      render: (value) => {
        const dueDay = value ?? 0;
        let suffix = 'day';
        if (dueDay > 1 || dueDay < -1) {
          suffix += 's';
        }
        return (
          <BodyText
            level={6}
            fontFamily="Roboto"
            customClass={`${styles.dueDayText} ${dueDay < 0 ? 'late' : ''}`}
          >
            {dueDay} {suffix}
          </BodyText>
        );
      },
    },
    {
      title: 'Assign Teams',
      dataIndex: 'assign_teams',
      render: (_value, record) => {
        if (isEmpty(record.assign_teams)) {
          return <UserAddIcon onClick={handleAssignTeams} />;
        }
        return (
          <div onClick={handleAssignTeams}>
            {record.assign_teams.map((teamProfile, key) => (
              <ProfileIcon key={key} name={getFullName(teamProfile)} />
            ))}
          </div>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: () => {
        return <ActionMenu />;
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
          />
        );
      }}
    >
      <CustomTable
        rightAction={<CustomPlusButton onClick={goToCreatePage} />}
        title={'PROJECTS'}
        columns={MainColumns}
        fetchDataFunc={getProjectPagination}
        extraParams={
          selectedFilter && selectedFilter.id !== FilterValues.global
            ? {
                status: selectedFilter.id,
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
