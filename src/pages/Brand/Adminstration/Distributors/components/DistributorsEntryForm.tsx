import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import InputGroup from '@/components/EntryForm/InputGroup';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { Title } from '@/components/Typography';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import styles from '../styles/DistributorsEntryForm.less';
import { FC, useState } from 'react';
import CountryModal from './CountryModal';
import { RadioValue } from '@/components/CustomRadio/types';
import AuthorizedCountryModal from './AuthorizedCountryModal';
import StateModal from './StateModal';
import CityModal from './CityModal';
import DistributionTerritoryModal from './DistributionTerritoryModal';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { ReactComponent as SingleRightFormIconDisable } from '@/assets/icons/single-right-form-icon-disable.svg';
import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';
import { ICountryDetail, IDistributorEntryForm } from '@/types/distributor.type';
import { useEffect } from 'react';
import { getCountryById } from '@/services/location.api';

const optionsGender = [
  { label: 'Male', value: true },
  { label: 'Female', value: false },
];

const optionsCoverageBeyond = [
  { label: 'Not Allow', value: true },
  { label: 'Allow', value: false },
];

const DEFAULT_COUNTRY_DETAIL: ICountryDetail = {
  id: '',
  name: '',
  iso3: '',
  iso2: '',
  numeric_code: '',
  phone_code: '00',
  capital: '',
  currency: '',
  currency_name: '',
  currency_symbol: '',
  tld: '',
  native: '',
  region: '',
  subregion: '',
  timezones: '',
  latitude: 0,
  longitude: 0,
  emoji: '',
  emojiU: '',
};
export const DistributorsEntryForm: FC<IDistributorEntryForm> = (props) => {
  const { submitButtonStatus, onSubmit, onCancel, data, setData } = props;
  const [countryVisible, setCountryVisible] = useState(false);
  const [countryValue, setCountryValue] = useState<RadioValue>({ value: '', label: '' });
  const [authorizedCountryVisible, setAuthorizedCountryVisible] = useState(false);
  const [territoryVisible, setTerritoryVisible] = useState(false);
  const [stateVisible, setStateVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [stateValue, setStateValue] = useState<RadioValue>({ value: '', label: '' });
  const [cityValue, setCityValue] = useState<RadioValue>();
  const [authorCountryValue, setAuthorCountryValue] = useState<CheckboxValue[]>();
  const [countryValueDetail, setCountryValueDetail] =
    useState<ICountryDetail>(DEFAULT_COUNTRY_DETAIL);

  const handleOnChangeValueForm = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleOnChangeGenderAndCoverageBeyond = (radioValue: boolean, name: string) => {
    setData({ ...data, [name]: radioValue });
  };

  const handleOnChangePhoneAndMobile = (phoneInputValue: object, name: string) => {
    setData({
      ...data,
      [name]: phoneInputValue['phoneNumber'],
    });
  };

  const handleSubmit = () => {
    onSubmit({
      ...data,
      country_id: countryValue.value as string,
      state_id: stateValue.value as string,
      city_id: cityValue?.value as string,
      // authorized_country_ids: authorCountryValue?.map((item) => item.id) as string[],
      authorized_country_ids: ['4'],
      brand_id: '54bbfa0d-5fda-413b-81a9-1332081e2739',
    });
  };

  useEffect(() => {
    if (countryValue.value !== '') {
      getCountryById(countryValue.value as string).then(setCountryValueDetail);
    }
  }, [countryValue.value !== '']);

  console.log(countryValueDetail);
  return (
    <>
      <EntryFormWrapper
        handleSubmit={handleSubmit}
        handleCancel={onCancel}
        submitButtonStatus={submitButtonStatus}
      >
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
              value={data.name}
              name="name"
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
                value={data.address}
              />
            </FormGroup>
            <InputGroup
              label="Postal / Zip Code"
              required
              fontLevel={3}
              type="number"
              name="postal_code"
              placeholder="postal / zip code"
              onChange={handleOnChangeValueForm}
              value={data.postal_code}
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
              name="first_name"
              placeholder="user first name"
              onChange={handleOnChangeValueForm}
              value={data.first_name}
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
              name="last_name"
              placeholder="user last name"
              onChange={handleOnChangeValueForm}
              value={data.last_name}
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
                value={data.gender}
                onChange={(radioValue) =>
                  handleOnChangeGenderAndCoverageBeyond(radioValue.value as boolean, 'gender')
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
                codePlaceholder={countryValueDetail.phone_code}
                codeReadOnly
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
                codePlaceholder={countryValueDetail.phone_code}
                codeReadOnly
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
                value={data.coverage_beyond}
                onChange={(radioValue) =>
                  handleOnChangeGenderAndCoverageBeyond(
                    radioValue.value as boolean,
                    'coverage_beyond',
                  )
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
        countryId={countryValue.value as string}
        visible={stateVisible}
        setVisible={setStateVisible}
        chosenValue={stateValue}
        setChosenValue={setStateValue}
      />
      <CityModal
        stateId={stateValue.value as string}
        countryId={countryValue.value as string}
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
