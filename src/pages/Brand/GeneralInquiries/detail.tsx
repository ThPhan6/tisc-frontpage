import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { getOneGeneralInquiry } from './services';
import { pushTo } from '@/helper/history';
import { useGetParamId } from '@/helper/hook';

import { GeneralInquiryResponse } from './types';

import { DesignFirmTab } from './components/DesignFirmTab';
import { GeneralInquiryContainer } from './components/GeneralInquiryContainer';
import { InquiryMessageTab } from './components/InquiryMessageTab';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from './detail.less';
import indexStyles from './index.less';

const LIST_TAB = [
  { tab: 'DESIGN FIRM', key: 'design-firm' },
  { tab: 'INQUIRY MESSAGE', key: 'inquiry-message' },
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
  const inquiryId = useGetParamId();
  const [legendModalVisible, setLegendModalVisible] = useState(false);
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

  return (
    <GeneralInquiryContainer visible={legendModalVisible} setVisible={setLegendModalVisible}>
      <TableHeader
        title="GENERAL INQUIRES"
        customClass={`${styles.tableHeader} ${indexStyles.customHeader}`}
        rightAction={
          <InfoIcon className={indexStyles.iconInfor} onClick={() => setLegendModalVisible(true)} />
        }
      />
      <Row>
        <Col span={12} className={styles.container}>
          <TableHeader
            title={data.inquiry_message.inquiry_for}
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
              <DesignFirmTab data={data.design_firm} />
            </CustomTabPane>

            <CustomTabPane active={activeTab === 'inquiry-message'}>
              <InquiryMessageTab data={data.inquiry_message} modelId={inquiryId} />
            </CustomTabPane>
          </div>
        </Col>
      </Row>
    </GeneralInquiryContainer>
  );
};

export default GeneralInquiryDetail;
