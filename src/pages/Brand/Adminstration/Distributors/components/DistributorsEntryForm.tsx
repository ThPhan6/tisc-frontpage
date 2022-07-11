import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import InputGroup from '@/components/EntryForm/InputGroup';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { Title } from '@/components/Typography';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import styles from '../styles/DistributorsEntryForm.less';
import { useState } from 'react';
import { DistributorsProp, distributorsValueProp } from '../types';
import CountryModal from './CountryModal';
import { RadioValue } from '@/components/CustomRadio/types';
import AuthorizedCountryModal from './AuthorizedCountryModal';
import StateModal from './StateModal';
import CityModal from './CityModal';
import DistributionTerritoryModal from './DistributionTerritoryModal';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { ReactComponent as SingleRightFormIconDisable } from '@/assets/icons/single-right-form-icon-disable.svg';
import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';

const optionsGender = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const optionsCoverageBeyond = [
  { label: 'Not Allow', value: 'Not Allow' },
  { label: 'Allow', value: 'Allow' },
];

export const DistributorsEntryForm = () => {
  const [distributorsValue, setDistributorsValue] =
    useState<DistributorsProp>(distributorsValueProp);
  const [countryVisible, setCountryVisible] = useState(false);
  const [countryValue, setCountryValue] = useState<RadioValue>({ value: '', label: '' });
  const [authorizedCountryVisible, setAuthorizedCountryVisible] = useState(false);
  const [territoryVisible, setTerritoryVisible] = useState(false);
  const [stateVisible, setStateVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [stateValue, setStateValue] = useState<RadioValue>({ value: '', label: '' });
  const [cityValue, setCityValue] = useState<RadioValue>();
  const [authorCountryValue, setAuthorCountryValue] = useState<CheckboxValue[]>();

  const handleOnChangeValueForm = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => {
    setDistributorsValue({ ...distributorsValue, [e.target.name]: e.target.value });
  };

  const handleOnChangeGenderAndCoverageBeyond = (radioValue: string, name: string) => {
    setDistributorsValue({ ...distributorsValue, [name]: radioValue });
  };

  const handleOnChangePhoneAndMobile = (phoneInputValue: object, name: string) => {
    setDistributorsValue({
      ...distributorsValue,
      [name]: phoneInputValue['phoneNumber'],
    });
  };

  return (
    <>
      <EntryFormWrapper>
        <div className="form">
          <div className="company information">
            <div className={styles.title}>
              <Title level={8}>A - COMPANY INFORMATION</Title>
            </div>
            <InputGroup
              label="Distributor Name"
              required
              fontLevel={3}
              onChange={handleOnChangeValueForm}
              value={distributorsValue.distributorName}
              name="distributorName"
              borderBottomColor="mono-medium"
              placeholder="authorized distributor company name"
              hasHeight
              hasPadding
              colorPrimaryDark
              colorRequired="tertiary"
            />
            <InputGroup
              label="Country"
              required
              fontLevel={3}
              name="country"
              placeholder="select country"
              value={(countryValue?.label as string) ?? ''}
              borderBottomColor="mono-medium"
              hasPadding
              rightIcon
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
              onRightIconClick={() => setCountryVisible(true)}
            />
            <InputGroup
              label="State / Province"
              required
              fontLevel={3}
              name="province"
              placeholder="select state / province"
              value={(stateValue?.label as string) ?? ''}
              borderBottomColor="mono-medium"
              hasPadding
              rightIcon={
                countryValue.value === '' ? (
                  <SingleRightFormIconDisable style={{ cursor: 'not-allowed' }} />
                ) : (
                  <SingleRightFormIcon onClick={() => setStateVisible(true)} />
                )
              }
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
            />
            <InputGroup
              label="City / Town"
              required
              fontLevel={3}
              name="city"
              placeholder="select city / town"
              value={(cityValue?.label as string) ?? ''}
              borderBottomColor="mono-medium"
              hasPadding
              rightIcon={
                countryValue.value !== '' && stateValue.value !== '' ? (
                  <SingleRightFormIcon onClick={() => setCityVisible(true)} />
                ) : (
                  <SingleRightFormIconDisable style={{ cursor: 'not-allowed' }} />
                )
              }
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
            />
            <FormGroup
              label="Address"
              required
              layout="vertical"
              formClass={styles.customShowCount}
            >
              <CustomTextArea
                maxLength={120}
                showCount
                borderBottomColor="mono-medium"
                placeholder="unit #, street / road name"
                name="address"
                onChange={handleOnChangeValueForm}
                value={distributorsValue.address}
              />
            </FormGroup>
            <InputGroup
              label="Postal / Zip Code"
              required
              fontLevel={3}
              type="number"
              name="zipCode"
              placeholder="postal / zip code"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.zipCode}
              borderBottomColor="mono-medium"
              hasPadding
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
            />
          </div>
          <div className="contact person">
            <div className={styles.title}>
              <Title level={8}>B - CONTACT PERSON</Title>
            </div>
            <InputGroup
              label="First Name"
              required
              fontLevel={3}
              name="firstName"
              placeholder="user first name"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.firstName}
              borderBottomColor="mono-medium"
              hasPadding
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
            />
            <InputGroup
              label="Last Name"
              required
              fontLevel={3}
              name="lastName"
              placeholder="user last name"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.lastName}
              borderBottomColor="mono-medium"
              hasPadding
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
            />
            <FormGroup
              label="Gender"
              required
              layout="vertical"
              formClass={styles.customMarginBottom}
            >
              <CustomRadio
                options={optionsGender}
                value={distributorsValue.gender}
                onChange={(radioValue) =>
                  handleOnChangeGenderAndCoverageBeyond(radioValue.value, 'gender')
                }
              />
            </FormGroup>
            <InputGroup
              label="Work Email"
              required
              fontLevel={3}
              name="email"
              placeholder="user work email address"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.email}
              borderBottomColor="mono-medium"
              hasPadding
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
            />
            <FormGroup
              label="Work Phone"
              required
              layout="vertical"
              formClass={styles.customMarginBottom}
            >
              <PhoneInput
                phonePlaceholder="area code / number"
                onChange={(value) => handleOnChangePhoneAndMobile(value, 'phone')}
                colorPlaceholder="mono"
              />
            </FormGroup>
            <FormGroup
              label="Work Mobile"
              required
              layout="vertical"
              formClass={styles.customMarginBottom}
            >
              <PhoneInput
                phonePlaceholder="mobile number"
                onChange={(value) => handleOnChangePhoneAndMobile(value, 'mobile')}
                colorPlaceholder="mono"
              />
            </FormGroup>
          </div>
          <div className="distribution">
            <div className={styles.titleDistribution} onClick={() => setTerritoryVisible(true)}>
              <Title level={8}>C - DISTIBUTION TERRITORY</Title>
              <WarningIcon />
            </div>
            <InputGroup
              label="Authorized Country"
              required
              fontLevel={3}
              name="authorizedCountry"
              placeholder="select country"
              value={authorCountryValue?.map((item) => item.value as string) ?? ''}
              borderBottomColor="mono-medium"
              hasPadding
              rightIcon
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
              onRightIconClick={() => setAuthorizedCountryVisible(true)}
            />
            <FormGroup label="Coverage Beyond" required layout="vertical">
              <CustomRadio
                options={optionsCoverageBeyond}
                value={distributorsValue.coverageBeyond}
                onChange={(radioValue) =>
                  handleOnChangeGenderAndCoverageBeyond(radioValue.value, 'coverageBeyond')
                }
              />
            </FormGroup>
          </div>
        </div>
      </EntryFormWrapper>

      <CountryModal
        visible={countryVisible}
        setVisible={setCountryVisible}
        chosenValue={countryValue}
        setChosenValue={setCountryValue}
      />
      <StateModal
        countryId={countryValue.value}
        visible={stateVisible}
        setVisible={setStateVisible}
        chosenValue={stateValue}
        setChosenValue={setStateValue}
      />
      <CityModal
        stateId={stateValue.value}
        countryId={countryValue.value}
        visible={cityVisible}
        setVisible={setCityVisible}
        chosenValue={cityValue}
        setChosenValue={setCityValue}
      />
      <AuthorizedCountryModal
        visible={authorizedCountryVisible}
        setVisible={setAuthorizedCountryVisible}
        chosenValue={authorCountryValue}
        setChosenValue={setAuthorCountryValue}
      />
      <DistributionTerritoryModal visible={territoryVisible} setVisible={setTerritoryVisible} />
    </>
  );
};
