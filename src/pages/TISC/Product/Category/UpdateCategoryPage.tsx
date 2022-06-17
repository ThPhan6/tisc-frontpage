import { TableHeader } from '@/components/Table/TableHeader';
import styles from './styles/CreateCategoryPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import { CategoryEntryForm } from './components/CategoryEntryForm';
import { CategoryBodyProp, SubcategoryValueProp } from './types';
import { getOneCategoryMiddleware, updateCategoryMiddleware } from './services/api';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { useBoolean } from '@/helper/hook';
import LoadingPageCustomize from '@/components/LoadingPage';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { useParams } from 'umi';
import { useEffect, useState } from 'react';

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
        pushTo(PATH.categories);
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'CATEGORIES'}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container__content}>
        <CategoryEntryForm
          onSubmit={handleUpdateCategory}
          categoryValue={categoryValue}
          setCategoryValue={setCategoryValue}
        />
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default UpdateCategoryPage;
