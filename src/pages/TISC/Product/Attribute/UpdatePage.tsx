import { TableHeader } from '@/components/Table/TableHeader';
import styles from './styles/CreateConversionPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import AttributeEntryForm from './components/AttributeEntryForm';
import { useParams } from 'umi';
import { useAttributeLocation } from './hooks/location';
import { useBoolean } from '@/helper/hook';
import { useState, useEffect } from 'react';
import LoadingPageCustomize from '@/components/LoadingPage';
import { pushTo } from '@/helper/history';

import type { IAttributeForm } from './types';
import { updateAttribute, getOneAttribute } from './services/api';
const DEFAULT_ATTRIBUTE: IAttributeForm = {
  name: '',
  subs: [],
};

const UpdateAttributePage = () => {
  const { activePath, attributeLocation } = useAttributeLocation();
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [data, setData] = useState<IAttributeForm>(DEFAULT_ATTRIBUTE);
  const params = useParams<{
    id: string;
  }>();
  const idAttribute = params?.id || '';

  const getAttributeData = () => {
    getOneAttribute(idAttribute).then((res) => {
      if (res) {
        setData(res);
      }
    });
  };

  useEffect(() => {
    getAttributeData();
  }, []);

  const handleCreate = (submitData: IAttributeForm) => {
    isLoading.setValue(true);
    updateAttribute(idAttribute, submitData).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        return getAttributeData();
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

export default UpdateAttributePage;
