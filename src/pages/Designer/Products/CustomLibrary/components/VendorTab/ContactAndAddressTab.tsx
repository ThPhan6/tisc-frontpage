import { FC, useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';

import {
  getEmailMessageError,
  getEmailMessageErrorType,
  isEmptySpace,
  messageError,
  messageErrorType,
  validatePostalCode,
} from '@/helper/utils';
import { trimStart } from 'lodash';

import { ContactAddressProps, CustomLibraryContact } from '../../types';

import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import CityModal from '@/features/locations/components/CityModal';
import CountryModal from '@/features/locations/components/CountryModal';
import StateModal from '@/features/locations/components/StateModal';

import { CompanyModal } from '../Modal/CompanyModal';
import '../index.less';
import styles from './index.less';

const DEFAULT_CONTACT: CustomLibraryContact = {
  id: '',
  firstname: '',
  lastname: '',
  position: '',
  work_email: '',
  phone_code: '',
  phone_number: '',
  mobile_code: '',
  mobile_number: '',
};

type FieldName = keyof ContactAddressProps | keyof CustomLibraryContact;

interface ContactAndAddressTabProps {
  activeKey: 'brand' | 'distributor';
  data: ContactAddressProps;
  setData: (data: ContactAddressProps) => void;
}

export const ContactAndAddressTab: FC<ContactAndAddressTabProps> = ({
  activeKey,
  data,
  setData,
}) => {
  const [visible, setVisible] = useState<'' | 'company' | 'country' | 'state' | 'city'>('');

  const [companyData, setCompanyData] = useState({
    label: '',
    value: data.company_id,
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

  const onChangeData = (fieldName: FieldName, fieldValue: any) => {
    setData({
      ...data,
      [fieldName]: trimStart(fieldValue),
    });
  };

  useEffect(() => {
    onChangeData('company_id', companyData.value);
  }, [companyData]);
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

  const handleAddContact = () => {
    // setData((prevState) => ({
    //   ...prevState,
    //   contacts: [...prevState.contacts, DEFAULT_CONTACT],
    // }));

    setData({ ...data, contacts: [...data.contacts, DEFAULT_CONTACT] });
  };

  const renderAddContact = (userContact: CustomLibraryContact[]) => {
    if (!userContact.length) return null;

    return userContact.map((user) => (
      <div className="bg-light">
        <div className="mb-8">
          <div className="p-16">
            {/* First Name */}
            <InputGroup
              label="First Name"
              deleteIcon
              fontLevel={3}
              value={user.firstname}
              hasPadding
              colorPrimaryDark
              hasBoxShadow
              hasHeight
              onChange={(e) => {
                onChangeData('firstname', e.target.value);
              }}
              onDelete={() => onChangeData('firstname', '')}
              placeholder="member first name"
            />
            {/* Last name */}
            <InputGroup
              label="Last Name"
              deleteIcon
              fontLevel={3}
              value={user.lastname}
              hasPadding
              colorPrimaryDark
              hasBoxShadow
              hasHeight
              onChange={(e) => {
                onChangeData('lastname', e.target.value);
              }}
              onDelete={() => onChangeData('lastname', '')}
              placeholder="member last name"
            />
            {/* Position / Role */}
            <InputGroup
              label="Position / Role"
              deleteIcon
              fontLevel={3}
              value={user.position}
              hasPadding
              colorPrimaryDark
              hasBoxShadow
              hasHeight
              onChange={(e) => {
                onChangeData('position', e.target.value);
              }}
              onDelete={() => onChangeData('position', '')}
              placeholder="member position/role"
            />

            {/* Work Email */}
            <InputGroup
              label="Work Email"
              deleteIcon
              fontLevel={3}
              value={user.work_email}
              hasPadding
              colorPrimaryDark
              hasBoxShadow
              hasHeight
              onChange={(e) => {
                onChangeData('work_email', e.target.value);
              }}
              onDelete={() => onChangeData('work_email', '')}
              placeholder="user work email"
              message={getEmailMessageError(user.work_email, MESSAGE_ERROR.EMAIL_INVALID)}
              messageType={getEmailMessageErrorType(user.work_email, 'error', 'normal')}
            />

            {/* Work Phone */}
            <FormGroup label="Work Phone" layout="vertical">
              <PhoneInput
                phonePlaceholder="area code / number"
                onChange={(value) => {
                  onChangeData('phone_number', value.phoneNumber);
                }}
                colorPlaceholder="mono"
                containerClass={styles.phoneInputCustom}
                codeReadOnly
                value={{
                  zoneCode: countryData.phoneCode,
                  phoneNumber: user.phone_number,
                }}
                deleteIcon
              />
            </FormGroup>
            {/* Work Mobile */}
            <FormGroup label="Work Mobile" layout="vertical">
              <PhoneInput
                phonePlaceholder="mobile number"
                onChange={(value) => {
                  onChangeData('mobile_number', value.phoneNumber);
                }}
                colorPlaceholder="mono"
                containerClass={styles.phoneInputCustom}
                codeReadOnly
                value={{
                  zoneCode: countryData.phoneCode,
                  phoneNumber: user.mobile_number,
                }}
                deleteIcon
              />
            </FormGroup>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="bg-light">
        <div className="p-16">
          <InputGroup
            label={`${activeKey === 'brand' ? 'Brand' : 'Distributor'} Company Name`}
            fontLevel={3}
            value={companyData.label}
            hasPadding
            colorPrimaryDark
            hasBoxShadow
            hasHeight
            rightIcon
            onRightIconClick={() => setVisible('company')}
            placeholder="select from existing list"
          />
          <InputGroup
            label="Website"
            fontLevel={3}
            value={cityData.label}
            hasPadding
            colorPrimaryDark
            hasBoxShadow
            hasHeight
            placeholder="copy & past the URL link"
          />
          <InputGroup
            label="Country"
            fontLevel={3}
            value={countryData.label}
            hasPadding
            colorPrimaryDark
            hasBoxShadow
            hasHeight
            rightIcon
            onRightIconClick={() => setVisible('country')}
            placeholder="country list"
          />
          <InputGroup
            label="State / Province"
            fontLevel={3}
            value={stateData.label}
            hasPadding
            colorPrimaryDark
            hasBoxShadow
            hasHeight
            rightIcon
            disabled={countryData.value === '-1' || countryData.value === ''}
            onRightIconClick={() => setVisible('state')}
            placeholder="select from list"
          />
          <InputGroup
            label="City / Town"
            fontLevel={3}
            value={cityData.label}
            hasPadding
            colorPrimaryDark
            hasBoxShadow
            hasHeight
            rightIcon
            disabled={stateData.value === ''}
            onRightIconClick={() => setVisible('city')}
            placeholder="select from list"
          />

          <FormGroup label="Address" layout="vertical">
            <CustomTextArea
              className={styles.address}
              maxLength={100}
              showCount
              placeholder="type here"
              borderBottomColor="mono-medium"
              onChange={(e) => onChangeData('address', e.target.value)}
              value={data.address}
              boxShadow
            />
          </FormGroup>
          <InputGroup
            label="Postal / Zip Code"
            placeholder="postal / zip code"
            deleteIcon
            fontLevel={3}
            value={data.postal_code}
            hasPadding
            colorPrimaryDark
            hasBoxShadow
            onChange={(e) => {
              onChangePostalCode(e);
            }}
            onDelete={() => onChangeData('postal_code', '')}
            message={messageError(data.postal_code, MESSAGE_ERROR.POSTAL_CODE, 10)}
            messageType={messageErrorType(data.postal_code, 10, 'error', 'normal')}
          />
        </div>
      </div>

      <CustomPlusButton size={18} label="Add Contact" onClick={handleAddContact} />

      {renderAddContact(data.contacts)}

      <CompanyModal
        companyId={data.company_id}
        visible={visible === 'company'}
        setVisible={handleCloseModal}
        setChosenValue={setCompanyData}
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
    </>
  );
};
