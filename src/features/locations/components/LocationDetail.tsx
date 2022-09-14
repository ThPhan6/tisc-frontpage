import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { useBoolean, useCheckPermission, useGetParamId } from '@/helper/hook';

import { LocationForm } from '../type';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { createLocation, getLocationById, updateLocation } from '../api';
import LocationEntryForm from './LocationEntryForm';

const LocationDetail = () => {
  const locationId = useGetParamId();
  // for checking updating action
  const isUpdate = locationId ? true : false;

  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean();

  const isTISCAdmin = useCheckPermission('TISC Admin');
  const isBrandAdmin = useCheckPermission('Brand Admin');
  /// for user role path
  const userRolePath = isTISCAdmin ? PATH.tiscLocation : isBrandAdmin ? PATH.brandLocation : '';

  const [loadedData, setLoadedData] = useState(false);

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
    pushTo(userRolePath);
  };

  const onSubmit = (submitData: LocationForm) => {
    isLoading.setValue(true);

    if (isUpdate) {
      updateLocation(locationId, submitData).then((isSuccess) => {
        isLoading.setValue(false);
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 1000);
        }
      });
    } else {
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
  };

  useEffect(() => {
    if (locationId) {
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
    }
  }, []);

  if (isUpdate && !loadedData) {
    return null;
  }

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
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default LocationDetail;
