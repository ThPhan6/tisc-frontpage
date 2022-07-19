import React, { useState, useEffect } from 'react';
import LocationEntryForm from '@/components/Location/LocationEntryForm';
import { useBoolean } from '@/helper/hook';
import LoadingPageCustomize from '@/components/LoadingPage';
import { LocationForm } from '@/types';
import { updateLocation, getLocationById } from '@/services';
import { useParams } from 'umi';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';

const LocationLocationUpdatePage: React.FC = () => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean();
  const [loadedData, setLoadedData] = useState(false);
  const params = useParams<{
    id: string;
  }>();
  const locationId = params?.id || '';

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

  const getLocationData = () => {
    getLocationById(locationId).then((res) => {
      if (res) {
        setData({
          business_name: res.business_name,
          business_number: res.business_number,
          country_id: res.country_id,
          state_id: res.state_id,
          city_id: res.city_id,
          address: res.address,
          postal_code: res.postal_code,
          general_phone: res.general_phone,
          general_email: res.general_email,
          functional_type_ids: res.functional_types.map((type) => type.id),
        });
        setLoadedData(true);
      }
    });
  };

  useEffect(() => {
    getLocationData();
  }, []);

  const goBackToLocationList = () => {
    pushTo(PATH.brandLocation);
  };

  const onSubmit = (submitData: LocationForm) => {
    isLoading.setValue(true);
    updateLocation(locationId, submitData).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 1000);
        return;
      }
    });
  };

  if (!loadedData) {
    return null;
  }

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

export default LocationLocationUpdatePage;
