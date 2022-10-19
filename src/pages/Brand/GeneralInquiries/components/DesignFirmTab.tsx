import { FC } from 'react';

import { GeneralInquiryDesignFirm } from '../types';

import TextForm from '@/components/Form/TextForm';

import styles from '../detail.less';

export const DesignFirmTab: FC<{ data: GeneralInquiryDesignFirm }> = ({ data }) => {
  const { name, official_website, address, general_email, general_phone, phone_code } = data;
  return (
    <>
      <TextForm boxShadow label="Name" formClass={styles.nameDesignFirm}>
        {name || ''}
      </TextForm>
      <TextForm boxShadow label="Official Website">
        {official_website || ''}
      </TextForm>
      <TextForm boxShadow label="Address">
        {address || ''}
      </TextForm>
      <TextForm boxShadow label="General Phone">
        +{phone_code} {general_phone}
      </TextForm>
      <TextForm boxShadow label="General Email">
        {general_email}
      </TextForm>
    </>
  );
};
