import { TableHeader } from '@/components/Table/TableHeader';
import { PresetsEntryForm } from './components/PresetsEntryForm';
import styles from './styles/CreatePresetPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import LoadingPageCustomize from '@/components/LoadingPage';
import { useBoolean } from '@/helper/hook';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { presetsValueDefault, PresetsValueProp } from './types';
import { useParams } from 'umi';
import { useEffect, useState } from 'react';
import { getOnePresetMiddleware, updatePresetMiddleware } from './services/api';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';

const UpdatePresetPage = () => {
  const [presetValue, setPresetValue] = useState<PresetsValueProp>(presetsValueDefault);
  const isLoading = useBoolean();
  const params = useParams<{ id: string }>();
  const idPreset = params?.id || '';

  useEffect(() => {
    if (idPreset) {
      //get data of preset
      isLoading.setValue(true);
      getOnePresetMiddleware(
        idPreset,
        (dataRes: PresetsValueProp) => {
          if (dataRes) {
            setPresetValue(dataRes);
          }
          isLoading.setValue(false);
        },
        () => {
          isLoading.setValue(false);
        },
      );
      return;
    }
    pushTo(PATH.presets);
  }, []);

  const handleCancel = () => {
    pushTo(PATH.presets);
  };

  const handleUpdatePreset = (data: PresetsValueProp) => {
    if (!idPreset) {
      pushTo(PATH.presets);
    }
    isLoading.setValue(true);
    updatePresetMiddleware(idPreset, data, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.UPDATE_PRESET_SUCCESS);
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
        rightAction={<PlusIcon />}
      />
      <div className={styles.container__content}>
        <PresetsEntryForm
          onSubmit={handleUpdatePreset}
          onCancel={handleCancel}
          presetValue={presetValue}
        />
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default UpdatePresetPage;
