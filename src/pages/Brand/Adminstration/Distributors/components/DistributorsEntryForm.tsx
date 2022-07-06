import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { Title } from '@/components/Typography';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/pagination-right.svg';
import styles from '../styles/DistributorsEntryForm.less';
import { useState } from 'react';
import { DistributorsProp, distributorsValueProp } from '../types';

export type typeRadio = 'gender' | 'coverageBeyond';
export type typePhoneInput = 'phone' | 'mobile';

export const DistributorsEntryForm = () => {
  const [distributorsValue, setDistributorsValue] =
    useState<DistributorsProp>(distributorsValueProp);
  const optionsGender = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];
  const optionsCoverageBeyond = [
    { label: 'Not Allow', value: 'not allow' },
    { label: 'Allow', value: 'allow' },
  ];

  const handleOnChangeValueForm = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => {
    setDistributorsValue({ ...distributorsValue, [e.target.name]: e.target.value });
  };

  const handleOnChangeValueRadio = (value: string, typeRadio: typeRadio) => {
    setDistributorsValue({ ...distributorsValue, [typeRadio]: value });
  };

  const handleOnChangeValuePhoneInput = (value: object, typePhoneInput: typePhoneInput) => {
    setDistributorsValue({ ...distributorsValue, [typePhoneInput]: value['phoneNumber'] });
  };

  return (
    <EntryFormWrapper>
      <div className="form">
        <div className="company information">
          <div className={styles.title}>
            <Title level={8}>A - COMPANY INFORMATION</Title>
          </div>
          <FormGroup
            label="Distributor Name"
            required
            layout="vertical"
            formClass={styles.customMarginBottom}
          >
            <CustomInput
              placeholder="authorized distributor company name"
              borderBottomColor="mono-medium"
              type="text"
              name="distributorName"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.distributorName}
            />
          </FormGroup>
          <FormGroup
            label="Country"
            required
            layout="vertical"
            formClass={styles.customMarginBottom}
          >
            <CustomInput
              placeholder="select country"
              borderBottomColor="mono-medium"
              suffix={<ActionRightIcon />}
              type="text"
              name="country"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.country}
            />
          </FormGroup>
          <FormGroup
            label="State / Province"
            required
            layout="vertical"
            formClass={styles.customMarginBottom}
          >
            <CustomInput
              placeholder="select state / province"
              borderBottomColor="mono-medium"
              suffix={<ActionRightIcon />}
              type="text"
              name="province"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.province}
            />
          </FormGroup>
          <FormGroup
            label="City / Town"
            required
            layout="vertical"
            formClass={styles.customMarginBottom}
          >
            <CustomInput
              placeholder="select city / town"
              borderBottomColor="mono-medium"
              suffix={<ActionRightIcon />}
              type="text"
              name="city"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.city}
            />
          </FormGroup>
          <FormGroup label="Address" required layout="vertical" formClass={styles.customShowCount}>
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
          <FormGroup
            label="Postal / Zip Code"
            required
            layout="vertical"
            formClass={styles.customMarginBottom}
          >
            <CustomInput
              placeholder="postal / zip code"
              borderBottomColor="mono-medium"
              type="number"
              name="zipCode"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.zipCode}
            />
          </FormGroup>
        </div>
        <div className="contact person">
          <div className={styles.title}>
            <Title level={8}>B - CONTACT PERSON</Title>
          </div>
          <FormGroup
            label="First Name"
            required
            layout="vertical"
            formClass={styles.customMarginBottom}
          >
            <CustomInput
              placeholder="user first name"
              borderBottomColor="mono-medium"
              type="text"
              name="firstName"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.firstName}
            />
          </FormGroup>
          <FormGroup
            label="Last Name"
            required
            layout="vertical"
            formClass={styles.customMarginBottom}
          >
            <CustomInput
              placeholder="user last name"
              borderBottomColor="mono-medium"
              type="text"
              name="lastName"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.lastName}
            />
          </FormGroup>
          <FormGroup
            label="Gender"
            required
            layout="vertical"
            formClass={styles.customMarginBottom}
          >
            <CustomRadio
              options={optionsGender}
              value={distributorsValue.gender}
              onChange={(RadioValue) => handleOnChangeValueRadio(RadioValue.value, 'gender')}
            />
          </FormGroup>
          <FormGroup label="Work Email" required layout="vertical" formClass={styles.customEmail}>
            <CustomInput
              placeholder="user work email address"
              borderBottomColor="mono-medium"
              type="email"
              name="email"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.email}
            />
          </FormGroup>
          <FormGroup
            label="Work Phone"
            required
            layout="vertical"
            formClass={styles.customMarginBottom}
          >
            <PhoneInput
              phonePlaceholder="area code / number"
              onChange={(value) => handleOnChangeValuePhoneInput(value, 'phone')}
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
              onChange={(value) => handleOnChangeValuePhoneInput(value, 'mobile')}
            />
          </FormGroup>
        </div>
        <div className="distribution">
          <div className={styles.titleDistribution}>
            <Title level={8}>C - DISTIBUTION TERRITORY</Title>
            <WarningIcon />
          </div>
          <FormGroup
            label="Authorized Country"
            required
            layout="vertical"
            formClass={styles.customMarginBottom}
          >
            <CustomInput
              placeholder="select country"
              borderBottomColor="mono-medium"
              suffix={<ActionRightIcon />}
              type="text"
              name="authorizedCountry"
              onChange={handleOnChangeValueForm}
              value={distributorsValue.authorizedCountry}
            />
          </FormGroup>
          <FormGroup label="Coverage Beyond" required layout="vertical">
            <CustomRadio
              options={optionsCoverageBeyond}
              value={distributorsValue.coverageBeyond}
              onChange={(RadioValue) =>
                handleOnChangeValueRadio(RadioValue.value, 'coverageBeyond')
              }
            />
          </FormGroup>
        </div>
      </div>
    </EntryFormWrapper>
  );
};
