import React, { HTMLAttributes } from 'react';

import styles from '../styles/project-detail-header.less';

const ProjectTabContentHeader: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  return <div className={styles.tabContentheader} {...props} />;
};

export default ProjectTabContentHeader;
