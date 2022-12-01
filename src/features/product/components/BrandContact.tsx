import { FC } from 'react';

import { ContactDetail } from '@/pages/Designer/CustomResource/type';

import { RobotoBodyText } from '@/components/Typography';

import styles from './BrandContact.less';

export interface BusinessDetailProps {
  business: string;
  address: string;
  type?: string;
  country?: string;
  phone_code?: string;
  general_phone?: string;
  genernal_email?: string;
  first_name?: string;
  last_name?: string;
  customClass?: string;
  contacts?: ContactDetail[];
  hideContact?: boolean;
}
export const BusinessDetail: FC<BusinessDetailProps> = ({
  business = '',
  type = '',
  address = '',
  phone_code = '',
  general_phone = '',
  genernal_email = '',
  first_name = '',
  last_name = '',
  customClass = '',
  contacts,
  hideContact,
}) => {
  const renderContact = (el: ContactDetail) => {
    return (
      <div style={{ paddingTop: 8, paddingLeft: 16 }}>
        <div className={styles.detail_phoneEmail}>
          <RobotoBodyText level={6} customClass={styles.phone}>
            {el.first_name} {el.last_name}
          </RobotoBodyText>
          <RobotoBodyText level={6}>{el.position}</RobotoBodyText>
        </div>
        <div className={styles.detail_phoneEmail}>
          <RobotoBodyText level={6} customClass={styles.phone}>
            +{el.phone_code || phone_code} {el.work_phone}
          </RobotoBodyText>
          <RobotoBodyText level={6}>{el.work_email}</RobotoBodyText>
        </div>
      </div>
    );
  };

  const renderContacts = () => {
    if (hideContact) {
      return null;
    }
    if (contacts?.length) {
      return contacts.map(renderContact);
    }
    return renderContact({
      first_name,
      last_name,
      position: '',
      work_email: genernal_email,
      work_mobile: '',
      work_phone: general_phone,
      phone_code: phone_code,
    });
  };

  return (
    <div className={`${styles.detail} ${customClass}`}>
      <div className={styles.detail_business}>
        <RobotoBodyText level={6} customClass={styles.name}>
          {business}
        </RobotoBodyText>
        <RobotoBodyText level={6} customClass={styles.type}>
          {type ? `(${type})` : ''}
        </RobotoBodyText>
      </div>
      <RobotoBodyText level={6} customClass={styles.detail_address}>
        {address}
      </RobotoBodyText>

      {renderContacts()}
    </div>
  );
};
