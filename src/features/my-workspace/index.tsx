import { useEffect, useState } from 'react';

import { GlobalFilter } from '@/pages/Designer/Project/constants/filter';
import { PageContainer } from '@ant-design/pro-layout';

import { getDesignerWorkspace, getProjectSummary } from '../project/services';
import { getTiscWorkspace } from '../user-group/services';
import { useCheckPermission } from '@/helper/hook';
import { getBrandWorkspace } from '@/services/project-tracking.api';

import { ProjectListProps, ProjectSummaryData } from '../project/types';
import { BrandCard } from '../user-group/types';
import { ProjecTrackingList } from '@/types/project-tracking.type';

import { ProjectTrackingHeader } from '../../pages/Brand/ProjectTracking/components/ProjectTrackingHeader';
import MenuHeaderSummary from '../user-group/components/MenuHeaderSummary';
import { ProjectCard } from './components/ProjectCard';
import ProjectListHeader from '@/pages/Designer/Project/components/ProjectListHeader';

import { hidePageLoading, showPageLoading } from '../loading/loading';

const MyWorkspace = () => {
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);

  const [summaryData, setSummaryData] = useState<ProjectSummaryData>();

  const [listCard, setListCard] = useState<ProjecTrackingList[] | BrandCard[] | ProjectListProps[]>(
    [],
  );

  const isTiscUser = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const isBrandUser = useCheckPermission(['Brand Admin', 'Brand Team']);
  const isDesignerUser = useCheckPermission(['Design Admin', 'Design Team']);

  /// for tisc
  useEffect(() => {
    if (isTiscUser) {
      showPageLoading();
      getTiscWorkspace().then((res) => {
        hidePageLoading();
        if (res) {
          setListCard(res);
        }
      });
    }
  }, []);

  /// for brand
  useEffect(() => {
    if (isBrandUser) {
      showPageLoading();
      getBrandWorkspace(
        {
          project_status: selectedFilter.id === GlobalFilter.id ? undefined : selectedFilter.id,
        },
        (data) => {
          hidePageLoading();
          setListCard(data);
        },
      );
    }
  }, [selectedFilter]);

  /// for designer
  useEffect(() => {
    if (isDesignerUser) {
      getProjectSummary(true).then((res) => {
        if (res) {
          setSummaryData(res);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (isDesignerUser) {
      showPageLoading();
      getDesignerWorkspace(
        {
          filter: selectedFilter.id === GlobalFilter.id ? undefined : { status: selectedFilter.id },
        },
        (data) => {
          hidePageLoading();
          setListCard(data);
        },
      );
    }
  }, [selectedFilter]);

  const renderHeader = () => {
    if (isTiscUser) {
      return <MenuHeaderSummary type="brand" />;
    }

    if (isBrandUser) {
      return (
        <ProjectTrackingHeader
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          workspace
        />
      );
    }

    return (
      <ProjectListHeader
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        summaryData={summaryData}
      />
    );
  };

  return (
    <PageContainer pageHeaderRender={renderHeader}>
      <ProjectCard
        data={listCard}
        isTiscUser={isTiscUser}
        isBrandUser={isBrandUser}
        isDesignerUser={isDesignerUser}
      />
    </PageContainer>
  );
};
export default MyWorkspace;
