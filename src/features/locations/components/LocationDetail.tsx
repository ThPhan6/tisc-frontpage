import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { USER_ROLE } from '@/constants/userRoles';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId, useGetUserRoleFromPathname } from '@/helper/hook';
import { getSelectedOptions, getValueByCondition } from '@/helper/utils';

import { LocationForm } from '../type';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { RadioValue } from '@/components/CustomRadio/types';

import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import {
  createLocation,
  getListFunctionalType,
  getListFunctionalTypeForDesign,
  getLocationById,
  updateLocation,
} from '../api';
import LocationEntryForm from './LocationEntryForm';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const LocationDetail = () => {
  const isSubmitted = useBoolean(false);
  const loadedData = useBoolean(false);

  const locationId = useGetParamId();
  // for checking updating action
  const isUpdate = locationId ? true : false;

  const currentUser = useGetUserRoleFromPathname();
  const isTiscUser = currentUser === USER_ROLE.tisc;
  const isBrandUser = currentUser === USER_ROLE.brand;
  const isDesignerUser = currentUser === USER_ROLE.design;

  /// for user role path
  const userRolePath = getValueByCondition(
    [
      [isTiscUser, PATH.tiscLocation],
      [isBrandUser, PATH.brandLocation],
      [isDesignerUser, PATH.designFirmLocation],
    ],
    '',
  );

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

  const [functionalTypes, setFunctionalTypes] = useState<CheckboxValue[] | RadioValue[]>([]);
  /// for show items have been already selected to show on first loading
  let selectedFunctionType: CheckboxValue[] = [];
  if (!isDesignerUser) {
    selectedFunctionType = getSelectedOptions(
      functionalTypes as CheckboxValue[],
      data.functional_type_ids as string[],
    );
  }

  const goBackToLocationList = () => {
    pushTo(userRolePath);
  };

  const getOneLocation = () =>
    getLocationById(locationId).then((res) => {
      if (res) {
        setData({
          business_name: res.business_name,
          business_number: isDesignerUser ? '' : res.business_number,
          country_id: res.country_id,
          state_id: res.state_id,
          city_id: res.city_id,
          address: res.address,
          postal_code: res.postal_code,
          general_phone: res.general_phone,
          general_email: res.general_email,
          functional_type_ids: res.functional_type_ids.map((id) => id),
        });
        loadedData.setValue(true);
      }
    });

  const getListFuncType = () => {
    if (isDesignerUser) {
      return getListFunctionalTypeForDesign().then((res) => {
        if (res) {
          setFunctionalTypes(
            res.map((el) => ({
              label: el.name,
              value: String(el.id),
            })),
          );
          // set default functional type value is 'main office' when create a new location
          if (!isUpdate) {
            setData({ ...data, functional_type_ids: [String(res[0]?.id)] });
          }
        }
      });
    }

    return getListFunctionalType().then((res) => {
      if (res) {
        setFunctionalTypes(
          res.map((el) => ({
            label: el.name,
            value: el.id,
          })),
        );
      }
    });
  };

  const onSubmit = (submitData: LocationForm) => {
    showPageLoading();

    if (isUpdate) {
      updateLocation(locationId, submitData).then((isSuccess) => {
        hidePageLoading();
        if (isSuccess) {
          isSubmitted.setValue(true);

          getOneLocation();
          getListFuncType();

          setTimeout(() => {
            isSubmitted.setValue(false);
          }, 1000);
        }
      });
    } else {
      createLocation(submitData).then((isSuccess) => {
        hidePageLoading();
        if (isSuccess) {
          isSubmitted.setValue(true);
          setTimeout(() => {
            goBackToLocationList();
          }, 1000);
        }
      });
    }
  };

  useEffect(() => {
    getListFuncType();
    if (locationId) {
      getOneLocation();
    }
  }, []);

  if (isUpdate && !loadedData.value) {
    return null;
  }

  return (
    <div>
      <TableHeader title="LOCATIONS" rightAction={<CustomPlusButton disabled />} />
      <LocationEntryForm
        isSubmitted={isSubmitted.value}
        onSubmit={onSubmit}
        onCancel={goBackToLocationList}
        data={data}
        setData={setData}
        functionalTypeData={functionalTypes}
        selectedFunctionType={selectedFunctionType}
      />
    </div>
  );
};

export default LocationDetail;
