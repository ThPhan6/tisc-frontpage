import { EntryFormWrapper } from '@/components/EntryForm';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import InputGroup from '@/components/EntryForm/InputGroup';
import CountryModal from '@/components/Location/CountryModal';
import StateModal from '@/components/Location/StateModal';
import CityModal from '@/components/Location/CityModal';
import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import type { LocationForm, FunctionalTypeData } from '@/types';
import styles from './styles/entryForm.less';
import CollapseCheckboxList from '@/components/CustomCheckbox/CollapseCheckboxList';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { getListFunctionalType } from '@/services';
import { validateEmail } from '@/helper/utils';
import { MESSAGE_ERROR } from '@/constants/message';
import { message } from 'antd';

interface ILocationEntryForm {
  submitButtonStatus: any;
  onSubmit: (data: LocationForm) => void;
  onCancel: () => void;
  data: LocationForm;
  setData: (data: LocationForm) => void;
}
type FieldName = keyof LocationForm;
const LocationEntryForm: FC<ILocationEntryForm> = (props) => {
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

  // validate email Address
  const isValidEmail = validateEmail(data.general_email);

  const onChangeData = (fieldName: FieldName, fieldValue: any) => {
    setData({
      ...data,
      [fieldName]: fieldValue,
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
    if (countryData.value !== '-1' && stateData.value !== '') {
      onChangeData('state_id', stateData.value);
    }
  }, [stateData]);

  useEffect(() => {
    if (stateData.value !== '' && cityData.value !== '') {
      onChangeData('city_id', cityData.value);
    }
  }, [cityData]);

  const handleSubmit = () => {
    if (!isValidEmail) {
      return message.error(MESSAGE_ERROR.EMAIL);
    }
    console.log('selectedFunctionalTypes', selectedFunctionalTypes);
    return onSubmit({
      ...data,
      functional_type_ids: selectedFunctionalTypes.map((selected) => {
        if (selected.value === 'other') {
          return selected.label as string;
        }

        return selected.value;
      }),
    });
  };
  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={onCancel}
      submitButtonStatus={submitButtonStatus}
    >
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
        required
        deleteIcon
        fontLevel={3}
        value={data.postal_code}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        onChange={(e) => {
          onChangeData('postal_code', e.target.value);
        }}
        onDelete={() => onChangeData('postal_code', '')}
        placeholder="postal / zip code"
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
        message={data.general_email !== '' ? (isValidEmail ? '' : MESSAGE_ERROR.EMAIL) : undefined}
        messageType={data.general_email !== '' ? (isValidEmail ? 'normal' : 'error') : undefined}
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
