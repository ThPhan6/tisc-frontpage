import { useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { Col, Row } from 'antd';

import { getOneCustomResource } from './services';
import { useGetParamId } from '@/helper/hook';

import { CustomResourceForm } from './types';
import { useAppSelector } from '@/reducers';

import { ContactInformation } from './components/CustomResource/ContactInfomation';
import { CustomResourceEntryForm } from './components/CustomResource/CustomResourceForm';
import { CustomResourceHeader } from './components/CustomResource/CustomResourceHeader';
import { CustomResourceTopBar } from './components/TopBar/CustomResourceTopBar';

const CustomResourceViewPage = () => {
  const customResourceType = useAppSelector((state) => state.officeProduct.customResourceType);

  const customResourceId = useGetParamId();

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
    phone_code: '',
    contacts: [],
    type: customResourceType,
  });

  const [loadedData, setLoadedData] = useState(false);

  useEffect(() => {
    if (customResourceId) {
      getOneCustomResource(customResourceId).then((res) => {
        if (res) {
          setData(res);
          setLoadedData(true);
        }
      });
    }
  }, []);

  if (customResourceId && !loadedData) {
    return null;
  }

  return (
    <PageContainer pageHeaderRender={() => <CustomResourceTopBar />}>
      <CustomResourceHeader />
      <Row style={{ marginTop: '8px' }}>
        <Col span={12} style={{ paddingRight: '8px' }}>
          <CustomResourceEntryForm data={data} setData={setData} type="view" />
        </Col>
        <Col span={12} style={{ background: '#fff' }}>
          <ContactInformation data={data} setData={setData} type="view" />
        </Col>
      </Row>
    </PageContainer>
  );
};
export default CustomResourceViewPage;
