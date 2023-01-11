import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { getOneGeneralInquiry } from './services';
import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useGetParamId } from '@/helper/hook';

import { GeneralInquiryResponse } from './types';
import store from '@/reducers';
import { openModal } from '@/reducers/modal';

import { DesignFirmTab } from './components/DesignFirmTab';
import { GeneralInquiryContainer } from './components/GeneralInquiryContainer';
import { InquiryMessageTab } from './components/InquiryMessageTab';
import CustomButton from '@/components/Button';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from './detail.less';
import indexStyles from './index.less';

const LIST_TAB = [
  { tab: 'Design Firm', key: 'design-firm' },
  { tab: 'Inquiry Message', key: 'inquiry-message' },
];

type GeneralInquiriesTab = 'design-firm' | 'inquiry-message';

const DEFAULT_STATE: GeneralInquiryResponse = {
  design_firm: {
    name: '',
    official_website: '',
    address: '',
    general_email: '',
    general_phone: '',
    phone_code: '',
    city_name: '',
    country_name: '',
    state_name: '',
  },
  inquiry_message: {
    id: '',
    inquiry_for: '',
    title: '',
    message: '',
    designer: {
      email: '',
      name: '',
      phone: '',
      phone_code: '',
      position: '',
    },
    product: {
      id: '',
      collection: '',
      description: '',
      image: '',
      name: '',
    },
  },
};

const GeneralInquiryDetail = () => {
  const { isMobile, isTablet } = useScreen();
  const inquiryId = useGetParamId();
  const [activeTab, setActiveTab] = useState<GeneralInquiriesTab>('design-firm');

  const [data, setData] = useState<GeneralInquiryResponse>(DEFAULT_STATE);

  useEffect(() => {
    if (inquiryId) {
      getOneGeneralInquiry(inquiryId).then((res) => {
        if (res) {
          setData(res);
        }
      });
    }
  }, []);

  const goBackToTable = () => pushTo(PATH.brandGeneralInquiry);

  const getMainContentHeight = () => {
    if (isMobile && activeTab === 'design-firm') {
      return 'calc(var(--vh) * 100 - 272px)';
    }

    if (isMobile && activeTab === 'inquiry-message') {
      return 'calc(var(--vh) * 100 - 320px)';
    }

    if (activeTab === 'design-firm') {
      return 'calc(var(--vh) * 100 - 296px)';
    }

    return 'calc(var(--vh) * 100 - 344px)';
  };

  return (
    <GeneralInquiryContainer>
      <TableHeader
        title="GENERAL INQUIRES"
        customClass={`${styles.tableHeader} ${indexStyles.customHeader}`}
        rightAction={
          <InfoIcon
            className={indexStyles.iconInfor}
            onClick={() =>
              store.dispatch(openModal({ type: 'Project Tracking Legend', title: 'Legend' }))
            }
          />
        }
      />
      <Row>
        <Col span={isTablet ? 24 : 12} className={styles.container}>
          <TableHeader
            title={data.inquiry_message.inquiry_for}
            customClass={styles.header}
            rightAction={<CloseIcon className="cursor-pointer" onClick={goBackToTable} />}
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

          <div className={styles.mainContent} style={{ height: getMainContentHeight() }}>
            <CustomTabPane active={activeTab === 'design-firm'}>
              <DesignFirmTab data={data.design_firm} />
            </CustomTabPane>

            <CustomTabPane active={activeTab === 'inquiry-message'}>
              <InquiryMessageTab data={data.inquiry_message} modelId={inquiryId} />
            </CustomTabPane>
          </div>
          {activeTab === 'inquiry-message' ? (
            <div className={styles.cancelButton}>
              <CustomButton
                size="small"
                variant="primary"
                properties="rounded"
                onClick={goBackToTable}
              >
                Done
              </CustomButton>
            </div>
          ) : null}
        </Col>
      </Row>
    </GeneralInquiryContainer>
  );
};

export default GeneralInquiryDetail;
