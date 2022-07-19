import { TableHeader } from '@/components/Table/TableHeader';
import AttributeEntryForm from './components/AttributeEntryForm';
import { useAttributeLocation } from './hooks/location';
import { useBoolean } from '@/helper/hook';
import { useState } from 'react';
import LoadingPageCustomize from '@/components/LoadingPage';
import { pushTo } from '@/helper/history';
import type { AttributeForm } from '@/types';
import { createAttribute } from '@/services';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
const DEFAULT_ATTRIBUTE: AttributeForm = {
  name: '',
  subs: [],
};

const CreateAttributePage = () => {
  const { activePath, attributeLocation } = useAttributeLocation();
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [data, setData] = useState<AttributeForm>(DEFAULT_ATTRIBUTE);

  const handleCreate = (submitData: AttributeForm) => {
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

export default CreateAttributePage;
