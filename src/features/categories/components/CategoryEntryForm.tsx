import { FC } from 'react';

import type {
  CategoryBodyProps,
  SubcategoryValueProps,
  subcategoryValueDefault,
} from '@/features/categories/types';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';

import { SubcategoryItem } from './SubcategoryItem';

export interface CategoryEntryFormProps {
  onCancel?: () => void;
  onSubmit?: (data: CategoryBodyProps) => void;
  categoryValue: CategoryBodyProps;
  setCategoryValue: (value: CategoryBodyProps) => void;
  submitButtonStatus?: boolean;
}

export const CategoryEntryForm: FC<CategoryEntryFormProps> = ({
  onCancel,
  onSubmit,
  categoryValue,
  setCategoryValue,
  submitButtonStatus,
}) => {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        ...categoryValue,
        name: categoryValue.name.trim(),
        subs: categoryValue.subs.map((sub) => {
          return {
            ...sub,
            name: sub.name.trim(),
            subs: sub.subs?.map((subItem) => {
              return {
                ...subItem,
                name: subItem.name.trim(),
              };
            }),
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

  const handleOnChange = (value: SubcategoryValueProps, index: number) => {
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
      submitButtonStatus={submitButtonStatus}>
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
