import { FC, useEffect, useState } from 'react';

import {
  PresetItemValueProp,
  PresetsEntryFormProps,
  PresetsValueProp,
  presetsValueDefault,
} from '@/types';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';

import { PresetItem } from './PresetItem';

export const PresetsEntryForm: FC<PresetsEntryFormProps> = ({
  onCancel,
  onSubmit,
  presetValue,
  submitButtonStatus,
}) => {
  const [presetsValue, setPresetsValue] = useState<PresetsValueProp>(presetsValueDefault);

  useEffect(() => {
    if (presetValue) {
      setPresetsValue({ ...presetValue });
    }
  }, [presetValue]);

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

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
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
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      submitButtonStatus={submitButtonStatus}>
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
  );
};
