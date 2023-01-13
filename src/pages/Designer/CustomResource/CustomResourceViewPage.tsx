import { useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { Row } from 'antd';

import { useScreen } from '@/helper/common';
import { useGetParamId } from '@/helper/hook';

import { CustomResourceForm } from './type';
import { useAppSelector } from '@/reducers';

import { ContactInformation } from './component/ContactInfomation';
import { CustomResourceEntryForm } from './component/CustomResourceForm';
import { CustomResourceHeader } from './component/CustomResourceHeader';
import { CustomResourceTopBar } from './component/CustomResourceTopBar';
import { ResponsiveCol } from '@/components/Layout';

import { getOneCustomResource } from './api';

const CustomResourceViewPage = () => {
  const customResourceType = useAppSelector((state) => state.customResource.customResourceType);

  const { isTablet } = useScreen();
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
      <Row style={{ marginTop: '8px' }} gutter={[0, 8]}>
        <ResponsiveCol style={{ paddingRight: isTablet ? '' : '8px' }}>
          <CustomResourceEntryForm data={data} setData={setData} type="view" />
        </ResponsiveCol>
        <ResponsiveCol style={{ background: '#fff' }}>
          <ContactInformation data={data} setData={setData} type="view" />
        </ResponsiveCol>
      </Row>
    </PageContainer>
  );
};
export default CustomResourceViewPage;
