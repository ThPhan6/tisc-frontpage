import { useEffect, useState } from 'react';

import { getGeneralInquiryDesignFirm } from '../services';

import { GeneralInquiryDesignFirm } from '../types';

import TextForm from '@/components/Form/TextForm';

import styles from '../detail.less';

const DEFAULT_STATE = {
  name: '',
  official_website: '',
  inquirer: '',
  role: '',
  work_email: '',
  work_phone: '',
  address: '',
};

export const DesignFirm = () => {
  const [designFirmData, setDesignFirmData] = useState<GeneralInquiryDesignFirm>(DEFAULT_STATE);

  useEffect(() => {
    getGeneralInquiryDesignFirm().then((res) => {
      if (res) {
        setDesignFirmData(res);
      }
    });
  }, []);

  return (
    <>
      <TextForm boxShadow label="Name" formClass={styles.nameDesignFirm}>
        {designFirmData.name}
      </TextForm>
      <TextForm boxShadow label="Official Website">
        {designFirmData.official_website}
      </TextForm>
      <TextForm boxShadow label="Address">
        {designFirmData.address}
      </TextForm>
      <TextForm boxShadow label="Inquirer">
        {designFirmData.inquirer}
      </TextForm>
      <TextForm boxShadow label="Position/Role">
        {designFirmData.role}
      </TextForm>
      <TextForm boxShadow label="Work Email">
        {designFirmData.work_email}
      </TextForm>
      <TextForm boxShadow label="Work Phone">
        {designFirmData.work_phone}
      </TextForm>
    </>
  );
};
