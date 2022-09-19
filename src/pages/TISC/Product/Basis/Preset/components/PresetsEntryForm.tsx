import { useEffect, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { createPresetMiddleware, getOnePresetMiddleware, updatePresetMiddleware } from '@/services';

import { PresetItemValueProp, PresetsValueProp, presetsValueDefault } from '@/types';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { PresetItem } from './PresetItem';

const PresetsEntryForm = () => {
  const [presetsValue, setPresetsValue] = useState<PresetsValueProp>(presetsValueDefault);

  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const idPreset = useGetParamId();
  const isUpdate = idPreset ? true : false;

  useEffect(() => {
    if (idPreset) {
      //get data of preset
      isLoading.setValue(true);
      getOnePresetMiddleware(
        idPreset,
        (dataRes: PresetsValueProp) => {
          if (dataRes) {
            setPresetsValue(dataRes);
          }
          isLoading.setValue(false);
        },
        () => {
          isLoading.setValue(false);
        },
      );
    }
  }, []);

  const handleOnChangePresetGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPresetsValue({ ...presetsValue, name: e.target.value });
  };

  const HandleOnClickAddIcon = () => {
    const newSubs = [...presetsValue.subs, presetsValueDefault];
    setPresetsValue({ ...presetsValue, subs: newSubs });
  };

  const handleOnClickDelete = (index: number) => {
    const newSubs = [...presetsValue.subs];
    newSubs.splice(index, 1);
    setPresetsValue({ ...presetsValue, subs: newSubs });
  };

  const handleOnChangeValue = (value: PresetItemValueProp, index: number) => {
    const newSubs = [...presetsValue['subs']];
    newSubs[index] = value;
    setPresetsValue({ ...presetsValue, subs: newSubs });
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

  const handleUpdatePreset = (data: PresetsValueProp) => {
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

  const handleSubmit = isUpdate ? handleUpdatePreset : handleCreatePreset;

  const onHandleSubmit = () => {
    handleSubmit({
      ...presetsValue,
      name: presetsValue.name.trim(),
      subs: presetsValue.subs.map((sub) => {
        return {
          ...sub,
          name: sub.name.trim(),
          subs: sub.subs?.map((subItem) => {
            return {
              ...subItem,
              value_1: subItem.value_1.trim(),
              value_2: subItem.value_2.trim(),
              unit_1: subItem.unit_1.trim(),
              unit_2: subItem.unit_2.trim(),
            };
          }),
        };
      }),
    });
  };

  const handleCancel = () => {
    pushTo(PATH.presets);
  };

  return (
    <div>
      <TableHeader title={'PRESETS'} rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        handleSubmit={onHandleSubmit}
        handleCancel={handleCancel}
        submitButtonStatus={submitButtonStatus.value}>
        <FormNameInput
          placeholder="type group name"
          title="Preset group"
          onChangeInput={handleOnChangePresetGroupName}
          HandleOnClickAddIcon={HandleOnClickAddIcon}
          inputValue={presetsValue.name}
        />
        <div>
          {presetsValue.subs.map((presetItem, index) => (
            <PresetItem
              key={index}
              handleOnClickDelete={() => handleOnClickDelete(index)}
              onChangeValue={(value: PresetItemValueProp) => {
                handleOnChangeValue(value, index);
              }}
              value={presetItem}
            />
          ))}
        </div>
      </EntryFormWrapper>
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default PresetsEntryForm;
