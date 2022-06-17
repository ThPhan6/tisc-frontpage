import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { useState } from 'react';
import { OptionItem } from './ConversionItem';
import { elementInputValueDefault, ElementInputValueProp } from './types';
import styles from './styles/ConversionsEntryForm.less';

export const ConversionsBasisOption = () => {
  const [options, setOptions] = useState<{
    id?: string;
    name: string;
    subs: ElementInputValueProp[];
  }>({
    name: '',
    subs: [],
  });

  const handleOnChangeValue = (value: ElementInputValueProp, index: number) => {
    const newOptions = [...options.subs];
    newOptions[index] = value;
    setOptions({ ...options, subs: newOptions });
  };

  const handleOnClickDelete = (index: number) => {
    const newConversions = [...options.subs];
    newConversions.splice(index, 1);
    setOptions({ ...options, subs: newConversions });
  };

  const handleSubmit = () => {
    alert('Coming soon ');
  };

  const handleCancel = () => {
    alert('Coming soon ');
  };

  const handleClickAddOption = () => {
    setOptions({ ...options, subs: [...options.subs, elementInputValueDefault] });
  };

  return (
    <EntryFormWrapper handleSubmit={handleSubmit} handleCancel={handleCancel}>
      <FormNameInput
        placeholder="type group name"
        title="Option Group"
        HandleOnClickAddIcon={handleClickAddOption}
      />
      <div className={styles.conversions_wrapper}>
        {options.subs.map((option, index) => (
          <OptionItem
            key={index}
            value={option}
            onChangeValue={(value) => {
              handleOnChangeValue(value, index);
            }}
            handleOnClickDelete={() => handleOnClickDelete(index)}
          />
        ))}
      </div>
    </EntryFormWrapper>
  );
};
