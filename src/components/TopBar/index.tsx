import React from 'react';

import { useScreen } from '@/helper/common';

import styles from './index.less';

const TopBarSummaryHasFilter: React.FC = ({ children }) => {
  const { isMobile } = useScreen();

  return (
    <div className={`${styles.projectHeader} ${isMobile ? 'border-top' : ''}`}>{children}</div>
  );
};

export default TopBarSummaryHasFilter;
