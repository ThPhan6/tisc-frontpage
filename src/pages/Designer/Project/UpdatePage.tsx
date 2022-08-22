import { CustomTabPane } from '@/components/Tabs';
import React, { useState, useEffect } from 'react';
import GeneralInformation from './tabs/BasicInformation';
import ProjectDetailHeader from './components/ProjectDetailHeader';
import SpaceManagement from './tabs/SpaceManagement';
import { ProjectTabKeys } from './constants/tab';
import ProductConsidered from './tabs/ProductConsidered';
import ProductSpecification from './tabs/ProductSpecification';
import type { ProjectDetailProps } from '@/features/project/types';
import { useParams } from 'umi';
import { getProjectById } from '@/features/project/services';

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

      <CustomTabPane active={selectedTab === ProjectTabKeys.basicInformation} lazyLoad>
        <GeneralInformation project={project} setProject={setProject} />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectTabKeys.zoneAreaRoom} lazyLoad>
        <SpaceManagement projectId={projectId} />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectTabKeys.productConsidered} lazyLoad>
        <ProductConsidered />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectTabKeys.productSpecified} lazyLoad>
        <ProductSpecification />
      </CustomTabPane>
    </div>
  );
};

export default ProjectCreatePage;
