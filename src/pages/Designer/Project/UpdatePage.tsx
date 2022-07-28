import { CustomTabPane } from '@/components/Tabs';
import React, { useState, useEffect } from 'react';
import GeneralInformation from './tabs/BasicInformation';
import ProjectDetailHeader from './components/ProjectDetailHeader';
import SpaceManagement from './tabs/SpaceManagement';
import { ProjectTabKeys } from './constants/tab';
import ProductConsidered from './tabs/ProductConsidered';
import ProductSpecification from './tabs/ProductSpecification';
import { getProjectById } from '@/services';
import type { ProjectDetailProps } from '@/types';
import { useParams } from 'umi';

const ProjectCreatePage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const projectId = params?.id || '';
  const [selectedTab, setSelectedTab] = useState<ProjectTabKeys>(ProjectTabKeys.basicInformation);
  const [project, setProject] = useState<ProjectDetailProps>();
  useEffect(() => {
    if (projectId) {
      getProjectById(projectId).then((projectDetail) => {
        if (projectDetail) {
          setProject(projectDetail);
        }
      });
    }
  }, [projectId]);

  return (
    <div>
      <ProjectDetailHeader activeKey={selectedTab} onChangeTab={setSelectedTab} project={project} />

      <CustomTabPane active={selectedTab === ProjectTabKeys.basicInformation}>
        <GeneralInformation project={project} setProject={setProject} />
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
