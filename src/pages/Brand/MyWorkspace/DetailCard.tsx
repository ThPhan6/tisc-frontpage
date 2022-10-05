import { useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { pushTo } from '@/helper/history';

import { BrandProject } from './components/BrandProject';
import { BrandRequests } from './components/BrandRequests';
import { DesignFirm } from './components/DesignFirm';
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

const DetailCard = () => {
  const [activeKey, setActiveKey] = useState<Tab>('design_firm');
  return (
    <Row>
      <Col span={12}>
        <div className={styles.detailCard}>
          <TableHeader
            // title={data.name}
            title="Project name"
            rightAction={
              <CloseIcon onClick={() => pushTo(PATH.brandHomePage)} style={{ cursor: 'pointer' }} />
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
  );
};
export default DetailCard;
