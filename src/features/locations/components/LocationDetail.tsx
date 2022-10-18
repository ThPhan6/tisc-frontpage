import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { useBoolean, useCheckPermission, useGetParamId } from '@/helper/hook';
import { getValueByCondition } from '@/helper/utils';

import { LocationForm } from '../type';

import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { createLocation, getLocationById, updateLocation } from '../api';
import LocationEntryForm from './LocationEntryForm';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const LocationDetail = () => {
  const submitButtonStatus = useBoolean(false);

  const locationId = useGetParamId();
  // for checking updating action
  const isUpdate = locationId ? true : false;

  const isTISCAdmin = useCheckPermission('TISC Admin');
  const isBrandAdmin = useCheckPermission('Brand Admin');
  const isDesignAdmin = useCheckPermission('Design Admin');

  /// for user role path
  const userRolePath = getValueByCondition(
    [
      [isTISCAdmin, PATH.tiscLocation],
      [isBrandAdmin, PATH.brandLocation],
      [isDesignAdmin, PATH.designFirmLocation],
    ],
    '',
  );

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
    showPageLoading();

    if (isUpdate) {
      updateLocation(locationId, submitData).then((isSuccess) => {
        hidePageLoading();
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 1000);
        }
      });
    } else {
      createLocation(submitData).then((isSuccess) => {
        hidePageLoading();
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
            business_number: isDesignAdmin ? '' : res.business_number,
            country_id: res.country_id,
            state_id: res.state_id,
            city_id: res.city_id,
            address: res.address,
            postal_code: res.postal_code,
            general_phone: res.general_phone,
            general_email: res.general_email,
            functional_type_ids: res.functional_type_ids.map((id) => id),
          });
          setLoadedData(true);
        }
      });
    }
  }, []);

  console.log(data);

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
    </div>
  );
};

export default LocationDetail;
