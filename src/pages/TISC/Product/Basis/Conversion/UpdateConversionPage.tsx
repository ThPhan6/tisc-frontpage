import { useEffect, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { useParams } from 'umi';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getOneConversionMiddleware, updateConversionMiddleware } from '@/services';

import { ConversionValueProp } from '@/types';

import { ConversionsEntryForm } from './components/ConversionsEntryForm';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const UpdateConversionPage = () => {
  const [conversionValue, setConversionValue] = useState<ConversionValueProp>({
    name: '',
    subs: [],
  });
  const isLoading = useBoolean();
  const params = useParams<{
    id: string;
  }>();
  const idConversion = params?.id || '';

  const submitButtonStatus = useBoolean(false);

  useEffect(() => {
    if (idConversion) {
      isLoading.setValue(true);
      getOneConversionMiddleware(
        idConversion,
        (dataRes: ConversionValueProp) => {
          if (dataRes) {
            setConversionValue(dataRes);
          }
          isLoading.setValue(false);
        },
        () => {
          isLoading.setValue(false);
        },
      );
      return;
    }
    pushTo(PATH.categories);
  }, []);

  const handleUpdateConversion = (data: ConversionValueProp) => {
    if (!idConversion) {
      pushTo(PATH.conversions);
    }
    isLoading.setValue(true);
    updateConversionMiddleware(idConversion, data, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.UPDATE_CONVERSION_SUCCESS);
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 2000);
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
          conversionValue={conversionValue}
          setConversionValue={setConversionValue}
          onSubmit={handleUpdateConversion}
          onCancel={handleCancel}
          submitButtonStatus={submitButtonStatus.value}
        />
      </div>
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default UpdateConversionPage;
