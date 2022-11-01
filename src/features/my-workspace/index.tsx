import { useEffect, useState } from 'react';

import { USER_ROLE } from '@/constants/userRoles';
import { GlobalFilter } from '@/pages/Designer/Project/constants/filter';
import { PageContainer } from '@ant-design/pro-layout';

import { getProjectPagination, getProjectSummary } from '../project/services';
import { getBrandCards } from '../user-group/services';
import { useGetUserRoleFromPathname } from '@/helper/hook';
import { getProjectTrackingPagination } from '@/services/project-tracking.api';

import { ProjectListProps, ProjectSummaryData } from '../project/types';
import { BrandCard } from '../user-group/types';
import { ProjecTrackingList } from '@/types/project-tracking.type';

import { ProjectTrackingHeader } from '../../pages/Brand/ProjectTracking/components/ProjectTrackingHeader';
import { ProjectCard } from './components/ProjectCard';
import { setLoadingAction } from '@/components/LoadingPage/slices';
import ProjectListHeader from '@/pages/Designer/Project/components/ProjectListHeader';

const MyWorkspace = () => {
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);

  const [summaryData, setSummaryData] = useState<ProjectSummaryData>();

  const [listCard, setListCard] = useState<ProjecTrackingList[] | BrandCard[] | ProjectListProps[]>(
    [],
  );

  const currentUser = useGetUserRoleFromPathname();
  const isTiscUser = currentUser === USER_ROLE.tisc;
  const isBrandUser = currentUser === USER_ROLE.brand;
  const isDesignerUser = currentUser === USER_ROLE.design;

  /// for tisc
  useEffect(() => {
    if (isTiscUser) {
      setLoadingAction(true);
      getBrandCards().then((res) => {
        setLoadingAction(false);
        if (res) {
          setListCard(res);
        }
      });
    }
  }, []);

  /// for brand
  useEffect(() => {
    if (isBrandUser) {
      setLoadingAction(true);
      getProjectTrackingPagination(
        {
          page: 1,
          pageSize: 99999,
          project_status: selectedFilter.id === GlobalFilter.id ? undefined : selectedFilter.id,
        },
        (response) => {
          setLoadingAction(false);
          setListCard(response.data);
        },
      );
    }
  }, [selectedFilter]);

  /// for designer
  useEffect(() => {
    if (isDesignerUser) {
      getProjectSummary().then((res) => {
        if (res) {
          setSummaryData(res);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (isDesignerUser) {
      getProjectPagination(
        {
          page: 1,
          pageSize: 99999,
          filter: {
            status: selectedFilter.id === GlobalFilter.id ? undefined : selectedFilter.id,
          },
        },
        (response) => {
          setListCard(response.data);
        },
      );
    }
  }, [selectedFilter]);

  const renderHeader = () => {
    if (isTiscUser) {
      return undefined;
    }

    if (isBrandUser) {
      return (
        <ProjectTrackingHeader
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
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
