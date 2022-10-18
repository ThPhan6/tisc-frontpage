import { useEffect, useState } from 'react';

import { GlobalFilter } from '@/pages/Designer/Project/constants/filter';
import { PageContainer } from '@ant-design/pro-layout';

import { useGetParamId } from '@/helper/hook';
import { getProjectTrackingPagination } from '@/services/project-tracking.api';

import { ProjecTrackingList } from '@/types/project-tracking.type';

import { Detail } from '../ProjectTracking/components/Detail';
import { ProjectTrackingHeader } from '../ProjectTracking/components/ProjectTrackingHeader';
import { ProjectCard } from './components/ProjectCard';

const MyWorkspace = () => {
  const projectId = useGetParamId();
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);

  const [listCard, setListCard] = useState<ProjecTrackingList[]>();

  useEffect(() => {
    getProjectTrackingPagination(
      {
        page: 1,
        pageSize: 99999,
        project_status: selectedFilter.id === GlobalFilter.id ? undefined : selectedFilter.id,
      },
      (response) => {
        setListCard(response.data);
      },
    );
  }, [selectedFilter]);

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <ProjectTrackingHeader
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          );
        }}>
        {projectId ? (
          <Detail projectId={projectId} height="calc(100vh - 152px)" />
        ) : (
          <ProjectCard data={listCard} />
        )}
      </PageContainer>
    </div>
  );
};
export default MyWorkspace;
