import { FC, useEffect, useState } from 'react';

import { Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { useScreen } from '@/helper/common';
import { getOneProjectTracking } from '@/services/project-tracking.api';

import { TabItem } from '@/components/Tabs/types';
import {
  DEFAULT_PROJECT_TRACKING_DETAIL,
  ProjectTrackingDetail,
} from '@/types/project-tracking.type';

import { ResponsiveCol } from '@/components/Layout';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import { BrandProject } from './BrandProject';
import { DesignFirm } from './DesignFirm';
import styles from './DesignFirm.less';
import { RequestsAndNotifications } from './RequestsAndNotifications';

const LIST_TAB: TabItem[] = [
  { tab: 'Design Firm', mobileTabTitle: 'DESIGN FIRM', key: 'design_firm', collapseOnMobile: true },
  { tab: 'Project', mobileTabTitle: 'PROJECT', key: 'project', collapseOnMobile: true },
  { tab: 'Request', key: 'request' },
  { tab: 'Notifications', key: 'notification' },
];

type Tab = 'design_firm' | 'project' | 'request' | 'notification';

interface ProjectTrackingDetailProps {
  projectId: string;
}

export const Detail: FC<ProjectTrackingDetailProps> = ({ projectId }) => {
  const isMobile = useScreen().isMobile;
  const [activeKey, setActiveKey] = useState<Tab>('design_firm');
  const [data, setData] = useState<ProjectTrackingDetail>(DEFAULT_PROJECT_TRACKING_DETAIL);

  const height = `calc(var(--vh) * 100 - ${isMobile ? 196 : 208}px)`;
  const contentHeight = `calc(var(--vh) * 100 - 360px)`;

  useEffect(() => {
    if (projectId) {
      getOneProjectTracking(projectId).then((res) => {
        if (res) {
          setData(res);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setActiveKey('request');
    }
  }, [isMobile]);

  return (
    <Row style={{ marginTop: '8px' }}>
      <ResponsiveCol>
        <div className={styles.detailContainer} style={{ height }}>
          <TableHeader
            title={data.projects.name}
            rightAction={
              <CloseIcon
                onClick={() => !data.isOpenDetailItem && history.back()}
                style={{
                  cursor: data.isOpenDetailItem ? 'not-allowed' : 'pointer',
                  color: data.isOpenDetailItem ? '#bfbfbf' : '',
                }}
              />
            }
          />

          <div
            style={{ padding: isMobile ? 12 : undefined, height: 'calc(var(--vh) * 100 - 256px)' }}
          >
            <CustomTabPane
              active={activeKey === 'project'}
              title={LIST_TAB[1].mobileTabTitle}
              collapseOnMobile
              groupType="project-tracking-detail"
              groupIndex={1}
            >
              <BrandProject project={data.projects} />
            </CustomTabPane>

            <CustomTabPane
              active={activeKey === 'design_firm'}
              title={LIST_TAB[0].mobileTabTitle}
              collapseOnMobile
              groupType="project-tracking-detail"
              groupIndex={2}
            >
              <DesignFirm designFirm={data.designFirm} />
            </CustomTabPane>

            <CustomTabs
              listTab={LIST_TAB}
              centered={true}
              tabPosition="top"
              tabDisplay="space"
              onChange={(key) => setActiveKey(key as Tab)}
              activeKey={activeKey}
            />

            {isMobile ? null : (
              <CustomTabPane active={activeKey === 'design_firm'}>
                <DesignFirm designFirm={data.designFirm} />
              </CustomTabPane>
            )}

            {isMobile ? null : (
              <CustomTabPane active={activeKey === 'project'}>
                <BrandProject project={data.projects} />
              </CustomTabPane>
            )}

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
                contentHeight={contentHeight}
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
                contentHeight={contentHeight}
              />
            </CustomTabPane>
          </div>
        </div>
      </ResponsiveCol>
    </Row>
  );
};
