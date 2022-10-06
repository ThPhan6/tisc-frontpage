import React from 'react';

import { GlobalFilter, ProjectFilters } from '../../constants/filter';

import { DropDownFilterProps } from '@/components/TopBar/types';
import type { ProjectSummaryData } from '@/features/project/types';

import TopBarSummaryHasFilter from '@/components/TopBar';
import TopBarDropDownFilter from '@/components/TopBar/TopBarDropDownFilter';

import ProjectSummary from './ProjectSummary';

interface ProjectListHeaderProps extends DropDownFilterProps {
  summaryData?: ProjectSummaryData;
}

const ProjectListHeader: React.FC<ProjectListHeaderProps> = ({
  summaryData,
  selectedFilter,
  setSelectedFilter,
}) => {
  return (
    <TopBarSummaryHasFilter>
      <ProjectSummary summaryData={summaryData} />
      <TopBarDropDownFilter
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filterLabel="Project Status"
        globalFilter={GlobalFilter}
        dynamicFilter={ProjectFilters}
        isShowFilter
      />
    </TopBarSummaryHasFilter>
  );
};
export default ProjectListHeader;
