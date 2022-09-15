import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { createPresetMiddleware } from '@/services';

import { PresetsValueProp } from '@/types';

import { PresetsEntryForm } from './components/PresetsEntryForm';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

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
    <div>
      <TableHeader title={'PRESETS'} rightAction={<CustomPlusButton disabled />} />
      <div>
        <PresetsEntryForm
          onSubmit={handleCreatePreset}
          onCancel={handleCancel}
          submitButtonStatus={submitButtonStatus.value}
        />
      </div>
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default CreatePresetPage;
