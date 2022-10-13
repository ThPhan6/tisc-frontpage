import { FC, useEffect, useState } from 'react';

// import { PATH } from '@/constants/path';
import { Col, Row } from 'antd';
import { history } from 'umi';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

// import { pushTo } from '@/helper/history';
import { getOneProjectTracking } from '@/services/project-tracking.api';

import { BrandProject } from '../../ProjectTracking/components/BrandProject';
import { BrandRequests } from '../../ProjectTracking/components/BrandRequests';
import { DesignFirm } from '../../ProjectTracking/components/DesignFirm';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

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
}
export const Detail: FC<ProjectTrackingDetail> = ({ projectId, activeOnlyDesignFirm }) => {
  const [activeKey, setActiveKey] = useState<Tab>('design_firm');
  const [data, setData] = useState<ProjectTrackingDetail>();
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
  });
  return (
    <Row>
      <Col span={12}>
        <div style={{ background: '#fff', height: 'calc(100vh - 152px)' }}>
          <TableHeader
            title={''}
            rightAction={
              <CloseIcon onClick={() => history.goBack()} style={{ cursor: 'pointer' }} />
            }
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
            <BrandProject />
          </CustomTabPane>

          <CustomTabPane active={activeKey === 'requests'}>
            <BrandRequests />
          </CustomTabPane>

          <CustomTabPane active={activeKey === 'notification'}></CustomTabPane>
        </div>
      </Col>
    </Row>
  );
};
