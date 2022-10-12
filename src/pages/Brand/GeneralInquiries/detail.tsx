import { FC, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';

import { getOneGeneralInquiry } from './services';
import { pushTo } from '@/helper/history';

import { GeneralInquiryResponse } from './types';

import { DesignFirmTab } from './components/DesignFirmTab';
import { GeneralInquiryContainer } from './components/GeneralInquiryContainer';
import { InquiryMessageTab } from './components/InquiryMessageTab';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from './detail.less';

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
    role: '',
    work_email: '',
    work_phone: '',
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

interface GeneralInquiriesDetailProps {
  designFirmId: string;
}

const GeneralInquiryDetail: FC<GeneralInquiriesDetailProps> = ({ designFirmId }) => {
  const [activeTab, setActiveTab] = useState<GeneralInquiriesTab>('design-firm');

  const [data, setData] = useState<GeneralInquiryResponse>(DEFAULT_STATE);

  useEffect(() => {
    getOneGeneralInquiry(designFirmId ?? '').then((res) => {
      if (res) {
        setData(res);
      }
    });
  }, []);

  return (
    <GeneralInquiryContainer>
      <TableHeader title="GENERAL INQUIRES" customClass={styles.tableHeader} />
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
                role={data.design_firm.role}
                work_email={data.design_firm.work_email}
                work_phone={data.design_firm.work_phone}
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
              />
            </CustomTabPane>
          </div>
        </Col>
      </Row>
    </GeneralInquiryContainer>
  );
};

export default GeneralInquiryDetail;
