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
  product_name: '',
  design_firm: {
    name: '',
    official_website: '',
    inquirer: '',
    position: '',
    email: '',
    phone: '',
    address: '',
  },
  inquiry_message: {
    inquiry_for: '',
    title: '',
    message: '',
    product_collection: '',
    product_description: '',
    product_image: '',
    official_website: '',
  },
};

const GeneralInquiryDetail = () => {
  const designFirmId = useGetParamId();
  const [legendModalVisible, setLegendModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<GeneralInquiriesTab>('design-firm');

  const [data, setData] = useState<GeneralInquiryResponse>(DEFAULT_STATE);

  useEffect(() => {
    if (designFirmId) {
      getOneGeneralInquiry(designFirmId).then((res) => {
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
            title={data.product_name}
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
              <DesignFirmTab
                name={data.design_firm.name}
                official_website={data.design_firm.official_website}
                inquirer={data.design_firm.inquirer}
                position={data.design_firm.position}
                email={data.design_firm.email}
                phone={data.design_firm.phone}
                address={data.design_firm.address}
              />
            </CustomTabPane>

            <CustomTabPane active={activeTab === 'inquiry-message'}>
              <InquiryMessageTab
                inquiry_for={data.inquiry_message.inquiry_for}
                title={data.inquiry_message.title}
                message={data.inquiry_message.message}
                official_website={data.inquiry_message.official_website}
                product_collection={data.inquiry_message.product_collection}
                product_description={data.inquiry_message.product_description}
                product_image={data.inquiry_message.product_image}
                modelId={designFirmId}
              />
            </CustomTabPane>
          </div>
        </Col>
      </Row>
    </GeneralInquiryContainer>
  );
};

export default GeneralInquiryDetail;
