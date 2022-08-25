import { useState } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { DEFAULT_DISTRIBUTOR, DistributorForm } from '@/features/distributors/type';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { DistributorsEntryForm } from '@/features/distributors/components/DistributorsEntryForm';

import { createDistributor } from '@/features/distributors/api';

const CreatePage = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [data, setData] = useState<DistributorForm>(DEFAULT_DISTRIBUTOR);

  const handleCreate = (submitData: DistributorForm) => {
    isLoading.setValue(true);
    createDistributor(submitData).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.distributors);
        }, 1000);
        return;
      }
    });
  };

  const handleCancel = () => {
    pushTo(PATH.distributors);
  };

  return (
    <div>
      <TableHeader title="DISTIBUTORS" rightAction={<CustomPlusButton disabled />} />
      <div>
        <DistributorsEntryForm
          data={data}
          setData={setData}
          submitButtonStatus={submitButtonStatus.value}
          onSubmit={handleCreate}
          onCancel={handleCancel}
        />
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};
export default CreatePage;
