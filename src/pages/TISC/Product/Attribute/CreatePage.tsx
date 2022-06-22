import { TableHeader } from '@/components/Table/TableHeader';
import styles from './styles/CreateConversionPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import AttributeEntryForm from './components/AttributeEntryForm';
import { useAttributeLocation } from './hooks/location';
import { useBoolean } from '@/helper/hook';
import { useState } from 'react';
import LoadingPageCustomize from '@/components/LoadingPage';
import { pushTo } from '@/helper/history';
import type { IAttributeForm } from './types';
import { createAttribute } from './services/api';
const DEFAULT_ATTRIBUTE: IAttributeForm = {
  name: '',
  subs: [],
};

const CreateAttributePage = () => {
  const { activePath, attributeLocation } = useAttributeLocation();
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [data, setData] = useState<IAttributeForm>(DEFAULT_ATTRIBUTE);

  const handleCreate = (submitData: IAttributeForm) => {
    isLoading.setValue(true);
    createAttribute(submitData).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(activePath);
        }, 1000);
        return;
      }
    });
  };

  const handleCancel = () => {
    pushTo(activePath);
  };

  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={attributeLocation.NAME}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container__content}>
        <AttributeEntryForm
          data={data}
          setData={setData}
          type={attributeLocation.TYPE}
          submitButtonStatus={submitButtonStatus.value}
          onSubmit={handleCreate}
          onCancel={handleCancel}
        />
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default CreateAttributePage;
