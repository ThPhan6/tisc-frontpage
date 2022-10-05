import { useEffect, useState } from 'react';

import { getBusinessAddress } from '@/helper/utils';

import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';

import styles from './DesignFirm.less';

export const DesignFirm = () => {
  const [data, setData] = useState({
    name: '',
    official_website: '',
    address: '',
    phoneCode: '',
    phone: '',
    email: '',
  });
  useEffect(() => {
    setData({
      name: '',
      official_website: '',
      address: '',
      phoneCode: '90',
      phone: '123',
      email: '',
    });
  }, []);
  return (
    <div className={styles.content}>
      <TextForm label="Name" boxShadow>
        {data.name ?? ''}
      </TextForm>

      <TextForm boxShadow label="Official Website">
        {data.official_website ?? ''}
      </TextForm>
      <TextForm boxShadow label="Address">
        {getBusinessAddress(data)}
      </TextForm>
      <FormGroup label="General Phone" layout="vertical" labelColor="mono-color-dark">
        <PhoneInput
          codeReadOnly
          phoneNumberReadOnly
          value={{
            zoneCode: data.phoneCode,
            phoneNumber: data.phone,
          }}
        />
      </FormGroup>
      <TextForm boxShadow label="General Email">
        {data.email ?? ''}
      </TextForm>
    </div>
  );
};
