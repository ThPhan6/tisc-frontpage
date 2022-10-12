import { useState } from 'react';

import { ProjectSummaryData } from '@/features/project/types';

import { TopBarMenuSummary } from '@/components/TopBar/TopBarMenuSummary';

interface ProjectSummaryProps {
  summaryData?: ProjectSummaryData;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ summaryData }) => {
  const [state, setState] = useState<ProjectSummaryData>({
    projects: 0,
    live: 0,
    on_hold: 0,
    archived: 0,
  });

  return (
    <TopBarMenuSummary
      state={state}
      setState={setState}
      summaryData={summaryData}
      summaryType="projects"
    />
  );
};
export default ProjectSummary;
