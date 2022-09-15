import { useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { createConversionMiddleware } from '@/services';

import { ConversionValueProp } from '@/types';

import { ConversionsEntryForm } from './components/ConversionsEntryForm';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const CreateConversionPage = () => {
  const [conversionValue, setConversionValue] = useState<ConversionValueProp>({
    name: '',
    subs: [],
  });
  const isLoading = useBoolean();

  const submitButtonStatus = useBoolean(false);

  const handleCreateConversion = (data: ConversionValueProp) => {
    isLoading.setValue(true);
    createConversionMiddleware(data, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.CREATE_CONVERSION_SUCCESS);
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.conversions);
          submitButtonStatus.setValue(false);
        }, 1000);
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  const handleCancel = () => {
    pushTo(PATH.conversions);
  };

  return (
    <div>
      <TableHeader title={'CONVERSIONS'} rightAction={<CustomPlusButton disabled />} />
      <div>
        <ConversionsEntryForm
          submitButtonStatus={submitButtonStatus.value}
          conversionValue={conversionValue}
          setConversionValue={setConversionValue}
          onSubmit={handleCreateConversion}
          onCancel={handleCancel}
        />
      </div>
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default CreateConversionPage;
