import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { FC, useState } from 'react';
import { OptionItem } from './OptionItem';
import { IBasisOptionForm, IBasisOptionSubForm } from '../types';
import styles from '../styles/OptionsEntryForm.less';

interface IOptionEntryForm {
  option?: IBasisOptionForm;
  onCancel: () => void;
  onSubmit: (data: IBasisOptionForm) => void;
}

const DEFAULT_OPTION: IBasisOptionForm = {
  name: '',
  subs: [],
};

const DEFAULT_SUB_OPTION: IBasisOptionSubForm = {
  name: '',
  isUsingImage: false,
  subs: [],
};

const OptionEntryForm: FC<IOptionEntryForm> = (props) => {
  const { onCancel, onSubmit } = props;
  // if option was not defined => use default option
  const [option, setOption] = useState<IBasisOptionForm>(props.option ?? DEFAULT_OPTION);

  /// handle change name
  const handleChangeGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption({ ...option, name: e.target.value });
  };

  // handle add new sub items
  const handleClickAddOption = () => {
    setOption({
      ...option,
      subs: [...option.subs, DEFAULT_SUB_OPTION],
    });
  };

  const handleDeleteSubOption = (index: number) => {
    const newSubs = [...option.subs];
    newSubs.splice(index, 1);
    setOption({
      ...option,
      subs: newSubs,
    });
  };

  const handleChangeSubItem = (changedSubs: IBasisOptionSubForm, index: number) => {
    const newSubs = [...option.subs];
    newSubs[index] = changedSubs;
    setOption({
      ...option,
      subs: newSubs,
    });
  };

  return (
    <EntryFormWrapper
      handleSubmit={() => onSubmit(option)}
      handleCancel={onCancel}
      contentClass={styles.container}
    >
      <FormNameInput
        placeholder="type group name"
        title="Option Group"
        HandleOnClickAddIcon={handleClickAddOption}
        onChangeInput={handleChangeGroupName}
        inputValue={option.name}
      />
      <div
        className={styles.container__item_wrapper}
        style={{
          padding: '0px 16px',
        }}
      >
        {option.subs.map((subOption, index) => (
          <OptionItem
            key={index}
            optionIndex={index}
            subOption={subOption}
            handleChangeSubItem={(changedSubs) => handleChangeSubItem(changedSubs, index)}
            handleDeleteSubOption={() => handleDeleteSubOption(index)}
            isUsingImage={subOption.isUsingImage!}
          />
        ))}
      </div>
    </EntryFormWrapper>
  );
};

export default OptionEntryForm;
