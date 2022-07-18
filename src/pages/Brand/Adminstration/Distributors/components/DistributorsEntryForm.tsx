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
import AuthorizedCountryModal from './AuthorizedCountryModal';
import StateModal from './StateModal';
import CityModal from './CityModal';
import DistributionTerritoryModal from './DistributionTerritoryModal';
import { ReactComponent as SingleRightFormIconDisable } from '@/assets/icons/single-right-form-icon-disable.svg';
import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';
import { DistributorEntryForm } from '@/types/distributor.type';
import { useEffect } from 'react';
import { getCountryById } from '@/services/location.api';
import { PhoneInputValueProp } from '@/components/Form/types';
import { useAppSelector } from '@/reducers';

const optionsGender = [
  { label: 'Male', value: true },
  { label: 'Female', value: false },
];

const optionsCoverageBeyond = [
  { label: 'Not Allow', value: true },
  { label: 'Allow', value: false },
];

export const DistributorsEntryForm: FC<DistributorEntryForm> = (props) => {
  const { submitButtonStatus, onSubmit, onCancel, data, setData } = props;
  const [countryVisible, setCountryVisible] = useState(false);
  const [authorizedCountryVisible, setAuthorizedCountryVisible] = useState(false);
  const [territoryVisible, setTerritoryVisible] = useState(false);
  const [stateVisible, setStateVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const user = useAppSelector((state) => state.user);

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

  const handleOnchangeChosenValue = (chosenValue: any, modalValue: string, modalLabel: string) => {
    setData({
      ...data,
      [modalValue]: chosenValue.value,
      [modalLabel]: chosenValue.label,
    });
  };

  const handleOnchangeAuthorCountryValue = (chosenValue: any) => {
    setData({
      ...data,
      authorized_country_ids: chosenValue && chosenValue.map((item: any) => item.id),
      authorized_country_name: chosenValue.map((name: any) => name.value).toString(),
    });
  };

  const handleSubmit = () => {
    onSubmit({
      ...data,
      brand_id: user.user?.brand?.id as string,
    });
  };

  useEffect(() => {
    if (data.country_id) {
      getCountryById(data.country_id).then((res) => {
        if (res) {
          setData({
            ...data,
            phone_code: res.phone_code,
          });
        }
      });
    }
  }, [data.country_id]);

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
              value={data.country_name}
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
              value={data.state_name}
              borderBottomColor="mono-medium"
              hasPadding
              rightIcon={
                data.country_id ? (
                  <SingleRightFormIcon onClick={() => setStateVisible(true)} />
                ) : (
                  <SingleRightFormIconDisable style={{ cursor: 'not-allowed' }} />
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
              value={data.city_name}
              borderBottomColor="mono-medium"
              hasPadding
              rightIcon={
                data.country_id && data.state_id ? (
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
              value={data.email}
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
                codeReadOnly
                value={
                  {
                    zoneCode: data.phone_code,
                    phoneNumber: data.phone,
                  } as PhoneInputValueProp
                }
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
                codeReadOnly
                value={
                  {
                    zoneCode: data.phone_code,
                    phoneNumber: data.mobile,
                  } as PhoneInputValueProp
                }
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
              value={data.authorized_country_name}
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
        chosenValue={{ label: data.country_name, value: data.country_id }}
        setChosenValue={(chosenValue) =>
          handleOnchangeChosenValue(chosenValue, 'country_id', 'country_name')
        }
      />

      <StateModal
        countryId={data.country_id}
        visible={stateVisible}
        setVisible={setStateVisible}
        chosenValue={{ label: data.state_name, value: data.state_id }}
        setChosenValue={(chosenValue) =>
          handleOnchangeChosenValue(chosenValue, 'state_id', 'state_name')
        }
      />

      <CityModal
        stateId={data.state_id}
        countryId={data.country_id}
        visible={cityVisible}
        setVisible={setCityVisible}
        chosenValue={{ label: data.city_name, value: data.city_id }}
        setChosenValue={(chosenValue) =>
          handleOnchangeChosenValue(chosenValue, 'city_id', 'city_name')
        }
      />

      <AuthorizedCountryModal
        visible={authorizedCountryVisible}
        setVisible={setAuthorizedCountryVisible}
        chosenValue={data.authorized_countries}
        setChosenValue={(chosenValue) => handleOnchangeAuthorCountryValue(chosenValue)}
      />

      <DistributionTerritoryModal visible={territoryVisible} setVisible={setTerritoryVisible} />
    </>
  );
};
