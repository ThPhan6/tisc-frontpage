import { useState } from 'react';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';

import { LocationForm } from '../type';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { createLocation, updateLocation } from '../api';
import LocationEntryForm from './LocationEntryForm';

const useLocationInfo = (tableLink: string, action: 'create' | 'update') => {
  const locationId = useGetParamId();
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
    pushTo(tableLink);
  };

  const onSubmit = (submitData: LocationForm) => {
    isLoading.setValue(true);

    /// for create location
    if (action === 'create') {
      createLocation(submitData).then((isSuccess) => {
        isLoading.setValue(false);
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            goBackToLocationList();
          }, 1000);
        }
      });
    }

    /// for update location
    if (action === 'update') {
      updateLocation(locationId, submitData).then((isSuccess) => {
        isLoading.setValue(false);
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 1000);
        }
      });
    }
  };

  const renderLocationTable = () => (
    <div>
      <TableHeader title="LOCATIONS" rightAction={<CustomPlusButton disabled />} />
      <LocationEntryForm
        submitButtonStatus={submitButtonStatus.value}
        onSubmit={onSubmit}
        onCancel={goBackToLocationList}
        data={data}
        setData={setData}
      />
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );

  return { submitButtonStatus, isLoading, locationId, renderLocationTable, setData };
};

export default useLocationInfo;
