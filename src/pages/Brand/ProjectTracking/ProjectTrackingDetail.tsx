import { useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { useGetParamId } from '@/helper/hook';
import { getProjectTrackingSummary } from '@/services/project-tracking.api';

import { useAppSelector } from '@/reducers';

import { Detail } from './components/Detail';
import { LegendModal } from '@/components/LegendModal/LegendModal';
import { MenuSummary } from '@/components/MenuSummary';
import { TableHeader } from '@/components/Table/TableHeader';

import styles from './index.less';

const ProjectTrackingDetail = () => {
  const [openInformationModal, setOpenInformationModal] = useState(false);
  const idProject = useGetParamId();
  const summary = useAppSelector((state) => state.summary.summaryProjectTracking);

  useEffect(() => {
    getProjectTrackingSummary();
  }, []);

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <div className={styles.customHeader}>
              <MenuSummary typeMenu={'brand'} menuSummaryData={summary} />
            </div>
          );
        }}>
        <TableHeader
          title={'PROJECT TRACKING'}
          rightAction={
            <InfoIcon className={styles.iconInfor} onClick={() => setOpenInformationModal(true)} />
          }
          customClass={styles.customTitle}
        />
        <Detail
          projectId={idProject}
          height="calc(100vh - 208px)"
          contentHeight="calc(100vh - 360px)"
        />
      </PageContainer>
      <LegendModal visible={openInformationModal} setVisible={setOpenInformationModal} />
    </div>
  );
};

export default ProjectTrackingDetail;
