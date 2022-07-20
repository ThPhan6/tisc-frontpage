import React, { useState } from 'react';
import LocationEntryForm from '@/components/Location/LocationEntryForm';
import { useBoolean } from '@/helper/hook';
import LoadingPageCustomize from '@/components/LoadingPage';
import { LocationForm } from '@/types';
import { createLocation } from '@/services';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const BrandLocationCreatePage: React.FC = () => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean();
  const [data, setData] = useState<LocationForm>({
    business_name: '',
    business_number: '',
    functional_type_ids: [],
    country_id: '',
    state_id: '',
    city_id: '',
    address: '',
    postal_code: '',
    general_phone: '',
    general_email: '',
  });

  const goBackToLocationList = () => {
    pushTo(PATH.brandLocation);
  };

  const onSubmit = (submitData: LocationForm) => {
    isLoading.setValue(true);
    createLocation(submitData).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          goBackToLocationList();
        }, 1000);
        return;
      }
    });
  };

  return (
    <div>
      <TableHeader title="LOCATIONS" rightAction={<CustomPlusButton disabled />} />
      <LocationEntryForm
        submitButtonStatus={submitButtonStatus.value}
        onSubmit={onSubmit}
        onCancel={goBackToLocationList}
        data={data}
        setData={setData}
      />
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default BrandLocationCreatePage;
