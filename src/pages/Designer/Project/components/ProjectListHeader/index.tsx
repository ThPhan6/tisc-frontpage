import React from 'react';
import ProjectSummary from './ProjectSummary';
import ProjectFilter from './ProjectFilter';
import styles from '../../styles/project-list-header.less';
import type { ProjectFilterProps } from './ProjectFilter';

interface ProjectListHeaderProps extends ProjectFilterProps {}

const ProjectListHeader: React.FC<ProjectListHeaderProps> = (props) => {
  return (
    <div className={styles.projectHeader}>
      <ProjectSummary />
      <ProjectFilter {...props} />
    </div>
  );
};
export default ProjectListHeader;
