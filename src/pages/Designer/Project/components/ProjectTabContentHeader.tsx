import React from 'react';

import styles from '../styles/project-detail-header.less';

const ProjectTabContentHeader: React.FC = ({ children }) => {
  return <div className={styles.tabContentheader}>{children}</div>;
};

export default ProjectTabContentHeader;
