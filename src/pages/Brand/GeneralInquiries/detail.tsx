import { useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';

import { pushTo } from '@/helper/history';

import { DesignFirm } from './components/DesignFirm';
import { GeneralInquiryContainer } from './components/GeneralInquiryContainer';
import { InquiryMessage } from './components/InquiryMessage';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from './detail.less';

const LIST_TAB = [
  { tab: 'DESIGN FIRM', key: 'design-firm' },
  { tab: 'INQUIRY MESSAGE', key: 'inquiry-message' },
];

type GeneralInquiriesTab = 'design-firm' | 'inquiry-message';

const GeneralInquiryDetail = () => {
  const [activeTab, setActiveTab] = useState<GeneralInquiriesTab>('inquiry-message');

  return (
    <GeneralInquiryContainer>
      <TableHeader title="GENERAL INQUIRES" customClass={styles.tableHeader} />
      <Row>
        <Col span={12} className={styles.container}>
          <TableHeader
            title="Product Demostration"
            customClass={styles.header}
            rightAction={
              <CloseIcon
                className="cursor-pointer"
                onClick={() => pushTo(PATH.brandGeneralInquiry)}
              />
            }
          />
          <CustomTabs
            listTab={LIST_TAB}
            centered={true}
            tabPosition="top"
            tabDisplay="space"
            onChange={(key) => setActiveTab(key as GeneralInquiriesTab)}
            activeKey={activeTab}
            customClass={styles.tabs}
          />

          <div className={styles.mainContent}>
            <CustomTabPane active={activeTab === 'design-firm'}>
              <DesignFirm />
            </CustomTabPane>

            <CustomTabPane active={activeTab === 'inquiry-message'}>
              <InquiryMessage />
            </CustomTabPane>
          </div>
        </Col>
      </Row>
    </GeneralInquiryContainer>
  );
};

export default GeneralInquiryDetail;
