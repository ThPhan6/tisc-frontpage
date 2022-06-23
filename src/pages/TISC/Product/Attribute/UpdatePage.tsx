import { TableHeader } from '@/components/Table/TableHeader';
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
      submitButtonStatus.setValue(true);
      setTimeout(() => {
        submitButtonStatus.setValue(false);
      }, 2000);
      if (isSuccess) {
        return getAttributeData();
      }
    });
  };

  const handleCancel = () => {
    pushTo(activePath);
  };

  return (
    <div>
      <TableHeader title={attributeLocation.NAME} rightAction={<PlusIcon />} />
      <div>
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
