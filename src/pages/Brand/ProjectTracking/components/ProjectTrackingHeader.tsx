import { FC, useEffect } from 'react';

import { GlobalFilter, ProjectStatusFilters } from '../constant';

import { getProjectTrackingSummary } from '@/services/project-tracking.api';

import { DropDownFilterValueProps } from '@/components/TopBar/types';
import { useAppSelector } from '@/reducers';

import { MenuSummary } from '@/components/MenuSummary';
import TopBarDropDownFilter from '@/components/TopBar/TopBarDropDownFilter';

import styles from '../index.less';

interface ProjectTrackingHeaderProps {
  selectedFilter: DropDownFilterValueProps;
  setSelectedFilter: (selectedFilter: DropDownFilterValueProps) => void;
}
export const ProjectTrackingHeader: FC<ProjectTrackingHeaderProps> = ({
  selectedFilter,
  setSelectedFilter,
  children,
}) => {
  const summary = useAppSelector((state) => state.summary.summaryProjectTracking);

  useEffect(() => {
    getProjectTrackingSummary();
  }, []);

  return (
    <div className={styles.customHeader}>
      <MenuSummary typeMenu={'brand'} menuSummaryData={summary} />
      <div style={{ display: 'flex' }}>
        <TopBarDropDownFilter
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          filterLabel="Project Status"
          globalFilter={GlobalFilter}
          dynamicFilter={ProjectStatusFilters}
          isShowFilter
        />
        {children}
      </div>
    </div>
  );
};
