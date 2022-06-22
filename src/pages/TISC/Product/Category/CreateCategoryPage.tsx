import { TableHeader } from '@/components/Table/TableHeader';
import styles from './styles/CreateCategoryPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-dark-icon.svg';
import { CategoryEntryForm } from './components/CategoryEntryForm';
import { CategoryBodyProp, SubcategoryValueProp } from './types';
import { createCategoryMiddleware } from './services/api';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { useBoolean } from '@/helper/hook';
import LoadingPageCustomize from '@/components/LoadingPage';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { useState } from 'react';

const CreateCategoryPage = () => {
  const [categoryValue, setCategoryValue] = useState<{
    id?: string;
    name: string;
    subs: SubcategoryValueProp[];
  }>({
    name: '',
    subs: [],
  });
  const isLoading = useBoolean();

  const submitButtonStatus = useBoolean(false);

  const handleCreateCategory = (data: CategoryBodyProp) => {
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
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'CATEGORIES'}
        rightAction={
          <div className={styles.customButtonDisable} onClick={() => pushTo(PATH.createPresets)}>
            <PlusIcon />
          </div>
        }
      />
      <div className={styles.container__content}>
        <CategoryEntryForm
          submitButtonStatus={submitButtonStatus.value}
          categoryValue={categoryValue}
          setCategoryValue={setCategoryValue}
          onSubmit={handleCreateCategory}
          onCancel={handleCancel}
        />
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default CreateCategoryPage;
