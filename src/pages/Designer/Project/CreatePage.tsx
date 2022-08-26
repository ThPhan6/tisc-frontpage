import React, { useState } from 'react';

import { ProjectTabKeys } from './constants/tab';

import ProjectDetailHeader from './components/ProjectDetailHeader';
import { CustomTabPane } from '@/components/Tabs';

import GeneralInformation from './tabs/BasicInformation';

const ProjectCreatePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<ProjectTabKeys>(ProjectTabKeys.basicInformation);
  return (
    <div>
      <ProjectDetailHeader activeKey={selectedTab} onChangeTab={setSelectedTab} activeOnlyGeneral />

      <CustomTabPane active={selectedTab === ProjectTabKeys.basicInformation}>
        <GeneralInformation />
      </CustomTabPane>
    </div>
  );
};

export default ProjectCreatePage;
