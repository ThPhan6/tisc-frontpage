import React, { useEffect, useState } from 'react';

import { ProjectTabKeys } from './constants/tab';
import { useParams } from 'umi';

import { getProjectById } from '@/features/project/services';

import type { ProjectDetailProps } from '@/features/project/types';

import ProjectDetailHeader from './components/ProjectDetailHeader';
import { CustomTabPane } from '@/components/Tabs';

import GeneralInformation from './tabs/BasicInformation';
import ProductConsidered from './tabs/ProductConsidered';
import ProductSpecification from './tabs/ProductSpecification';
import SpaceManagement from './tabs/SpaceManagement';

const ProjectUpdatePage: React.FC = () => {
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

      {selectedTab === ProjectTabKeys.basicInformation ? (
        <CustomTabPane active={selectedTab === ProjectTabKeys.basicInformation} lazyLoad>
          <GeneralInformation project={project} setProject={setProject} />
        </CustomTabPane>
      ) : null}

      {selectedTab === ProjectTabKeys.zoneAreaRoom ? (
        <CustomTabPane active={selectedTab === ProjectTabKeys.zoneAreaRoom} lazyLoad>
          <SpaceManagement projectId={projectId} />
        </CustomTabPane>
      ) : null}

      {selectedTab === ProjectTabKeys.productConsidered ? (
        <CustomTabPane active={selectedTab === ProjectTabKeys.productConsidered} lazyLoad>
          <ProductConsidered />
        </CustomTabPane>
      ) : null}

      {selectedTab === ProjectTabKeys.productSpecified ? (
        <CustomTabPane active={selectedTab === ProjectTabKeys.productSpecified} lazyLoad>
          <ProductSpecification />
        </CustomTabPane>
      ) : null}
    </div>
  );
};

export default ProjectUpdatePage;
