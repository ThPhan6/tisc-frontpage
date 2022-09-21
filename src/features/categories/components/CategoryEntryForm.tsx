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
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { SubcategoryItem } from './SubcategoryItem';

const CategoryEntryForm = () => {
  const [categoryValue, setCategoryValue] = useState<{
    id?: string;
    name: string;
    subs: SubcategoryValueProps[];
  }>({
    name: '',
    subs: [],
  });
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const idCategory = useGetParamId();
  const isUpdate = idCategory ? true : false;

  useEffect(() => {
    if (idCategory) {
      isLoading.setValue(true);
      getOneCategoryMiddleware(
        idCategory,
        (dataRes: CategoryBodyProps) => {
          setCategoryValue(dataRes);
          isLoading.setValue(false);
        },
        () => {
          isLoading.setValue(false);
        },
      );
    }
  }, []);

  const handleCreateCategory = (data: CategoryBodyProps) => {
    createCategoryMiddleware(data, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.CREATE_CATEGORY_SUCCESS);
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.categories);
          submitButtonStatus.setValue(false);
        }, 1000);
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  const handleUpdateCategory = (data: CategoryBodyProps) => {
    updateCategoryMiddleware(idCategory, data, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.UPDATE_CATEGORY_SUCCESS);
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 1000);
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  const handleSubmit = isUpdate ? handleUpdateCategory : handleCreateCategory;

  const onHandleSubmit = () => {
    isLoading.setValue(true);
    handleSubmit({
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
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default CategoryEntryForm;
