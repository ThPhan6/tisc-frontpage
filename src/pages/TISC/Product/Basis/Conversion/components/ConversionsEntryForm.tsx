import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { FC } from 'react';
import { ConversionItem } from './ConversionItem';
import { ConversionsEntryFormProps, conversionValueDefault, ConversionValueProp } from '@/types';

export const ConversionsEntryForm: FC<ConversionsEntryFormProps> = ({
  conversionValue,
  setConversionValue,
  onCancel,
  onSubmit,
  submitButtonStatus,
}) => {
  const handleOnChangeValue = (value: ConversionValueProp['subs'][0], index: number) => {
    const newSub = [...conversionValue.subs];
    newSub[index] = value;
    setConversionValue({
      ...conversionValue,
      subs: newSub,
    });
  };

  const handleOnClickDelete = (index: number) => {
    const newSub = [...conversionValue.subs];
    newSub.splice(index, 1);
    setConversionValue({
      ...conversionValue,
      subs: newSub,
    });
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        ...conversionValue,
        name: conversionValue.name.trim(),
        subs: conversionValue.subs.map((sub) => {
          return {
            ...sub,
            name_1: sub.name_1.trim(),
            name_2: sub.name_2.trim(),
            unit_1: sub.unit_1.trim(),
            unit_2: sub.unit_2.trim(),
            formula_1: sub.formula_1.trim(),
            formula_2: sub.formula_2.trim(),
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

  const handleOnChangeConversionGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConversionValue({
      ...conversionValue,
      name: e.target.value,
    });
  };

  const HandleOnClickAddIcon = () => {
    setConversionValue({
      ...conversionValue,
      subs: [...conversionValue.subs, conversionValueDefault],
    });
  };

  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      submitButtonStatus={submitButtonStatus}
    >
      <FormNameInput
        placeholder="type group name"
        title="Conversion Group"
        onChangeInput={handleOnChangeConversionGroupName}
        HandleOnClickAddIcon={HandleOnClickAddIcon}
        inputValue={conversionValue.name}
      />
      <div>
        {conversionValue.subs.map((conversion, index) => (
          <ConversionItem
            key={index}
            value={conversion}
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
