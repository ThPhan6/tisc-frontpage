import { useEffect, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import {
  createCategoryMiddleware,
  deleteCategoryMiddleware,
  getOneCategoryMiddleware,
  updateCategoryMiddleware,
} from '../services';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';

import {
  CategoryBodyProps,
  SubcategoryValueProps,
  subcategoryValueDefault,
} from '@/features/categories/types';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { SubcategoryItem } from './SubcategoryItem';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const CategoryEntryForm = () => {
  const [categoryValue, setCategoryValue] = useState<CategoryBodyProps>({
    name: '',
    subs: [],
  });
  const submitButtonStatus = useBoolean(false);
  const idCategory = useGetParamId();
  const isUpdate = idCategory ? true : false;

  useEffect(() => {
    if (idCategory) {
      showPageLoading();
      getOneCategoryMiddleware(
        idCategory,
        (dataRes: CategoryBodyProps) => {
          setCategoryValue(dataRes);
          hidePageLoading();
        },
        () => {
          hidePageLoading();
        },
      );
    }
  }, []);

  const handleCallbackFunction =
    (functionHandleType: 'create' | 'update') => (type: STATUS_RESPONSE, msg?: string) => {
      hidePageLoading();
      if (type !== STATUS_RESPONSE.SUCCESS) {
        return message.error(msg);
      }
      message.success(
        functionHandleType === 'create'
          ? MESSAGE_NOTIFICATION.CREATE_CATEGORY_SUCCESS
          : MESSAGE_NOTIFICATION.UPDATE_CATEGORY_SUCCESS,
      );
      submitButtonStatus.setValue(true);
      setTimeout(() => {
        if (functionHandleType === 'create') {
          pushTo(PATH.categories);
        }
        submitButtonStatus.setValue(false);
      }, 1000);
    };

  const handleCreateCategory = (data: CategoryBodyProps) => {
    createCategoryMiddleware(data, handleCallbackFunction('create'));
  };

  const handleUpdateCategory = (data: CategoryBodyProps) => {
    updateCategoryMiddleware(idCategory, data, handleCallbackFunction('update'));
  };

  const handleSubmit = isUpdate ? handleUpdateCategory : handleCreateCategory;

  const trimName = (value: any): CategoryBodyProps => ({
    ...value,
    name: value.name.trim(),
    subs: value.subs?.map((sub: any) => trimName(sub)),
  });

  const onHandleSubmit = () => {
    showPageLoading();
    handleSubmit(trimName(categoryValue));
  };

  const handleCancel = () => {
    pushTo(PATH.categories);
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

  const handleDeleteCategory = () => {
    deleteCategoryMiddleware(idCategory).then((isSuccess) => {
      if (isSuccess) {
        pushTo(PATH.categories);
      }
    });
  };

  return (
    <div>
      <TableHeader title={'CATEGORIES'} rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        handleSubmit={onHandleSubmit}
        handleCancel={handleCancel}
        handleDelete={handleDeleteCategory}
        submitButtonStatus={submitButtonStatus.value}
        entryFormTypeOnMobile={isUpdate ? 'edit' : 'create'}>
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
    </div>
  );
};

export default CategoryEntryForm;
