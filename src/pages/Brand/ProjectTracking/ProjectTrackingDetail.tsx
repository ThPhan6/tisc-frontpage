import { useEffect } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { useGetParamId } from '@/helper/hook';
import { getProjectTrackingSummary } from '@/services/project-tracking.api';

import store, { useAppSelector } from '@/reducers';
import { openModal } from '@/reducers/modal';

import { Detail } from './components/Detail';
import { MenuSummary } from '@/components/MenuSummary';
import { TableHeader } from '@/components/Table/TableHeader';

import styles from './index.less';

const ProjectTrackingDetail = () => {
  const idProject = useGetParamId();
  const summary = useAppSelector((state) => state.summary.summaryProjectTracking);
  const workspace = location.pathname.indexOf('dashboard') !== -1;

  useEffect(() => {
    getProjectTrackingSummary(workspace);
  }, []);

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <MenuSummary
              typeMenu={'brand'}
              menuSummaryData={summary}
              containerClass={styles.customHeader}
            />
          );
        }}
      >
        <TableHeader
          title={'PROJECT TRACKING'}
          rightAction={
            <InfoIcon
              className={styles.iconInfor}
              onClick={() => store.dispatch(openModal({ type: 'Project Tracking Legend' }))}
            />
          }
          customClass={styles.customTitle}
        />
        <Detail projectId={idProject} />
      </PageContainer>
    </div>
  );
};

export default ProjectTrackingDetail;
