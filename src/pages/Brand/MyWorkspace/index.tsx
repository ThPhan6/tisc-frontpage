import { useEffect, useState } from 'react';

import { ProjectStatusFilters } from '../ProjectTracking/constant';
import { GlobalFilter } from '@/pages/Designer/Project/constants/filter';
import { PageContainer } from '@ant-design/pro-layout';

import { useGetParamId } from '@/helper/hook';
import {
  getProjectTrackingPagination,
  getProjectTrackingSummary,
} from '@/services/project-tracking.api';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import { DEFAULT_PROJECT_LIST, ProjecTrackingList } from '@/types/project-tracking.type';

import { Detail } from '../ProjectTracking/components/Detail';
import { ProjectCard } from './components/ProjectCard';
import { MenuSummary } from '@/components/MenuSummary';
import TopBarDropDownFilter from '@/components/TopBar/TopBarDropDownFilter';

import styles from './index.less';

const MyWorkspace = () => {
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);
  const projectId = useGetParamId();
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);

  const [listCard, setListCard] = useState<ProjecTrackingList[]>(DEFAULT_PROJECT_LIST);
  useEffect(() => {
    getProjectTrackingSummary().then((data) => {
      if (data) {
        setSummaryData(data);
      }
    });
    getProjectTrackingPagination({ page: 1, pageSize: 99999 }, (response) => {
      setListCard(response.data);
    });
  }, []);

  // useEffect(() => {
  //   window.location.reload();
  // }, []);

  console.log(listCard);
  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <div className={styles.customHeader}>
              <MenuSummary typeMenu={'brand'} menuSummaryData={summaryData} />
              <TopBarDropDownFilter
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                filterLabel="Project Status"
                globalFilter={GlobalFilter}
                dynamicFilter={ProjectStatusFilters}
                isShowFilter
              />
            </div>
          );
        }}>
        {projectId ? (
          <Detail projectId={projectId} activeOnlyDesignFirm height="calc(100vh - 152px)" />
        ) : (
          <ProjectCard data={listCard} />
        )}
      </PageContainer>
    </div>
  );
};
export default MyWorkspace;
