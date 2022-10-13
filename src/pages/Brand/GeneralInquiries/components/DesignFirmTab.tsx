import { FC } from 'react';

import { GeneralInquiryDesignFirm } from '../types';

import TextForm from '@/components/Form/TextForm';

import styles from '../detail.less';

export const DesignFirmTab: FC<GeneralInquiryDesignFirm> = ({
  name,
  official_website,
  inquirer,
  role,
  work_email,
  work_phone,
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
        {role || ''}
      </TextForm>
      <TextForm boxShadow label="Work Email">
        {work_email || ''}
      </TextForm>
      <TextForm boxShadow label="Work Phone">
        {work_phone || ''}
      </TextForm>
    </>
  );
};
