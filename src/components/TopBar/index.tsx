import React from 'react';

import styles from './index.less';

const TopBarSummaryHasFilter: React.FC = ({ children }) => (
  <div className={styles.projectHeader}>{children}</div>
);

export default TopBarSummaryHasFilter;
