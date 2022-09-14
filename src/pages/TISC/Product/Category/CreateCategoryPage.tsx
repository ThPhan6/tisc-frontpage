import { useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import { createCategoryMiddleware } from '@/features/categories/services';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { CategoryBodyProps, SubcategoryValueProps } from '@/features/categories/types';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { CategoryEntryForm } from '@/features/categories/components/CategoryEntryForm';

const CreateCategoryPage = () => {
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

  const handleCreateCategory = (data: CategoryBodyProps) => {
    isLoading.setValue(true);
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

  const handleCancel = () => {
    pushTo(PATH.categories);
  };

  return (
    <div>
      <TableHeader title={'CATEGORIES'} rightAction={<CustomPlusButton disabled />} />
      <div>
        <CategoryEntryForm
          submitButtonStatus={submitButtonStatus.value}
          categoryValue={categoryValue}
          setCategoryValue={setCategoryValue}
          onSubmit={handleCreateCategory}
          onCancel={handleCancel}
        />
      </div>
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default CreateCategoryPage;
