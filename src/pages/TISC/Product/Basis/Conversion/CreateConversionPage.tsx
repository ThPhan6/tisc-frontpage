import { TableHeader } from '@/components/Table/TableHeader';
import styles from './styles/CreateConversionPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
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

const CreateConversionPage = () => {
  const [conversionValue, setConversionValue] = useState<ConversionValueProp>({
    name: '',
    subs: [],
  });
  const isLoading = useBoolean();

  const handleCancel = () => {
    pushTo(PATH.conversions);
  };

  const handleCreateConversion = (data: ConversionValueProp) => {
    isLoading.setValue(true);
    createConversionMiddleware(data, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.CREATE_CONVERSION_SUCCESS);
        pushTo(PATH.conversions);
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'CONVERSIONS'}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container__content}>
        <ConversionsEntryForm
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
