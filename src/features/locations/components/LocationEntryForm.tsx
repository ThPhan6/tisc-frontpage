import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { message } from 'antd';

import { useCheckPermission } from '@/helper/hook';
import {
  getEmailMessageError,
  getEmailMessageErrorType,
  isEmptySpace,
  messageError,
  messageErrorType,
  validatePostalCode,
} from '@/helper/utils';
import { isEqual, trimStart } from 'lodash';

import { LocationForm } from '../type';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { RadioValue } from '@/components/CustomRadio/types';

import CollapseCheckboxList from '@/components/CustomCheckbox/CollapseCheckboxList';
import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import CityModal from '@/features/locations/components/CityModal';
import CountryModal from '@/features/locations/components/CountryModal';
import StateModal from '@/features/locations/components/StateModal';

import styles from './LocationEntryForm.less';

interface LocationEntryFormProps {
  onSubmit: (data: LocationForm) => void;
  onCancel: () => void;
  data: LocationForm;
  setData: (data: LocationForm) => void;
  isSubmitted: boolean;
  functionalTypeData: CheckboxValue[] | RadioValue[];
  selectedFunctionType: CheckboxValue[];
}

type FieldName = keyof LocationForm;
const LocationEntryForm: FC<LocationEntryFormProps> = (props) => {
  const {
    isSubmitted,
    onSubmit,
    onCancel,
    data,
    setData,
    functionalTypeData,
    selectedFunctionType,
  } = props;
  // for content type modal
  const [visible, setVisible] = useState<'' | 'country' | 'state' | 'city'>('');

  const isDesignAdmin = useCheckPermission('Design Admin');

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

  /// for item selected
  const [curSelectFuncType, setCurSelectFuncType] = useState<CheckboxValue[]>([]);
  /// for show on placeholder
  const onShowPlaceholder =
    /// current select
    curSelectFuncType.map((el) => el.label).join(', ') ||
    /// has been selected
    selectedFunctionType.map((el) => el.label).join(', ') ||
    'select all relevance';

  useEffect(() => {
    if (!isEqual(selectedFunctionType, curSelectFuncType) && curSelectFuncType.length) {
      setCurSelectFuncType(selectedFunctionType);
    }
  }, [isSubmitted === true]);

  console.log();

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

  const handleCloseModal = (isClose: boolean) => (isClose ? undefined : setVisible(''));

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

  const setStylesForFunctionType = () => {
    if (isDesignAdmin) {
      return styles.borderBottom;
    }
    return selectedFunctionType.length || curSelectFuncType.length ? styles.activeFunctionType : '';
  };

  const getFunctionalTypes = () => {
    if (isDesignAdmin) {
      return data.functional_type_ids;
    }

    return curSelectFuncType.length
      ? curSelectFuncType.map((el) => String(el.value === 'other' ? el.label : el.value))
      : selectedFunctionType.map((el) => String(el.value));
  };

  const handleSubmit = () => {
    /// check email
    const invalidEmail = getEmailMessageError(data.general_email, MESSAGE_ERROR.EMAIL_INVALID);
    if (invalidEmail) {
      message.error(invalidEmail);
      return;
    }

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
      functional_type_ids: getFunctionalTypes(),
    });
  };

  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={onCancel}
      submitButtonStatus={isSubmitted}>
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
        placeholder={
          isDesignAdmin
            ? 'e.g. office name + country/city name'
            : 'registered business / company name'
        }
      />

      {isDesignAdmin ? null : (
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
      )}

      <FormGroup
        label="Functional Type"
        required
        layout="vertical"
        formClass={`${styles.formGroup} ${setStylesForFunctionType()}`}>
        {isDesignAdmin ? (
          <CustomRadio
            options={functionalTypeData as RadioValue[]}
            value={data.functional_type_ids[0] ?? functionalTypeData[0]?.value}
            onChange={(radioValue) => {
              setData({
                ...data,
                functional_type_ids: [String(radioValue.value)],
              });
            }}
          />
        ) : (
          <CollapseCheckboxList
            options={functionalTypeData as CheckboxValue[]}
            placeholder={onShowPlaceholder}
            otherInput
            clearOtherInput={isSubmitted}
            checked={curSelectFuncType.length ? curSelectFuncType : selectedFunctionType}
            onChange={(checkedItem) => {
              // to show on placeholer and handle submit
              setCurSelectFuncType(checkedItem);

              setData({
                ...data,
                functional_type_ids: checkedItem?.map((opt) =>
                  String(opt.value === 'other' ? opt.label : opt.value),
                ),
              });
            }}
          />
        )}
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
        onRightIconClick={() => setVisible('country')}
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
        onRightIconClick={() => setVisible('state')}
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
        onRightIconClick={() => setVisible('city')}
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
        message={messageError(data.postal_code, MESSAGE_ERROR.POSTAL_CODE, 10)}
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
        message={getEmailMessageError(data.general_email, MESSAGE_ERROR.EMAIL_INVALID)}
        messageType={getEmailMessageErrorType(data.general_email, 'error', 'normal')}
      />
      <CountryModal
        visible={visible === 'country'}
        setVisible={handleCloseModal}
        chosenValue={countryData}
        setChosenValue={setCountryData}
        withPhoneCode
        hasGlobal={false}
      />
      <StateModal
        countryId={data.country_id}
        visible={visible === 'state'}
        setVisible={handleCloseModal}
        chosenValue={stateData}
        setChosenValue={setStateData}
      />

      <CityModal
        stateId={data.state_id}
        countryId={data.country_id}
        visible={visible === 'city'}
        setVisible={handleCloseModal}
        chosenValue={cityData}
        setChosenValue={setCityData}
      />
    </EntryFormWrapper>
  );
};

export default LocationEntryForm;
