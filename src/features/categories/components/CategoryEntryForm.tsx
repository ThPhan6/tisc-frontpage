import { useEffect, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import {
  createCategoryMiddleware,
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

  const callBackFunctionHandle =
    (functionHandleType: 'create' | 'update') => (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        if (functionHandleType === 'create') {
          message.success(MESSAGE_NOTIFICATION.CREATE_CATEGORY_SUCCESS);
        } else {
          message.success(MESSAGE_NOTIFICATION.UPDATE_CATEGORY_SUCCESS);
        }
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          if (functionHandleType === 'create') {
            pushTo(PATH.categories);
          }
          submitButtonStatus.setValue(false);
        }, 1000);
      } else {
        message.error(msg);
      }
      hidePageLoading();
    };

  const handleCreateCategory = (data: CategoryBodyProps) => {
    createCategoryMiddleware(data, callBackFunctionHandle('create'));
  };

  const handleUpdateCategory = (data: CategoryBodyProps) => {
    updateCategoryMiddleware(idCategory, data, callBackFunctionHandle('update'));
  };

  const handleSubmit = isUpdate ? handleUpdateCategory : handleCreateCategory;

  const trimName = (value: any) => ({
    ...value,
    name: value.name.trim(),
    subs: value.subs?.map((sub: any) => trimName(sub)),
  });

  const onHandleSubmit = () => {
    showPageLoading();
    handleSubmit(trimName(categoryValue) as CategoryBodyProps);
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

  return (
    <div>
      <TableHeader title={'CATEGORIES'} rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        handleSubmit={onHandleSubmit}
        handleCancel={handleCancel}
        submitButtonStatus={submitButtonStatus.value}>
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
