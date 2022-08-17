import React from 'react';
import ProjectSummary from './ProjectSummary';
import ProjectFilter from './ProjectFilter';
import styles from '../../styles/project-list-header.less';
import type { ProjectFilterProps } from './ProjectFilter';
import type { ProjectSummaryData } from '@/features/project/types';

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
