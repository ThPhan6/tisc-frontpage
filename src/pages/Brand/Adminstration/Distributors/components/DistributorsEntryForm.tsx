import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import CityModal from '@/components/Location/CityModal';
import CountryModal from '@/components/Location/CountryModal';
import StateModal from '@/components/Location/StateModal';
import { Title } from '@/components/Typography';
import { MESSAGE_ERROR } from '@/constants/message';
import {
  emailMessageError,
  emailMessageErrorType,
  isEmptySpace,
  messageError,
  messageErrorType,
  validatePostalCode,
} from '@/helper/utils';
import { useAppSelector } from '@/reducers';
import { DistributorEntryForm, DistributorForm } from '@/types/distributor.type';
import { trimStart } from 'lodash';
import { FC, useEffect, useState } from 'react';
import styles from '../styles/DistributorsEntryForm.less';
import AuthorizedCountryModal from './AuthorizedCountryModal';
import DistributionTerritoryModal from './DistributionTerritoryModal';

const optionsGender = [
  { label: 'Male', value: true },
  { label: 'Female', value: false },
];

const optionsCoverageBeyond = [
  { label: 'Not Allow', value: true },
  { label: 'Allow', value: false },
];

type FieldName = keyof DistributorForm;

export const DistributorsEntryForm: FC<DistributorEntryForm> = (props) => {
  const { submitButtonStatus, onSubmit, onCancel, data, setData } = props;

  const [visible, setVisible] = useState({
    country: false,
    state: false,
    city: false,
    authorCountry: false,
    territory: false,
  });

  const [countryData, setCountryData] = useState({
    label: '',
    value: data.country_id,
    phoneCode: '00',
  });

  const [stateData, setStateData] = useState({ label: '', value: data.state_id });

  const [cityData, setCityData] = useState({ label: '', value: data.city_id });

  const user = useAppSelector((state) => state.user.user);

  const onChangePostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!validatePostalCode(e.target.value) || !isEmptySpace(e.target.value)) {
      return;
    }
    setData({
      ...data,
      postal_code: trimStart(e.target.value),
    });
  };

  const [authorCountryData, setAuthorCountryData] = useState<CheckboxValue[]>(
    data.authorized_countries.map((country) => {
      return {
        label: country.name,
        value: country.id,
      };
    }),
  );

  const onChangeData = (fieldName: FieldName, fieldValue: any) => {
    setData({ ...data, [fieldName]: fieldValue });
  };

  const handleOnChangeGenderAndCoverageBeyond = (radioValue: boolean, name: string) => {
    setData({ ...data, [name]: radioValue });
  };

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

  useEffect(() => {
    if (authorCountryData) {
      onChangeData(
        'authorized_country_ids',
        authorCountryData.map((item) => item.value),
      );
    }
  }, [authorCountryData]);

  const handleSubmit = () => {
    return onSubmit({
      ...data,
      brand_id: user?.brand?.id as string,
    });
  };

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
              onChange={(e) => {
                onChangeData('name', e.target.value);
              }}
              onDelete={() => onChangeData('name', '')}
              deleteIcon
              value={data.name}
              hasBoxShadow
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
              placeholder="select country"
              value={countryData.label}
              hasBoxShadow
              hasPadding
              rightIcon
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
              onRightIconClick={() =>
                setVisible({
                  city: false,
                  state: false,
                  country: true,
                  authorCountry: false,
                  territory: false,
                })
              }
            />
            <InputGroup
              label="State / Province"
              required
              fontLevel={3}
              placeholder="select state / province"
              value={stateData.label}
              hasBoxShadow
              hasPadding
              disabled={countryData.value === '-1' || countryData.value === ''}
              onRightIconClick={() =>
                setVisible({
                  city: false,
                  state: true,
                  country: false,
                  authorCountry: false,
                  territory: false,
                })
              }
              rightIcon
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
            />
            <InputGroup
              label="City / Town"
              required
              fontLevel={3}
              placeholder="select city / town"
              value={cityData.label}
              hasBoxShadow
              hasPadding
              rightIcon
              disabled={stateData.value === ''}
              onRightIconClick={() =>
                setVisible({
                  city: true,
                  state: false,
                  country: false,
                  authorCountry: false,
                  territory: false,
                })
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
                boxShadow
                placeholder="unit #, street / road name"
                onChange={(e) => onChangeData('address', e.target.value)}
                value={data.address}
              />
            </FormGroup>
            <InputGroup
              label="Postal / Zip Code"
              required
              fontLevel={3}
              placeholder="postal / zip code"
              onChange={onChangePostalCode}
              value={data.postal_code}
              hasBoxShadow
              hasPadding
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
              onDelete={() => onChangeData('postal_code', '')}
              deleteIcon
              message={messageError(data.postal_code, 10, MESSAGE_ERROR.POSTAL_CODE)}
              messageType={messageErrorType(data.postal_code, 10, 'error', 'normal')}
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
              placeholder="user first name"
              onChange={(e) => onChangeData('first_name', e.target.value)}
              value={data.first_name}
              hasBoxShadow
              hasPadding
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
              onDelete={() => onChangeData('first_name', '')}
              deleteIcon
            />
            <InputGroup
              label="Last Name"
              required
              fontLevel={3}
              placeholder="user last name"
              onChange={(e) => onChangeData('last_name', e.target.value)}
              value={data.last_name}
              hasBoxShadow
              hasPadding
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
              onDelete={() => onChangeData('last_name', '')}
              deleteIcon
            />
            <FormGroup label="Gender" required layout="vertical" formClass={styles.formGroup}>
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
              placeholder="user work email address"
              value={data.email}
              onChange={(e) => onChangeData('email', e.target.value)}
              hasBoxShadow
              hasPadding
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
              onDelete={() => onChangeData('email', '')}
              deleteIcon
              message={emailMessageError(data.email, MESSAGE_ERROR.EMAIL_UNVALID)}
              messageType={emailMessageErrorType(data.email, 'error', 'normal')}
            />
            <FormGroup label="Work Phone" required layout="vertical" formClass={styles.formGroup}>
              <PhoneInput
                phonePlaceholder="area code / number"
                onChange={(value) => onChangeData('phone', value.phoneNumber)}
                codeReadOnly
                containerClass={styles.phoneInputCustom}
                value={{
                  zoneCode: countryData.phoneCode,
                  phoneNumber: data.phone,
                }}
                deleteIcon
              />
            </FormGroup>
            <FormGroup label="Work Mobile" required layout="vertical" formClass={styles.formGroup}>
              <PhoneInput
                phonePlaceholder="mobile number"
                onChange={(value) => onChangeData('mobile', value.phoneNumber)}
                codeReadOnly
                containerClass={styles.phoneInputCustom}
                value={{
                  zoneCode: countryData.phoneCode,
                  phoneNumber: data.mobile,
                }}
                deleteIcon
              />
            </FormGroup>
          </div>
          <div className="distribution">
            <div
              className={styles.titleDistribution}
              onClick={() =>
                setVisible({
                  city: false,
                  state: false,
                  country: false,
                  authorCountry: false,
                  territory: true,
                })
              }
            >
              <Title level={8}>C - DISTIBUTION TERRITORY</Title>
              <WarningIcon />
            </div>
            <InputGroup
              label="Authorized Country"
              required
              fontLevel={3}
              name="authorizedCountry"
              placeholder="select country"
              value={authorCountryData.map((item) => item.label).join(', ')}
              hasBoxShadow
              hasPadding
              rightIcon
              hasHeight
              colorPrimaryDark
              colorRequired="tertiary"
              onRightIconClick={() =>
                setVisible({
                  city: false,
                  state: false,
                  country: false,
                  authorCountry: true,
                  territory: false,
                })
              }
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
        visible={visible.country}
        setVisible={(status) =>
          setVisible({
            city: false,
            state: false,
            country: status,
            authorCountry: false,
            territory: false,
          })
        }
        chosenValue={countryData}
        setChosenValue={setCountryData}
      />

      <StateModal
        countryId={data.country_id}
        visible={visible.state}
        setVisible={(status) =>
          setVisible({
            city: false,
            state: status,
            country: false,
            authorCountry: false,
            territory: false,
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
            authorCountry: false,
            territory: false,
          })
        }
        chosenValue={cityData}
        setChosenValue={setCityData}
      />

      <AuthorizedCountryModal
        visible={visible.authorCountry}
        setVisible={(status) =>
          setVisible({
            city: false,
            state: false,
            country: false,
            authorCountry: status,
            territory: false,
          })
        }
        chosenValue={authorCountryData}
        setChosenValue={setAuthorCountryData}
      />

      <DistributionTerritoryModal
        visible={visible.territory}
        setVisible={(status) =>
          setVisible({
            city: false,
            state: false,
            country: false,
            authorCountry: false,
            territory: status,
          })
        }
      />
    </>
  );
};
