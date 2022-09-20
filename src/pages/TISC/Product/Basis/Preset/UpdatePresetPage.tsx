import { useEffect, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { hidePageLoading, showPageLoading } from '@/helper/utils';
import { getOnePresetMiddleware, updatePresetMiddleware } from '@/services';

import { PresetsValueProp, presetsValueDefault } from '@/types';

import { PresetsEntryForm } from './components/PresetsEntryForm';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const UpdatePresetPage = () => {
  const [presetValue, setPresetValue] = useState<PresetsValueProp>(presetsValueDefault);
  const idPreset = useGetParamId();
  const submitButtonStatus = useBoolean(false);

  useEffect(() => {
    if (idPreset) {
      //get data of preset
      showPageLoading();
      getOnePresetMiddleware(
        idPreset,
        (dataRes: PresetsValueProp) => {
          if (dataRes) {
            setPresetValue(dataRes);
          }
          hidePageLoading();
        },
        () => {
          hidePageLoading();
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
    showPageLoading();
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
      hidePageLoading();
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
    </div>
  );
};

export default UpdatePresetPage;
