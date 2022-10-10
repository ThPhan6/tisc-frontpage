import { FC, useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { pushTo } from '@/helper/history';

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
  idProject: string;
  activeOnlyDesignFirm?: boolean;
}
export const ProjectTrackingDetai: FC<ProjectTrackingDetail> = ({
  idProject,
  activeOnlyDesignFirm,
}) => {
  const [activeKey, setActiveKey] = useState<Tab>('design_firm');

  const listTab = activeOnlyDesignFirm
    ? LIST_TAB.map((el) => ({
        ...el,
        disable: el.key === 'design_firm' ? undefined : true,
      }))
    : LIST_TAB;

  return (
    <Row>
      <Col span={12}>
        <div style={{ background: '#fff', height: 'calc(100vh - 152px)' }}>
          <TableHeader
            title={idProject}
            rightAction={
              <CloseIcon onClick={() => pushTo(PATH.brandHomePage)} style={{ cursor: 'pointer' }} />
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
  );
};
