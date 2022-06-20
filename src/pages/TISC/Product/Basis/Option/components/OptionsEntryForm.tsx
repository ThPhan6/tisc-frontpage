import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { FC } from 'react';
import { OptionItem } from './OptionItem';
import { OptionEntryFormProps, SubOptionValueProps, subOptionValueDefault } from '../types';
import styles from '../styles/OptionsEntryForm.less';

export const OptionEntryForm: FC<OptionEntryFormProps> = ({ optionValue, setOptionValue }) => {
  const handleOnChangeValue = (value: SubOptionValueProps, index: number) => {
    const newOptions = [...optionValue.subs];
    newOptions[index] = value;
    setOptionValue({ ...optionValue, subs: newOptions });
  };

  const handleOnClickDeleteSubOption = (index: number) => {
    const newOptions = [...optionValue.subs];
    newOptions.splice(index, 1);
    setOptionValue({ ...optionValue, subs: newOptions });
  };

  const handleClickAddOption = () => {
    setOptionValue({ ...optionValue, subs: [...optionValue.subs, subOptionValueDefault] });
  };

  const handleSubmit = () => {
    alert('Coming soon ');
  };

  const handleCancel = () => {
    alert('Coming soon ');
  };

  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      contentClass={styles.container}
    >
      <FormNameInput
        placeholder="type group name"
        title="Option Group"
        HandleOnClickAddIcon={handleClickAddOption}
        onChangeInput={(e) => {
          setOptionValue({ ...optionValue, name: e.target.value });
        }}
        inputValue={optionValue.name}
      />
      <div
        className={styles.container__item_wrapper}
        style={{
          padding: '0px 16px',
        }}
      >
        {optionValue.subs.map((option, index) => (
          <OptionItem
            key={index}
            value={option}
            onChangeValue={(value) => {
              handleOnChangeValue(value, index);
            }}
            handleOnClickDelete={() => {
              handleOnClickDeleteSubOption(index);
            }}
          />
        ))}
      </div>
    </EntryFormWrapper>
  );
};
