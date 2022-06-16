import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { useState } from 'react';
import styles from '../styles/CategoryEntryForm.less';
import { subcategoryValueDefault, SubcategoryValueProp } from '../types';
import { SubcategoryItem } from './SubcategoryItem';

export const CategoryEntryForm = () => {
  const [categoryValue, setCategoryValue] = useState<SubcategoryValueProp[]>([]);

  console.log('categoryValue', categoryValue);

  const handleSubmit = () => {
    alert('Coming soon ');
  };

  const handleCancel = () => {
    alert('Coming soon ');
  };

  const handleOnChange = (value: SubcategoryValueProp, index: number) => {
    const newCategoryValue = [...categoryValue];
    newCategoryValue[index] = value;
    setCategoryValue(newCategoryValue);
  };

  const handleOnClickDeleteSubcategory = (index: number) => {
    const newCategoryValue = [...categoryValue];
    newCategoryValue.splice(index, 1);
    setCategoryValue(newCategoryValue);
  };

  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      contentClass={styles.container}
    >
      <FormNameInput
        HandleOnClickAddIcon={() => {
          setCategoryValue([...categoryValue, subcategoryValueDefault]);
        }}
        placeholder="type main category name"
        title="main category"
      />
      <div
        className={styles.container__item_wrapper}
        style={{
          padding: '0px 16px',
        }}
      >
        {categoryValue.map((category, index) => (
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
