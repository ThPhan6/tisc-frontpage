import { useEffect, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import { getOneCategoryMiddleware, updateCategoryMiddleware } from '@/features/categories/services';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';

import { CategoryBodyProps, SubcategoryValueProps } from '@/features/categories/types';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { CategoryEntryForm } from '@/features/categories/components/CategoryEntryForm';

const UpdateCategoryPage = () => {
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
      return;
    }
    pushTo(PATH.categories);
  }, []);

  const handleUpdateCategory = (data: CategoryBodyProps) => {
    if (!idCategory) {
      pushTo(PATH.categories);
    }
    isLoading.setValue(true);
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

  const handleCancel = () => {
    pushTo(PATH.categories);
  };

  return (
    <div>
      <TableHeader title={'CATEGORIES'} rightAction={<CustomPlusButton disabled />} />
      <div>
        <CategoryEntryForm
          submitButtonStatus={submitButtonStatus.value}
          onSubmit={handleUpdateCategory}
          categoryValue={categoryValue}
          setCategoryValue={setCategoryValue}
          onCancel={handleCancel}
        />
      </div>
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default UpdateCategoryPage;
