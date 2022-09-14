import { useEffect, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { useParams } from 'umi';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getOnePresetMiddleware, updatePresetMiddleware } from '@/services';

import { PresetsValueProp, presetsValueDefault } from '@/types';

import { PresetsEntryForm } from './components/PresetsEntryForm';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const UpdatePresetPage = () => {
  const [presetValue, setPresetValue] = useState<PresetsValueProp>(presetsValueDefault);
  const isLoading = useBoolean();
  const params = useParams<{ id: string }>();
  const idPreset = params?.id || '';
  const submitButtonStatus = useBoolean(false);

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

  return (
    <div>
      <TableHeader title={'PRESETS'} rightAction={<CustomPlusButton disabled />} />
      <div>
        <PresetsEntryForm
          onSubmit={handleUpdatePreset}
          onCancel={handleCancel}
          presetValue={presetValue}
          submitButtonStatus={submitButtonStatus.value}
        />
      </div>
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default UpdatePresetPage;
