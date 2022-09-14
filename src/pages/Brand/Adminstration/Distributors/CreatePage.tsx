import { useState } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { DistributorForm } from '@/features/distributors/type';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { DistributorsEntryForm } from '@/features/distributors/components/DistributorsEntryForm';

import { createDistributor } from '@/features/distributors/api';

export const DEFAULT_DISTRIBUTOR: DistributorForm = {
  brand_id: '',
  name: '',
  country_id: '',
  state_id: '',
  city_id: '',
  address: '',
  phone_code: '',
  postal_code: '',
  first_name: '',
  last_name: '',
  gender: true,
  email: '',
  phone: '',
  mobile: '',
  authorized_country_ids: [],
  authorized_countries: [],
  coverage_beyond: true,
};

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
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};
export default CreatePage;
