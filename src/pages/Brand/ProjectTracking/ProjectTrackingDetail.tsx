import { useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { useGetParamId } from '@/helper/hook';
import { getOneProjectTracking, getProjectTrackingSummary } from '@/services/project-tracking.api';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import { DEFAULT_PROJECT_DETAIL, ProjectDetail } from '@/types/project-tracking.type';

import { BrandProject } from './components/BrandProject';
import { BrandRequests } from './components/BrandRequests';
import { DesignFirm } from './components/DesignFirm';
import { LegendModal } from '@/components/LegendModal/LegendModal';
import { MenuSummary } from '@/components/MenuSummary';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from './index.less';

const LIST_TAB = [
  { tab: 'DESIGN FIRM', key: 'design_firm' },
  { tab: 'PROJECT', key: 'project' },
  { tab: 'REQUESTS', key: 'requests' },
  { tab: 'NOTIFICATIONS', key: 'notification' },
];

type Tab = 'design_firm' | 'project' | 'requests' | 'notification';

const ProjectTrackingDetail = () => {
  const [activeKey, setActiveKey] = useState<Tab>('design_firm');
  const [data, setData] = useState<ProjectDetail>(DEFAULT_PROJECT_DETAIL);
  const [openInformationModal, setOpenInformationModal] = useState(false);
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);
  const idProject = useGetParamId();

  useEffect(() => {
    if (idProject) {
      getOneProjectTracking(idProject).then((res) => {
        if (res) {
          setData(res);
        }
      });
    }
    getProjectTrackingSummary().then((summary) => {
      if (summary) {
        setSummaryData(summary);
      }
    });
  }, []);

  console.log('data', data);
  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <div className={styles.customHeader}>
              <MenuSummary typeMenu={'brand'} menuSummaryData={summaryData} />
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
        <Row style={{ marginTop: '8px' }}>
          <Col span={12}>
            <div style={{ background: '#fff', height: 'calc(100vh - 208px)' }}>
              <TableHeader
                title={data.projects.name}
                rightAction={
                  <CloseIcon onClick={() => history.back()} style={{ cursor: 'pointer' }} />
                }
              />
              <CustomTabs
                listTab={LIST_TAB}
                centered={true}
                tabPosition="top"
                tabDisplay="space"
                onChange={(key) => setActiveKey(key as Tab)}
                activeKey={activeKey}
              />

              <CustomTabPane active={activeKey === 'design_firm'}>
                <DesignFirm designFirm={data.designFirm} />
              </CustomTabPane>

              <CustomTabPane active={activeKey === 'project'}>
                <BrandProject project={data.projects} />
              </CustomTabPane>

              <CustomTabPane active={activeKey === 'requests'}>
                <BrandRequests requests={data.projectRequests} />
              </CustomTabPane>

              <CustomTabPane active={activeKey === 'notification'}>
                {/* <BrandRequests requests={data.notifications} type="notification" /> */}
              </CustomTabPane>
            </div>
          </Col>
        </Row>
      </PageContainer>
      <LegendModal visible={openInformationModal} setVisible={setOpenInformationModal} />
    </div>
  );
};

export default ProjectTrackingDetail;
