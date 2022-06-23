import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import type { FC } from 'react';
import { OptionItem } from './OptionItem';
import type { IBasisOptionForm, IBasisOptionSubForm, ISubBasisOption } from '../types';
import { merge } from 'lodash';

interface IOptionEntryForm {
  option: IBasisOptionForm;
  setOption: (data: IBasisOptionForm) => void;
  onCancel: () => void;
  onSubmit: (data: IBasisOptionForm) => void;
  submitButtonStatus: any;
}

const DEFAULT_SUB_OPTION: IBasisOptionSubForm = {
  name: '',
  isUsingImage: false,
  subs: [],
};

const OptionEntryForm: FC<IOptionEntryForm> = (props) => {
  const { onCancel, onSubmit, option, setOption, submitButtonStatus } = props;

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

  const handleSubmit = () => {
    const newSubs: IBasisOptionSubForm[] = option.subs.map((subOption) => {
      const itemOptions: ISubBasisOption[] = subOption.subs.map((optionItem) => {
        let requiredValue = {
          value_1: optionItem.value_1,
          value_2: optionItem.value_2,
          unit_1: optionItem.unit_1,
          unit_2: optionItem.unit_2,
        };
        /// if it has ID, include ID
        if (optionItem.id) {
          requiredValue = merge(requiredValue, { id: optionItem.id });
        }
        /// send image data if using image otherwise remove it
        if (subOption.isUsingImage && optionItem.image) {
          const imageData = optionItem.isBase64 ? optionItem.image.split(',')[1] : optionItem.image;
          requiredValue = merge(requiredValue, { image: imageData });
        }
        return requiredValue;
      });
      let newSubOption = {
        name: subOption.name,
        subs: itemOptions,
      };
      if (subOption.id) {
        newSubOption = merge(newSubOption, { id: subOption.id });
      }
      return newSubOption;
    });
    return onSubmit({
      ...option,
      subs: newSubs,
    });
  };

  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={onCancel}
      submitButtonStatus={submitButtonStatus}
    >
      <FormNameInput
        placeholder="type group name"
        title="Option Group"
        HandleOnClickAddIcon={handleClickAddOption}
        onChangeInput={handleChangeGroupName}
        inputValue={option.name}
      />
      <div>
        {option.subs.map((subOption, index) => (
          <OptionItem
            key={index}
            optionIndex={index}
            subOption={subOption}
            handleChangeSubItem={(changedSubs) => handleChangeSubItem(changedSubs, index)}
            handleDeleteSubOption={() => handleDeleteSubOption(index)}
          />
        ))}
      </div>
    </EntryFormWrapper>
  );
};

export default OptionEntryForm;
