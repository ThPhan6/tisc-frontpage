import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { useState } from 'react';
import { presetItemValueDefault, presetsValueDefault, PresetsValueProp } from '../types';
import { PresetItem } from './PresetItem';
import styles from '../styles/PresetsEntryForm.less';

export const PresetsEntryForm = () => {
  const [presetsValue, setPresetsValue] = useState<PresetsValueProp>(presetsValueDefault);

  const handleOnChangePresetGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPresetsValue({ ...presetsValue, name: e.target.value });
  };

  const HandleOnClickAddIcon = () => {
    const newSubs = [...presetsValue.subs, presetItemValueDefault];
    setPresetsValue({ ...presetsValue, subs: newSubs });
  };

  const handleOnClickDelete = (index: number) => {
    const newSubs = [...presetsValue.subs];
    newSubs.splice(index, 1);
    setPresetsValue({ ...presetsValue, subs: newSubs });
  };

  const handleOnChangeValue = (value: PresetsValueProp['subs'][0], index: number) => {
    const newSubs = [...presetsValue['subs']];
    newSubs[index] = value;
    setPresetsValue({ ...presetsValue, subs: newSubs });
  };

  const handleSubmit = () => {
    alert('Coming soon ');
  };

  const handleCancel = () => {
    alert('Coming soon ');
  };

  return (
    <EntryFormWrapper handleSubmit={handleSubmit} handleCancel={handleCancel}>
      <FormNameInput
        placeholder="type group name"
        title="Preset group"
        onChangeInput={handleOnChangePresetGroupName}
        HandleOnClickAddIcon={HandleOnClickAddIcon}
      />
      <div className={styles.itemPreset}>
        {presetsValue.subs.map((presetItem, index) => (
          <PresetItem
            key={index}
            handleOnClickDelete={() => handleOnClickDelete(index)}
            onChangeValue={(value) => {
              handleOnChangeValue(value, index);
            }}
            value={presetItem}
          />
        ))}
      </div>
    </EntryFormWrapper>
  );
};
