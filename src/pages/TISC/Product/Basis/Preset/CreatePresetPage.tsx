import { TableHeader } from '@/components/Table/TableHeader';
import { PresetsEntryForm } from './components/PresetsEntryForm';
import styles from './styles/CreatePresetPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-dark-icon.svg';
import LoadingPageCustomize from '@/components/LoadingPage';
import { useBoolean } from '@/helper/hook';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { PresetsValueProp } from './types';
import { createPresetMiddleware } from './services/api';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';

const CreatePresetPage = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);

  const handleCancel = () => {
    pushTo(PATH.presets);
  };

  const handleCreatePreset = (data: PresetsValueProp) => {
    isLoading.setValue(true);
    createPresetMiddleware(data, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.CREATE_PRESET_SUCCESS);
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.presets);
          submitButtonStatus.setValue(false);
        }, 1000);
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
        title={'PRESETS'}
        rightAction={
          <div className={styles.customButtonDisable}>
            <PlusIcon />
          </div>
        }
      />
      <div className={styles.container__content}>
        <PresetsEntryForm
          onSubmit={handleCreatePreset}
          onCancel={handleCancel}
          submitButtonStatus={submitButtonStatus.value}
        />
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default CreatePresetPage;
