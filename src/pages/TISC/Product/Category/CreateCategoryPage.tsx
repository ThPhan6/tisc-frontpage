import { useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import { createCategoryMiddleware } from '@/features/categories/services';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { hidePageLoading, showPageLoading } from '@/helper/utils';

import { CategoryBodyProps, SubcategoryValueProps } from '@/features/categories/types';

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

  const submitButtonStatus = useBoolean(false);

  const handleCreateCategory = (data: CategoryBodyProps) => {
    showPageLoading();
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
          categoryValue={categoryValue}
          setCategoryValue={setCategoryValue}
          onSubmit={handleCreateCategory}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreateCategoryPage;
