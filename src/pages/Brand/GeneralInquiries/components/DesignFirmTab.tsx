import { FC } from 'react';

import { GeneralInquiryDesignFirm } from '../types';

import TextForm from '@/components/Form/TextForm';

import styles from '../detail.less';

export const DesignFirmTab: FC<GeneralInquiryDesignFirm> = ({
  name,
  official_website,
  inquirer,
  position,
  email,
  phone,
  address,
}) => {
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
      <TextForm boxShadow label="Inquirer">
        {inquirer || ''}
      </TextForm>
      <TextForm boxShadow label="Position/Role">
        {position || ''}
      </TextForm>
      <TextForm boxShadow label="Work Email">
        {email || ''}
      </TextForm>
      <TextForm boxShadow label="Work Phone">
        {phone || ''}
      </TextForm>
    </>
  );
};
