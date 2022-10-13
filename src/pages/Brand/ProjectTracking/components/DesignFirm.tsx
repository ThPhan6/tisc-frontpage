import { FC } from 'react';

import { DesignFirmDetail } from '@/types/project-tracking.type';

import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';

import styles from './DesignFirm.less';

interface DesignFirmProp {
  designFirm: DesignFirmDetail;
}
export const DesignFirm: FC<DesignFirmProp> = ({ designFirm }) => {
  return (
    <div className={styles.content}>
      <TextForm label="Name" boxShadow>
        {designFirm.name ?? ''}
      </TextForm>

      <TextForm boxShadow label="Official Website">
        {designFirm.official_website ?? ''}
      </TextForm>
      <TextForm boxShadow label="Address">
        {designFirm.address}
      </TextForm>
      <FormGroup label="General Phone" layout="vertical" labelColor="mono-color-dark">
        <PhoneInput
          codeReadOnly
          phoneNumberReadOnly
          value={{
            zoneCode: designFirm.phone_code,
            phoneNumber: designFirm.phone,
          }}
          containerClass={styles.customPhoneCode}
        />
      </FormGroup>
      <TextForm boxShadow label="General Email">
        {designFirm.email ?? ''}
      </TextForm>
    </div>
  );
};
