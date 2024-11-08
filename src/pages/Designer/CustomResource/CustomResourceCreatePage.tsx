import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { Row } from 'antd';

import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';

import { CustomResourceForm } from './type';
import { useAppSelector } from '@/reducers';

import { ContactInformation } from './component/ContactInfomation';
import { CustomResourceEntryForm } from './component/CustomResourceForm';
import { CustomResourceHeader } from './component/CustomResourceHeader';
import { CustomResourceTopBar } from './component/CustomResourceTopBar';
import { ResponsiveCol } from '@/components/Layout';

import { createCustomResource, getOneCustomResource, updateCustomResource } from './api';
import { showPageLoading } from '@/features/loading/loading';

const CustomResourceCreatePage = () => {
  const customResourceType = useAppSelector((state) => state.customResource.customResourceType);

  const { isTablet } = useScreen();

  const submitButtonStatus = useBoolean(false);

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
    type_code: '',
    notes: '',
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

  const handleCreate = () => {
    showPageLoading();
    if (customResourceId) {
      updateCustomResource(customResourceId, data).then((isSuccess) => {
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 1000);
        }
      });
    } else {
      createCustomResource(data).then((isSuccess) => {
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
            pushTo(PATH.designerCustomResource);
          }, 1000);
        }
      });
    }
  };

  if (customResourceId && !loadedData) {
    return null;
  }

  return (
    <PageContainer pageHeaderRender={() => <CustomResourceTopBar />}>
      <CustomResourceHeader />
      <Row style={{ marginTop: '8px' }} gutter={[0, 8]}>
        <ResponsiveCol style={{ paddingRight: isTablet ? '' : '8px' }}>
          <CustomResourceEntryForm
            data={data}
            setData={setData}
            type={customResourceId ? 'update' : 'create'}
          />
        </ResponsiveCol>
        <ResponsiveCol style={{ background: '#fff' }}>
          <ContactInformation
            data={data}
            setData={setData}
            submitButtonStatus={submitButtonStatus.value}
            onSubmit={handleCreate}
            type={customResourceId ? 'update' : 'create'}
            customResourceId={customResourceId}
          />
        </ResponsiveCol>
      </Row>
    </PageContainer>
  );
};

export default CustomResourceCreatePage;
