import { useEffect, useState } from 'react';

import { useParams } from 'umi';

import { useAttributeLocation } from './hooks/location';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getOneAttribute, updateAttribute } from '@/services';

import type { AttributeForm } from '@/types';

import AttributeEntryForm from './components/AttributeEntryForm';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const DEFAULT_ATTRIBUTE: AttributeForm = {
  name: '',
  subs: [],
};

const UpdateAttributePage = () => {
  const { activePath, attributeLocation } = useAttributeLocation();
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [data, setData] = useState<AttributeForm>(DEFAULT_ATTRIBUTE);
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

  const handleCreate = (submitData: AttributeForm) => {
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
      <TableHeader title={attributeLocation.NAME} rightAction={<CustomPlusButton disabled />} />
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
