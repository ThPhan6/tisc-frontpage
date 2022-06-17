import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { FC } from 'react';
import { ConversionItem } from './ConversionItem';
import { ConversionsEntryFormProps, conversionValueDefault, ConversionValueProp } from '../types';
import styles from '../styles/ConversionsEntryForm.less';

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
      onSubmit(conversionValue);
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
      contentClass={styles.container}
      submitButtonStatus={submitButtonStatus}
    >
      <FormNameInput
        placeholder="type group name"
        title="Conversion Group"
        onChangeInput={handleOnChangeConversionGroupName}
        HandleOnClickAddIcon={HandleOnClickAddIcon}
        inputValue={conversionValue.name}
      />
      <div className={styles.container__item_wrapper}>
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
