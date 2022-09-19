import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { createOptionMiddleWare, getOneBasisOption, updateBasisOption } from '@/services';
import { merge } from 'lodash';

import type { BasisOptionForm, BasisOptionSubForm, SubBasisOption } from '@/types';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { OptionItem } from './OptionItem';

const DEFAULT_SUB_OPTION: BasisOptionSubForm = {
  name: '',
  is_have_image: false,
  subs: [],
};

const OptionsEntryForm = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [option, setOption] = useState<BasisOptionForm>({
    name: '',
    subs: [],
  });
  const idBasisOption = useGetParamId();
  const isUpdate = idBasisOption ? true : false;
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

  const handleChangeSubItem = (changedSubs: BasisOptionSubForm, index: number) => {
    const newSubs = [...option.subs];
    newSubs[index] = changedSubs;
    setOption({
      ...option,
      subs: newSubs,
    });
  };

  const getBasisOptionData = () => {
    getOneBasisOption(idBasisOption).then((res) => {
      if (res) {
        setOption(res);
      }
    });
  };

  useEffect(() => {
    if (idBasisOption) {
      getBasisOptionData();
    }
  }, []);

  const handleCreateOption = (data: BasisOptionForm) => {
    isLoading.setValue(true);

    createOptionMiddleWare(data).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.options);
        }, 1000);
      }
      isLoading.setValue(false);
    });
  };

  const handleUpdateOption = (data: BasisOptionForm) => {
    isLoading.setValue(true);
    updateBasisOption(idBasisOption, data).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 2000);
        getBasisOptionData();
      }
      isLoading.setValue(false);
    });
  };

  const handleSubmit = isUpdate ? handleUpdateOption : handleCreateOption;

  const onHandleSubmit = () => {
    const newSubs: BasisOptionSubForm[] = option.subs.map((subOption) => {
      const itemOptions: SubBasisOption[] = subOption.subs.map((optionItem) => {
        let requiredValue = {
          value_1: optionItem.value_1.trim(),
          value_2: optionItem.value_2.trim(),
          unit_1: optionItem.unit_1.trim(),
          unit_2: optionItem.unit_2.trim(),
        };
        /// if it has ID, include ID
        if (optionItem.id) {
          requiredValue = merge(requiredValue, { id: optionItem.id });
        }
        /// send image data if using image otherwise remove it
        if (subOption.is_have_image && optionItem.image) {
          const imageData = optionItem.isBase64 ? optionItem.image.split(',')[1] : optionItem.image;
          requiredValue = merge(requiredValue, { image: imageData });
        }
        return requiredValue;
      });
      let newSubOption = {
        name: subOption.name.trim(),
        subs: itemOptions,
        is_have_image: subOption.is_have_image ? true : false,
      };
      if (subOption.id) {
        newSubOption = merge(newSubOption, { id: subOption.id });
      }
      return newSubOption;
    });
    handleSubmit({
      ...option,
      name: option.name.trim(),
      subs: newSubs,
    });
  };

  const handleCancel = () => {
    pushTo(PATH.options);
  };

  return (
    <div>
      <TableHeader title={'OPTIONS'} rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        handleSubmit={onHandleSubmit}
        handleCancel={handleCancel}
        submitButtonStatus={submitButtonStatus.value}>
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
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default OptionsEntryForm;
