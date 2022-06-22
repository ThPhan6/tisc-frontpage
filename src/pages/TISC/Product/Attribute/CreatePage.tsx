import { TableHeader } from '@/components/Table/TableHeader';
import styles from './styles/CreateConversionPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import AttributeEntryForm from './components/AttributeEntryForm';
import { useLocation } from 'umi';
import { useBoolean } from '@/helper/hook';
import LoadingPageCustomize from '@/components/LoadingPage';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import {
  ATTRIBUTE_PATH_TO_TYPE,
  GENERAL_URL_PATH,
  FEATURE_URL_PATH,
  SPECIFICATION_URL_PATH,
} from './utils';
import type { IAttributeForm } from './types';

// import { STATUS_RESPONSE } from '@/constants/util';
// import { createConversionMiddleware } from './services/api';
// import { message } from 'antd';
// import { MESSAGE_NOTIFICATION } from '@/constants/message';
const ATTRIBUTE_PATHS = [GENERAL_URL_PATH, FEATURE_URL_PATH, SPECIFICATION_URL_PATH];
const CreateAttributePage = () => {
  const location = useLocation();
  const ACTIVE_TYPE = ATTRIBUTE_PATHS.find((path) => location.pathname.indexOf(path) >= 0);
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);

  const handleCreate = (data: IAttributeForm) => {
    isLoading.setValue(true);
    console.log(data);
    // createConversionMiddleware(data, (type: STATUS_RESPONSE, msg?: string) => {
    //   if (type === STATUS_RESPONSE.SUCCESS) {
    //     message.success(MESSAGE_NOTIFICATION.CREATE_CONVERSION_SUCCESS);
    //     submitButtonStatus.setValue(true);
    //     setTimeout(() => {
    //       pushTo(PATH.conversions);
    //       submitButtonStatus.setValue(false);
    //     }, 1000);
    //   } else {
    //     message.error(msg);
    //   }
    //   isLoading.setValue(false);
    // });
  };

  const handleCancel = () => {
    pushTo(PATH.conversions);
  };

  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={ATTRIBUTE_PATH_TO_TYPE[ACTIVE_TYPE!].NAME}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container__content}>
        <AttributeEntryForm
          type={ATTRIBUTE_PATH_TO_TYPE[ACTIVE_TYPE!].TYPE}
          submitButtonStatus={submitButtonStatus.value}
          onSubmit={handleCreate}
          onCancel={handleCancel}
        />
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};
// submitButtonStatus={submitButtonStatus.value}
// conversionValue={conversionValue}
// setConversionValue={setConversionValue}
// onSubmit={handleCreateConversion}
// onCancel={handleCancel}

// {isLoading.value && <LoadingPageCustomize />}

export default CreateAttributePage;
