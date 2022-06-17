import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { useState } from 'react';
import { OptionItem } from './OptionItem';
import { elementInputValueDefault, ElementInputValueProp } from '../types';
import styles from '../styles/OptionsEntryForm.less';

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
    const newOptions = [...options.subs];
    newOptions.splice(index, 1);
    setOptions({ ...options, subs: newOptions });
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
        onChangeInput={(e) => {
          setOptions({ ...options, name: e.target.value });
        }}
        inputValue={options.name}
      />
      <div className={styles.conversions_wrapper}>
        {options.subs.map((option, index) => (
          <OptionItem
            key={index}
            value={option}
            onChangeValue={(value) => {
              console.log(value);

              handleOnChangeValue(value, index);
            }}
            handleOnClickDelete={() => handleOnClickDelete(index)}
          />
        ))}
      </div>
    </EntryFormWrapper>
  );
};
