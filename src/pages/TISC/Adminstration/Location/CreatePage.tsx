import React, { useState } from 'react';
import LocationEntryForm from './components/LocationEntryForm';
import { useBoolean } from '@/helper/hook';
// import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
// import { ICustomTableColumnType } from '@/components/Table/types';
import LoadingPageCustomize from '@/components/LoadingPage';
import { LocationForm } from '@/types';
import { createLocation } from '@/services';
// import { confirmDelete } from '@/helper/common';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';

const TISCLocationCreatePage: React.FC = () => {
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
    pushTo(PATH.tiscLocation);
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

export default TISCLocationCreatePage;
