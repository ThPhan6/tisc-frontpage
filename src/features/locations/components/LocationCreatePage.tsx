import React from 'react';

import useLocationInfo from './hook';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { LocationForm, LocationTable } from '@/features/locations/type';

import { createLocation } from '@/features/locations/api';

const LocationCreatePage: React.FC<LocationTable> = ({ tableLink }) => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean();

  const goBackToLocationList = () => {
    pushTo(tableLink);
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
      }
    });
  };

  const { renderLocationTable } = useLocationInfo(
    tableLink,
    submitButtonStatus.value,
    isLoading.value,
    onSubmit,
  );

  return renderLocationTable();
};

export default LocationCreatePage;
