import React from 'react';

import type { ProjectSummaryData } from '@/features/project/types';

import styles from '../../styles/project-list-header.less';
import ProjectFilter from './ProjectFilter';
import type { ProjectFilterProps } from './ProjectFilter';
import ProjectSummary from './ProjectSummary';

interface ProjectListHeaderProps extends ProjectFilterProps {
  summaryData?: ProjectSummaryData;
}
const ProjectListHeader: React.FC<ProjectListHeaderProps> = ({ summaryData, ...props }) => {
  return (
    <div className={styles.projectHeader}>
      <ProjectSummary summaryData={summaryData} />
      <ProjectFilter {...props} />
    </div>
  );
};
export default ProjectListHeader;
