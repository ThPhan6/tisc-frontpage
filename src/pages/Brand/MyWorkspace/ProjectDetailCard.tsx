import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { GlobalFilter } from '@/pages/Designer/Project/constants/filter';
import { PageContainer } from '@ant-design/pro-layout';
import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { getBrandSummary } from '@/features/user-group/services';
import { pushTo } from '@/helper/history';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';

import { BrandProject } from './components/BrandProject';
import { BrandRequests } from './components/BrandRequests';
import { DesignFirm } from './components/DesignFirm';
import { MenuSummary } from '@/components/MenuSummary';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import ProjectFilter from '@/pages/Designer/Project/components/ProjectListHeader/ProjectFilter';

import styles from './index.less';

const LIST_TAB = [
  { tab: 'DESIGN FIRM', key: 'design_firm' },
  { tab: 'PROJECT', key: 'project' },
  { tab: 'REQUESTS', key: 'requests' },
  { tab: 'NOTIFICATIONS', key: 'notification' },
];

type Tab = 'design_firm' | 'project' | 'requests' | 'notification';

const ProjectDetailCard = () => {
  const [activeKey, setActiveKey] = useState<Tab>('design_firm');
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);
  useEffect(() => {
    getBrandSummary().then((data) => {
      if (data) {
        setSummaryData(data);
      }
    });
  }, []);

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <div className={styles.customHeader}>
              <MenuSummary typeMenu={'brand'} menuSummaryData={summaryData} />
              <ProjectFilter
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
              />
            </div>
          );
        }}>
        <Row>
          <Col span={12}>
            <div className={styles.detailCard}>
              <TableHeader
                // title={data.name}
                title="Project name"
                rightAction={
                  <CloseIcon
                    onClick={() => pushTo(PATH.brandHomePage)}
                    style={{ cursor: 'pointer' }}
                  />
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
                <DesignFirm />
              </CustomTabPane>

              <CustomTabPane active={activeKey === 'project'}>
                <BrandProject />
              </CustomTabPane>

              <CustomTabPane active={activeKey === 'requests'}>
                <BrandRequests />
              </CustomTabPane>

              <CustomTabPane active={activeKey === 'notification'}></CustomTabPane>
            </div>
          </Col>
        </Row>
      </PageContainer>
    </div>
  );
};
export default ProjectDetailCard;
