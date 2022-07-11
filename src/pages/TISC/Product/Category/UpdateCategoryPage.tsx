import { TableHeader } from '@/components/Table/TableHeader';
import { CategoryEntryForm } from './components/CategoryEntryForm';
import { CategoryBodyProp, SubcategoryValueProp } from '@/types';
import { getOneCategoryMiddleware, updateCategoryMiddleware } from '@/services';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { useBoolean } from '@/helper/hook';
import LoadingPageCustomize from '@/components/LoadingPage';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { useParams } from 'umi';
import { useEffect, useState } from 'react';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const UpdateCategoryPage = () => {
  const [categoryValue, setCategoryValue] = useState<{
    id?: string;
    name: string;
    subs: SubcategoryValueProp[];
  }>({
    name: '',
    subs: [],
  });

  const isLoading = useBoolean();
  const params = useParams<{
    id: string;
  }>();
  const idCategory = params?.id || '';

  const submitButtonStatus = useBoolean(false);

  useEffect(() => {
    if (idCategory) {
      isLoading.setValue(true);
      getOneCategoryMiddleware(
        idCategory,
        (dataRes: CategoryBodyProp) => {
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

  const handleUpdateCategory = (data: CategoryBodyProp) => {
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
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default UpdateCategoryPage;
