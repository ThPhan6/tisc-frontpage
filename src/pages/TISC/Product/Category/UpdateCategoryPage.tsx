import { useEffect, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import { getOneCategoryMiddleware, updateCategoryMiddleware } from '@/features/categories/services';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';

import { CategoryBodyProps, SubcategoryValueProps } from '@/features/categories/types';

import { hidePageLoading, showPageLoading } from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { CategoryEntryForm } from '@/features/categories/components/CategoryEntryForm';

const UpdateCategoryPage = () => {
  const submitButtonStatus = useBoolean(false);
  const idCategory = useGetParamId();

  const [categoryValue, setCategoryValue] = useState<{
    id?: string;
    name: string;
    subs: SubcategoryValueProps[];
  }>({
    name: '',
    subs: [],
  });

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
      return;
    }
    pushTo(PATH.categories);
  }, []);

  const handleUpdateCategory = (data: CategoryBodyProps) => {
    if (!idCategory) {
      pushTo(PATH.categories);
    }
    showPageLoading();

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
      hidePageLoading();
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
    </div>
  );
};

export default UpdateCategoryPage;
