import { useState } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { Col, Row } from 'antd';

import { createCustomResource } from './services';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { CustomResourceForm } from './types';
import { useAppSelector } from '@/reducers';

import { ContactInformation } from './components/CustomResource/ContactInfomation';
import { CustomResourceEntryForm } from './components/CustomResource/CustomResourceForm';
import { CustomResourceTopBar } from './components/TopBar/CustomResourceTopBar';
import { CustomRadio } from '@/components/CustomRadio';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { MainTitle } from '@/components/Typography';

import { optionValue } from './CustomResource';
import styles from './CustomResource.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const CustomResourceCreatePage = () => {
  const viewBy = useAppSelector((state) => state.officeProduct.customResourceValue);

  const submitButtonStatus = useBoolean(false);

  const [data, setData] = useState<CustomResourceForm>({
    business_name: '',
    website_uri: '',
    associate_resource_ids: [],
    country_id: '',
    state_id: '',
    city_id: '',
    address: '',
    postal_code: '',
    general_phone: '',
    general_email: '',
    contacts: [],
    type: viewBy,
  });

  const handleCreate = () => {
    showPageLoading();
    createCustomResource(data).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
          pushTo(PATH.designerCustomResource);
        }, 1000);
      }
      hidePageLoading();
    });
  };

  return (
    <PageContainer pageHeaderRender={() => <CustomResourceTopBar />}>
      <TableHeader
        title="VENDOR INFORMATION MANAGEMENT"
        rightAction={
          <div style={{ display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>
            <MainTitle level={4}>View By:</MainTitle>
            <CustomRadio
              options={optionValue}
              containerClass={`${styles.customRadio} ${styles.disabledRadio}`}
              value={viewBy}
            />
            <CustomPlusButton customClass={styles.button} disabled />
          </div>
        }
      />
      <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
        <Col span={12}>
          <CustomResourceEntryForm data={data} setData={setData} />
        </Col>
        <Col span={12} style={{ background: '#fff' }}>
          <ContactInformation
            data={data}
            setData={setData}
            submitButtonStatus={submitButtonStatus.value}
            onSubmit={handleCreate}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default CustomResourceCreatePage;
