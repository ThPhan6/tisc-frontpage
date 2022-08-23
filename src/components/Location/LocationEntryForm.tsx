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
import { getListFunctionalType } from '@/services';
import { trimStart } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import type { FunctionalTypeData, LocationForm } from '@/types';

import CollapseCheckboxList from '@/components/CustomCheckbox/CollapseCheckboxList';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import CityModal from '@/components/Location/CityModal';
import CountryModal from '@/components/Location/CountryModal';
import StateModal from '@/components/Location/StateModal';

import styles from './styles/LocationEntryForm.less';

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

  const [selectedFunctionalTypes, setSelectedFunctionalTypes] = useState<CheckboxValue[]>(
    data.functional_type_ids.map((typeId) => {
      return {
        label: '',
        value: typeId,
      };
    }),
  );
  const [functionalTypes, setFunctionalTypes] = useState<FunctionalTypeData[]>([]);

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
      functional_type_ids: selectedFunctionalTypes.reduce((newTypes, selected) => {
        if (selected.value === 'other') {
          const otherValue = (selected.label as string)?.trim() ?? '';
          if (otherValue !== '') {
            newTypes.push(otherValue);
          }
        } else {
          newTypes.push(selected.value as string);
        }
        return newTypes;
      }, [] as string[]),
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

      <FormGroup label="Functional Type" required layout="vertical" formClass={styles.formGroup}>
        <CollapseCheckboxList
          options={functionalTypes.map((functionalType) => {
            return {
              label: functionalType.name,
              value: functionalType.id,
            };
          })}
          checked={selectedFunctionalTypes}
          onChange={setSelectedFunctionalTypes}
          placeholder="select all relevance"
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
