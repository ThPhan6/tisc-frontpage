import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { FC } from 'react';
import { CategoryEntryFormProps, subcategoryValueDefault, SubcategoryValueProp } from '../types';
import { SubcategoryItem } from './SubcategoryItem';

export const CategoryEntryForm: FC<CategoryEntryFormProps> = ({
  onCancel,
  onSubmit,
  categoryValue,
  setCategoryValue,
  submitButtonStatus,
}) => {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(categoryValue);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleOnChange = (value: SubcategoryValueProp, index: number) => {
    const newSubcategory = [...categoryValue.subs];
    newSubcategory[index] = value;
    setCategoryValue({ ...categoryValue, subs: newSubcategory });
  };

  const handleOnClickDeleteSubcategory = (index: number) => {
    const newSubcategory = [...categoryValue.subs];
    newSubcategory.splice(index, 1);
    setCategoryValue({ ...categoryValue, subs: newSubcategory });
  };

  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      submitButtonStatus={submitButtonStatus}
    >
      <FormNameInput
        HandleOnClickAddIcon={() => {
          setCategoryValue({
            ...categoryValue,
            subs: [...categoryValue.subs, subcategoryValueDefault],
          });
        }}
        placeholder="type main category name"
        title="main category"
        onChangeInput={(e) => {
          setCategoryValue({ ...categoryValue, name: e.target.value });
        }}
        inputValue={categoryValue.name}
      />
      <div>
        {categoryValue.subs.map((category, index) => (
          <SubcategoryItem
            onChange={(value) => handleOnChange(value, index)}
            key={index}
            onClickDeleteSubcategory={() => handleOnClickDeleteSubcategory(index)}
            value={category}
          />
        ))}
      </div>
    </EntryFormWrapper>
  );
};
