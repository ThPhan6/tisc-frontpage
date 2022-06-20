import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { FC, useState } from 'react';
import { PresetItemValueProp, presetsValueDefault, PresetsValueProp } from '../../../Presets/types';
import { PresetItem } from './PresetItem';
import styles from '../styles/PresetsEntryForm.less';
import { PresetsEntryFormProps } from '../types';

export const PresetsEntryForm: FC<PresetsEntryFormProps> = ({
  onCancel,
  onSubmit,
  // presetsValue,
  // setPresetsValue
}) => {
  const [presetsValue, setPresetsValue] = useState<PresetsValueProp>(presetsValueDefault);

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
      onSubmit(presetsValue);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
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
