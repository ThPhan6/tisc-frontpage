import { FC, useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { getOneProjectTracking } from '@/services/project-tracking.api';

import {
  DEFAULT_PROJECT_TRACKING_DETAIL,
  ProjectTrackingDetail,
} from '@/types/project-tracking.type';

import CustomButton from '@/components/Button';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import { BrandProject } from './BrandProject';
import { DesignFirm } from './DesignFirm';
import styles from './DesignFirm.less';
import { RequestsAndNotifications } from './RequestsAndNotifications';

const LIST_TAB = [
  { tab: 'DESIGN FIRM', key: 'design_firm' },
  { tab: 'PROJECT', key: 'project' },
  { tab: 'REQUESTS', key: 'request' },
  { tab: 'NOTIFICATIONS', key: 'notification' },
];

type Tab = 'design_firm' | 'project' | 'request' | 'notification';

interface ProjectTrackingDetailProps {
  projectId: string;
  height: string;
}

export const Detail: FC<ProjectTrackingDetailProps> = ({ projectId, height }) => {
  const [activeKey, setActiveKey] = useState<Tab>('design_firm');
  const [data, setData] = useState<ProjectTrackingDetail>(DEFAULT_PROJECT_TRACKING_DETAIL);
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

          <CustomTabPane active={activeKey === 'request'}>
            <RequestsAndNotifications
              requestAndNotification={data.projectRequests.map((el) => ({
                ...el,
                read: el.newRequest,
                title: { created_at: el.created_at, name: el.requestFor },
                product: el.product,
                designer: el.designer,
                request: { title: el.title, message: el.message },
                id: el.id,
                status: el.status,
              }))}
              type="request"
              setData={setData}
            />
          </CustomTabPane>

          <CustomTabPane active={activeKey === 'notification'}>
            <RequestsAndNotifications
              requestAndNotification={data.notifications.map((el) => ({
                ...el,
                read: el.newNotification,
                product: el.product,
                designer: el.designer,
                title: { created_at: el.created_at, name: el.type },
                status: el.status,
                id: el.id,
              }))}
              type="notification"
              setData={setData}
            />
          </CustomTabPane>

          <div className={styles.cancelButton}>
            <CustomButton
              size="small"
              variant="primary"
              properties="rounded"
              onClick={() => history.back()}>
              Cancel
            </CustomButton>
          </div>
        </div>
      </Col>
    </Row>
  );
};
