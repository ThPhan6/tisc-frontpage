import React, { useEffect, useState } from 'react';

import { ProjectTabKeys } from './constants/tab';
import { useAccess } from 'umi';

import { getProjectById } from '@/features/project/services';
import { useGetParamId } from '@/helper/hook';

import type { ProjectDetailProps } from '@/features/project/types';

import ProjectDetailHeader from './components/ProjectDetailHeader';
import { CustomTabPane } from '@/components/Tabs';

import GeneralInformation from './tabs/BasicInformation';
import ProductConsidered from './tabs/ProductConsidered';
import ProductSpecification from './tabs/ProductSpecification';
import SpaceManagement from './tabs/SpaceManagement';

const ProjectUpdatePage: React.FC = () => {
  const projectId = useGetParamId();
  const accessPermission = useAccess();
  const basicInformationTab = accessPermission.design_project_basic_information;
  const zoneAreaRoomTab = accessPermission.design_project_zone_area_zoom;
  const productConsideredTab = accessPermission.design_project_product_considered;

  const brandProjectTrackingRequestTab = accessPermission.brand_project_tracking;
  const productSpecifiedTab =
    accessPermission.design_project_product_specified || brandProjectTrackingRequestTab;

  const getCurrentActiveTab = () => {
    if (basicInformationTab) {
      return ProjectTabKeys.basicInformation;
    }
    if (zoneAreaRoomTab) {
      return ProjectTabKeys.zoneAreaRoom;
    }
    if (productConsideredTab) {
      return ProjectTabKeys.productConsidered;
    }
    return ProjectTabKeys.productSpecified;
  };

  const [selectedTab, setSelectedTab] = useState<ProjectTabKeys>(getCurrentActiveTab());

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

      <CustomTabPane
        active={selectedTab === ProjectTabKeys.basicInformation}
        disable={!basicInformationTab}
      >
        <GeneralInformation project={project} setProject={setProject} />
      </CustomTabPane>

      <CustomTabPane
        active={selectedTab === ProjectTabKeys.zoneAreaRoom}
        disable={!zoneAreaRoomTab}
        lazyLoad
        forceReload
      >
        <SpaceManagement projectId={projectId} />
      </CustomTabPane>

      <CustomTabPane
        active={selectedTab === ProjectTabKeys.productConsidered}
        disable={!productConsideredTab}
        lazyLoad
        forceReload
      >
        <ProductConsidered />
      </CustomTabPane>

      <CustomTabPane
        active={selectedTab === ProjectTabKeys.productSpecified}
        disable={!productSpecifiedTab}
        lazyLoad
        forceReload
      >
        <ProductSpecification />
      </CustomTabPane>
    </div>
  );
};

export default ProjectUpdatePage;
