import React, { useEffect, useState } from 'react';

import useLocationInfo from './hook';
import { useBoolean, useGetParamId } from '@/helper/hook';

import { LocationForm, LocationTable } from '@/features/locations/type';

import { getLocationById, updateLocation } from '@/features/locations/api';

const LocationUpdatePage: React.FC<LocationTable> = ({ tableLink }) => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean();
  const [loadedData, setLoadedData] = useState(false);
  const locationId = useGetParamId();

  const onSubmit = (submitData: LocationForm) => {
    isLoading.setValue(true);
    updateLocation(locationId, submitData).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 1000);
      }
    });
  };

  const { renderLocationTable, setData } = useLocationInfo(
    tableLink,
    submitButtonStatus.value,
    isLoading.value,
    onSubmit,
  );

  useEffect(() => {
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
  }, []);

  if (!loadedData) {
    return null;
  }

  return renderLocationTable();
};

export default LocationUpdatePage;
