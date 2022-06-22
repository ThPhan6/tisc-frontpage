import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon.svg';
import CustomButton from '@/components/Button';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { ConversionsEntryForm } from './components/ConversionsEntryForm';
import { getOneConversionMiddleware, updateConversionMiddleware } from './services/api';
import styles from './styles/CreateConversionPage.less';
import { ConversionValueProp } from './types';

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
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'CONVERSIONS'}
        rightAction={<CustomButton disabled properties="circle" icon={<PlusIcon />} size="small" />}
      />
      <div className={styles.container__content}>
        <ConversionsEntryForm
          conversionValue={conversionValue}
          setConversionValue={setConversionValue}
          onSubmit={handleUpdateConversion}
          onCancel={handleCancel}
          submitButtonStatus={submitButtonStatus.value}
        />
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default UpdateConversionPage;
