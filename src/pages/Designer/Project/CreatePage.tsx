import { CustomTabPane } from '@/components/Tabs';
import React, { useState } from 'react';
import GeneralInformation from './tabs/BasicInformation';
import ProjectDetailHeader from './components/ProjectDetailHeader';
import { ProjectTabKeys } from './constants/tab';

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
