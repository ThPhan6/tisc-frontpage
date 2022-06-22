import { TableHeader } from '@/components/Table/TableHeader';
import styles from './styles/CreateConversionPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon.svg';
import { ConversionsEntryForm } from './components/ConversionsEntryForm';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { useState } from 'react';
import { ConversionValueProp } from './types';
import LoadingPageCustomize from '@/components/LoadingPage';
import { useBoolean } from '@/helper/hook';
import { STATUS_RESPONSE } from '@/constants/util';
import { createConversionMiddleware } from './services/api';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import CustomButton from '@/components/Button';

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
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'CONVERSIONS'}
        rightAction={<CustomButton disabled properties="circle" icon={<PlusIcon />} size="small" />}
      />
      <div className={styles.container__content}>
        <ConversionsEntryForm
          submitButtonStatus={submitButtonStatus.value}
          conversionValue={conversionValue}
          setConversionValue={setConversionValue}
          onSubmit={handleCreateConversion}
          onCancel={handleCancel}
        />
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default CreateConversionPage;
