import { FC, useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { getOneProjectTracking } from '@/services/project-tracking.api';

import { DEFAULT_PROJECT_DETAIL, ProjectDetail } from '@/types/project-tracking.type';

import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import { BrandProject } from './BrandProject';
import { BrandRequests } from './BrandRequests';
import { DesignFirm } from './DesignFirm';

const LIST_TAB = [
  { tab: 'DESIGN FIRM', key: 'design_firm' },
  { tab: 'PROJECT', key: 'project' },
  { tab: 'REQUESTS', key: 'requests' },
  { tab: 'NOTIFICATIONS', key: 'notification' },
];

type Tab = 'design_firm' | 'project' | 'requests' | 'notification';

interface ProjectTrackingDetail {
  projectId: string;
  activeOnlyDesignFirm?: boolean;
  height?: string;
}

export const Detail: FC<ProjectTrackingDetail> = ({ projectId, activeOnlyDesignFirm, height }) => {
  const [activeKey, setActiveKey] = useState<Tab>('design_firm');
  const [data, setData] = useState<ProjectDetail>(DEFAULT_PROJECT_DETAIL);
  const listTab = activeOnlyDesignFirm
    ? LIST_TAB.map((el) => ({
        ...el,
        disable: el.key === 'design_firm' ? undefined : true,
      }))
    : LIST_TAB;

  useEffect(() => {
    if (projectId) {
      getOneProjectTracking(projectId).then((res) => {
        if (res) {
          setData(res);
        }
      });
    }
  }, []);

  return (
    <Row style={{ marginTop: '8px' }}>
      <Col span={12}>
        <div style={{ background: '#fff', height: `${height}` }}>
          <TableHeader
            title={data.projects.name}
            rightAction={<CloseIcon onClick={() => history.back()} style={{ cursor: 'pointer' }} />}
          />
          <CustomTabs
            listTab={listTab}
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
  );
};
