import { useEffect, useState } from 'react';

// import { GlobalFilter } from '@/pages/Designer/Project/constants/filter';
import { PageContainer } from '@ant-design/pro-layout';

import { getBrandSummary } from '@/features/user-group/services';
import { useGetParamId } from '@/helper/hook';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';

import { Detail } from './components/Detail';
import { ProjectCard } from './components/ProjectCard';
import { MenuSummary } from '@/components/MenuSummary';

import styles from './index.less';

const MyWorkspace = () => {
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);
  const idProject = useGetParamId();
  // const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);
  useEffect(() => {
    getBrandSummary().then((data) => {
      if (data) {
        setSummaryData(data);
      }
    });
  }, []);
  //   const [data, setData] = useState<>
  const data = [
    {
      id: '1',
      name: 'test',
      country: 'Da Nang',
      request: '3',
      notifi: '3',
      unread: true,
      teams: [
        {
          id: 'f805b4e0-9b55-41a0-8cea-d43b02e14bc1',
          firstname: 'Tisc',
          lastname: 'consultant',
          avatar: null,
        },
        {
          id: '3089fad1-943e-420c-bd4d-aa945a7e3631',
          firstname: 'Loc',
          lastname: 'Nguyen',
          avatar: null,
        },
        {
          id: '19419580-4a0c-41a0-9b23-fe2ff63c8973',
          firstname: 'Loc',
          lastname: 'Nguyen',
          avatar: null,
        },
      ],
    },
  ];

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <div className={styles.customHeader}>
              <MenuSummary typeMenu={'brand'} menuSummaryData={summaryData} />
              {/* <ProjectFilter
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
              /> */}
            </div>
          );
        }}>
        {idProject ? (
          <Detail projectId={idProject} activeOnlyDesignFirm />
        ) : (
          <ProjectCard data={data} />
        )}
      </PageContainer>
    </div>
  );
};
export default MyWorkspace;
