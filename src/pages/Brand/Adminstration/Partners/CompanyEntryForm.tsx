import { useState } from 'react';

import { validateRequiredFields } from '@/helper/utils';

import { CompanyForm } from '@/types';

import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { Title } from '@/components/Typography';

const coverageBeyondOptions = [
  { label: 'Not Allow', value: '0' },
  { label: 'Allow', value: '1' },
];

interface CompanyEntryFormProps {
  data: CompanyForm;
  onClose: () => void;
  setData: React.Dispatch<React.SetStateAction<CompanyForm>>;
}

const CompanyEntryForm = ({ data, onClose, setData }: CompanyEntryFormProps) => {
  const [countryData, setCountryData] = useState({
    label: '',
    value: '',
    phoneCode: '00',
  });

  const getRequiredFields = (): { field: keyof CompanyForm; messageField: string }[] => [
    { field: 'name', messageField: 'Company name is required' },
    { field: 'country', messageField: 'Country is required' },
    { field: 'province', messageField: 'Province / State is required' },
    { field: 'city', messageField: 'City is required' },
    { field: 'address', messageField: 'Address is required' },
    { field: 'postal_code', messageField: 'Postal / Zip Code is required' },
    { field: 'phone', messageField: 'Phone number is required' },
    { field: 'email', messageField: 'Email is required' },
    { field: 'affiliation', messageField: 'Affiliation is required' },
    { field: 'relation', messageField: 'Relation is required' },
    { field: 'acquisition', messageField: 'Acquisition is required' },
    { field: 'price_rate', messageField: 'Price rate is required' },
    { field: 'authorised_country', messageField: 'Authorised country is required' },
    { field: 'beyond', messageField: 'Coverage beyond is required' },
  ];

  const handleOnChange = <K extends keyof CompanyForm>(fieldName: K, fieldValue: CompanyForm[K]) =>
    setData({
      ...data,
      [fieldName]: fieldValue,
    });

  const handleSubmit = () => {
    const requiredFields = getRequiredFields();
    if (!validateRequiredFields(data, requiredFields)) return;
  };

  return (
    <EntryFormWrapper
      customClass="max-h-708 max-w-572"
      handleCancel={onClose}
      handleSubmit={handleSubmit}
    >
      <Title level={8} customClass="py-10 mb-16 bottom-border-inset-black">
        COMPANY PROFILE
      </Title>
      <InputGroup
        label="Name"
        required
        fontLevel={3}
        hasPadding
        hasBoxShadow
        hasHeight
        value={data.name}
        placeholder="channel partner company name"
        onChange={(event) => handleOnChange('name', event.target.value)}
      />
      <InputGroup
        label="Website"
        fontLevel={3}
        hasPadding
        hasHeight
        hasBoxShadow
        value={data.website}
        placeholder="paste site URL link here"
        onChange={(event) => handleOnChange('website', event.target.value)}
      />
      <InputGroup
        label="Country"
        required
        fontLevel={3}
        hasPadding
        hasHeight
        hasBoxShadow
        rightIcon
        value={data.country}
        placeholder="select country"
        onChange={(event) => handleOnChange('country', event.target.value)}
      />
      <InputGroup
        label="State / Province"
        required
        fontLevel={3}
        hasPadding
        hasHeight
        hasBoxShadow
        rightIcon
        value={data.province}
        placeholder="select state / province"
        onChange={(event) => handleOnChange('province', event.target.value)}
      />
      <InputGroup
        label="City / Town"
        required
        fontLevel={3}
        hasHeight
        hasPadding
        hasBoxShadow
        rightIcon
        value={data.city}
        placeholder="select city / town"
        onChange={(event) => handleOnChange('city', event.target.value)}
      />
      <FormGroup label="Address" required layout="vertical">
        <CustomTextArea
          maxLength={120}
          showCount
          boxShadow
          placeholder="unit #, street / road name"
          value={data.address}
          name="address"
          onChange={(event) => handleOnChange('address', event.target.value)}
        />
      </FormGroup>
      <InputGroup
        label="Postal / Zip Code"
        required
        fontLevel={3}
        placeholder="postal / zip code"
        hasBoxShadow
        hasPadding
        hasHeight
        colorPrimaryDark
        colorRequired="tertiary"
        value={data.postal_code}
        name="postal_code"
        onChange={(event) => handleOnChange('postal_code', event.target.value)}
      />
      <FormGroup label="General Phone" required layout="vertical">
        <PhoneInput
          phonePlaceholder="area code / number"
          onChange={(value) => handleOnChange('phone', value.phoneNumber)}
          codeReadOnly
          value={{
            zoneCode: countryData.phoneCode,
            phoneNumber: data.phone,
          }}
        />
      </FormGroup>
      <InputGroup
        label="General Email"
        required
        fontLevel={3}
        hasHeight
        hasPadding
        hasBoxShadow
        rightIcon
        placeholder="general email address"
        value={data.email}
        onChange={(event) => handleOnChange('phone', event.target.value)}
      />

      <Title level={8} customClass="py-10 my-16 bottom-border-inset-black">
        ACCOUNT PROFILE
      </Title>
      <InputGroup
        label="Affilitation"
        required
        fontLevel={3}
        hasPadding
        hasBoxShadow
        hasHeight
        placeholder="select from the list"
        value={data.affiliation}
        onChange={(event) => handleOnChange('affiliation', event.target.value)}
      />
      <InputGroup
        label="Relation"
        required
        fontLevel={3}
        hasPadding
        hasBoxShadow
        hasHeight
        placeholder="select from the list"
        value={data.relation}
        onChange={(event) => handleOnChange('relation', event.target.value)}
      />
      <InputGroup
        label="Acquisition"
        required
        fontLevel={3}
        hasPadding
        hasHeight
        hasBoxShadow
        placeholder="select from the list"
        value={data.acquisition}
        onChange={(event) => handleOnChange('acquisition', event.target.value)}
      />
      <InputGroup
        label="Price Rate"
        required
        fontLevel={3}
        hasPadding
        hasHeight
        hasBoxShadow
        colorPrimaryDark={true}
        value={data.price_rate}
        onChange={(event) => handleOnChange('price_rate', event.target.value)}
      />
      <InputGroup
        label="Authorized Country"
        required
        fontLevel={3}
        hasPadding
        hasHeight
        hasBoxShadow
        rightIcon
        placeholder="select country"
        value={data.authorised_country}
        onChange={(event) => handleOnChange('authorised_country', event.target.value)}
      />
      <FormGroup
        label="Coverage Beyond"
        required={true}
        layout="vertical"
        formClass="border-bottom-light pb-8"
      >
        <CustomRadio
          options={coverageBeyondOptions}
          value={data.beyond}
          onChange={(radioValue) => handleOnChange('beyond', radioValue.value as string)}
        />
      </FormGroup>
      <FormGroup label="Remark" layout="vertical">
        <CustomTextArea
          value={data.remark}
          maxLength={240}
          showCount
          boxShadow
          placeholder="input text"
          onChange={(event) => handleOnChange('remark', event.target.value)}
        />
      </FormGroup>
    </EntryFormWrapper>
  );
};

export default CompanyEntryForm;
