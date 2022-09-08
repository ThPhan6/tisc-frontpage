import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';

import {
  emailMessageError,
  emailMessageErrorType,
  isEmptySpace,
  messageError,
  messageErrorType,
  validatePostalCode,
} from '@/helper/utils';
import { trimStart } from 'lodash';

import { FunctionalTypeData, LocationForm } from '../type';
import { CheckboxValue } from '@/components/CustomCheckbox/types';

import CollapseCheckboxList from '@/components/CustomCheckbox/CollapseCheckboxList';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import CityModal from '@/features/locations/components/CityModal';
import CountryModal from '@/features/locations/components/CountryModal';
import StateModal from '@/features/locations/components/StateModal';

import { getListFunctionalType } from '../api';
import styles from './LocationEntryForm.less';

interface LocationEntryFormProps {
  submitButtonStatus: any;
  onSubmit: (data: LocationForm) => void;
  onCancel: () => void;
  data: LocationForm;
  setData: (data: LocationForm) => void;
}

type FieldName = keyof LocationForm;
const LocationEntryForm: FC<LocationEntryFormProps> = (props) => {
  const { submitButtonStatus, onSubmit, onCancel, data, setData } = props;
  // for content type modal
  const [visible, setVisible] = useState({
    country: false,
    state: false,
    city: false,
  });

  const [countryData, setCountryData] = useState({
    label: '',
    value: data.country_id,
    phoneCode: '00',
  });
  const [stateData, setStateData] = useState({
    label: '',
    value: data.state_id,
  });
  const [cityData, setCityData] = useState({
    label: '',
    value: data.city_id,
  });

  const [functionalTypes, setFunctionalTypes] = useState<FunctionalTypeData[]>([]);
  const [selectedFunctionalTypes, setSelectedFunctionTypes] = useState<CheckboxValue[]>([]);

  const getFunctionTypeIds = (types: CheckboxValue[]) => {
    const newFunctionTypeIds = types
      .filter((type) => type.value !== 'other')
      .map((type) => type.value as string);
    const otherFuntionType = types.find((type) => type.value === 'other');
    if (otherFuntionType) {
      newFunctionTypeIds.push(otherFuntionType.label as string);
    }
    return newFunctionTypeIds;
  };
  const onChangeData = (fieldName: FieldName, fieldValue: any) => {
    setData({
      ...data,
      [fieldName]: trimStart(fieldValue),
    });
  };
  // handle onchange postal code
  const onChangePostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    // only 10 chars and cannot type space
    if (!validatePostalCode(e.target.value) || !isEmptySpace(e.target.value)) {
      return;
    }
    setData({
      ...data,
      postal_code: trimStart(e.target.value),
    });
  };

  useEffect(() => {
    getListFunctionalType().then(setFunctionalTypes);
  }, []);

  useEffect(() => {
    setSelectedFunctionTypes(
      data.functional_type_ids.map((typeId) => {
        return {
          label: functionalTypes.find((type) => type.id === typeId)?.name,
          value: typeId,
        };
      }),
    );
  }, [data.functional_type_ids, functionalTypes]);

  useEffect(() => {
    if (countryData.value !== '') {
      onChangeData('country_id', countryData.value);
    }
  }, [countryData]);

  useEffect(() => {
    onChangeData('state_id', stateData.value);
  }, [stateData]);

  useEffect(() => {
    onChangeData('city_id', cityData.value);
  }, [cityData]);

  const handleSubmit = () => {
    return onSubmit({
      business_name: data.business_name?.trim() ?? '',
      business_number: data.business_number?.trim() ?? '',
      country_id: data.country_id,
      state_id: data.state_id,
      city_id: data.city_id,
      address: data.address?.trim() ?? '',
      postal_code: data.postal_code?.trim() ?? '',
      general_phone: data.general_phone?.trim() ?? '',
      general_email: data.general_email?.trim() ?? '',
      functional_type_ids: getFunctionTypeIds(selectedFunctionalTypes),
    });
  };
  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={onCancel}
      submitButtonStatus={submitButtonStatus}>
      <InputGroup
        label="Business Name"
        required
        deleteIcon
        fontLevel={3}
        value={data.business_name}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        onChange={(e) => {
          onChangeData('business_name', e.target.value);
        }}
        onDelete={() => onChangeData('business_name', '')}
        placeholder="registered business / company name"
      />
      <InputGroup
        label="Business Number"
        required
        deleteIcon
        fontLevel={3}
        value={data.business_number}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        onChange={(e) => {
          onChangeData('business_number', e.target.value);
        }}
        onDelete={() => onChangeData('business_number', '')}
        placeholder="registered business number for verification"
      />

      <FormGroup
        label="Functional Type"
        required
        layout="vertical"
        formClass={`${styles.formGroup} ${
          selectedFunctionalTypes.length > 0 ? styles.activeFunctionType : ''
        }`}>
        <CollapseCheckboxList
          options={functionalTypes.map((functionalType) => {
            return {
              label: functionalType.name,
              value: functionalType.id,
            };
          })}
          checked={selectedFunctionalTypes}
          onChange={setSelectedFunctionTypes}
          placeholder={
            selectedFunctionalTypes.length === 0
              ? 'select all relevance'
              : selectedFunctionalTypes.map((item) => item.label).join(', ')
          }
          otherInput
        />
      </FormGroup>

      <InputGroup
        label="Country"
        required
        fontLevel={3}
        value={countryData.label}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        rightIcon
        onRightIconClick={() =>
          setVisible({
            city: false,
            state: false,
            country: true,
          })
        }
        placeholder="select country"
      />
      <InputGroup
        label="State / Province"
        required
        fontLevel={3}
        value={stateData.label}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        rightIcon
        disabled={countryData.value === '-1' || countryData.value === ''}
        onRightIconClick={() =>
          setVisible({
            city: false,
            state: true,
            country: false,
          })
        }
        placeholder="select state / province"
      />
      <InputGroup
        label="City / Town"
        required
        fontLevel={3}
        value={cityData.label}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        rightIcon
        disabled={stateData.value === ''}
        onRightIconClick={() =>
          setVisible({
            city: true,
            state: false,
            country: false,
          })
        }
        placeholder="select city / town"
      />

      <div className={styles.addressForm}>
        <FormGroup label="Address" required layout="vertical">
          <CustomTextArea
            className={styles.address}
            maxLength={120}
            showCount
            placeholder="unit #, street / road name"
            borderBottomColor="mono-medium"
            onChange={(e) => onChangeData('address', e.target.value)}
            value={data.address}
            boxShadow
          />
        </FormGroup>
      </div>
      <InputGroup
        label="Postal / Zip Code"
        placeholder="postal / zip code"
        required
        deleteIcon
        fontLevel={3}
        value={data.postal_code}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        onChange={(e) => {
          onChangePostalCode(e);
        }}
        onDelete={() => onChangeData('postal_code', '')}
        message={messageError(data.postal_code, 10, MESSAGE_ERROR.POSTAL_CODE)}
        messageType={messageErrorType(data.postal_code, 10, 'error', 'normal')}
      />
      <FormGroup label="General Phone" required layout="vertical" formClass={styles.formGroup}>
        <PhoneInput
          phonePlaceholder="area code / number"
          onChange={(value) => {
            onChangeData('general_phone', value.phoneNumber);
          }}
          colorPlaceholder="mono"
          containerClass={styles.phoneInputCustom}
          codeReadOnly
          value={{
            zoneCode: countryData.phoneCode,
            phoneNumber: data.general_phone,
          }}
          deleteIcon
        />
      </FormGroup>
      <InputGroup
        label="General Email"
        required
        deleteIcon
        fontLevel={3}
        value={data.general_email}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        onChange={(e) => {
          onChangeData('general_email', e.target.value);
        }}
        onDelete={() => onChangeData('general_email', '')}
        placeholder="general email address"
        message={emailMessageError(data.general_email, MESSAGE_ERROR.EMAIL_UNVALID)}
        messageType={emailMessageErrorType(data.general_email, 'error', 'normal')}
      />
      <CountryModal
        visible={visible.country}
        setVisible={(status) =>
          setVisible({
            city: false,
            state: false,
            country: status,
          })
        }
        chosenValue={countryData}
        setChosenValue={setCountryData}
        withPhoneCode
      />
      <StateModal
        countryId={data.country_id}
        visible={visible.state}
        setVisible={(status) =>
          setVisible({
            city: false,
            state: status,
            country: false,
          })
        }
        chosenValue={stateData}
        setChosenValue={setStateData}
      />

      <CityModal
        stateId={data.state_id}
        countryId={data.country_id}
        visible={visible.city}
        setVisible={(status) =>
          setVisible({
            city: status,
            state: false,
            country: false,
          })
        }
        chosenValue={cityData}
        setChosenValue={setCityData}
      />
    </EntryFormWrapper>
  );
};

export default LocationEntryForm;
