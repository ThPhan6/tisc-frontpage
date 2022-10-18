import { FC, useEffect, useState } from 'react';

import { GlobalFilter, ProjectStatusFilters } from '../constant';

import { getProjectTrackingSummary } from '@/services/project-tracking.api';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import { DropDownFilterValueProps } from '@/components/TopBar/types';

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
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);
  useEffect(() => {
    getProjectTrackingSummary().then((data) => {
      if (data) {
        setSummaryData(data);
      }
    });
  }, []);
  return (
    <div className={styles.customHeader}>
      <MenuSummary typeMenu={'brand'} menuSummaryData={summaryData} />
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
