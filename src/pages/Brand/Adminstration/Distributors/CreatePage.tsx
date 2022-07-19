import LoadingPageCustomize from '@/components/LoadingPage';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableHeader } from '@/components/Table/TableHeader';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { createDistributor } from '@/services/distributor.api';
import { DistributorForm } from '@/types/distributor.type';
import { useState } from 'react';
import { DistributorsEntryForm } from './components/DistributorsEntryForm';

const DEFAULT_DISTRIBUTOR: DistributorForm = {
  brand_id: '',
  name: '',
  country_name: '',
  country_id: '',
  state_name: '',
  state_id: '',
  city_name: '',
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
  authorized_country_name: '',
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
