import { CustomTabPane } from '@/components/Tabs';
import React, { useState } from 'react';
import GeneralInformation from './tabs/BasicInformation';
import ProjectDetailHeader from './components/ProjectDetailHeader';
import SpaceManagement from './tabs/SpaceManagement';
import { ProjectTabKeys } from './constants/tab';
import ProductConsidered from './tabs/ProductConsidered';
import ProductSpecification from './tabs/ProductSpecification';

const ProjectCreatePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<ProjectTabKeys>(ProjectTabKeys.basicInformation);
  return (
    <div>
      <ProjectDetailHeader activeKey={selectedTab} onChangeTab={setSelectedTab} />

      <CustomTabPane active={selectedTab === ProjectTabKeys.basicInformation}>
        <GeneralInformation />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectTabKeys.zoneAreaRoom}>
        <SpaceManagement />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectTabKeys.productConsidered}>
        <ProductConsidered />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectTabKeys.productSpecified}>
        <ProductSpecification />
      </CustomTabPane>
    </div>
  );
};

export default ProjectCreatePage;
