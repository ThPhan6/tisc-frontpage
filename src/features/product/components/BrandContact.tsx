import { RobotoBodyText } from '@/components/Typography';
import { FC } from 'react';
import styles from './BrandContact.less';

export interface BusinessDetailProps {
  business: string;
  type: string;
  address: string;
  country?: string;
  phone_code?: string;
  general_phone?: string;
  genernal_email?: string;
  customClass?: string;
}
export const BusinessDetail: FC<BusinessDetailProps> = ({
  business = '',
  type = '',
  address = '',
  phone_code = '',
  general_phone = '',
  genernal_email = '',
  customClass = '',
}) => {
  return (
    <div className={`${styles.detail} ${customClass}`}>
      <div className={styles.detail_business}>
        <RobotoBodyText level={6} customClass={styles.name}>
          {business}
        </RobotoBodyText>
        <RobotoBodyText level={6} customClass={styles.type}>
          {type && `(${type})`}
        </RobotoBodyText>
      </div>
      <RobotoBodyText level={6} customClass={styles.detail_address}>
        {address}
      </RobotoBodyText>
      <div className={styles.detail_phoneEmail}>
        {general_phone ? (
          <RobotoBodyText level={6} customClass={styles.phone}>
            T: {`${phone_code} ${general_phone}`}
          </RobotoBodyText>
        ) : (
          ''
        )}
        {genernal_email ? <RobotoBodyText level={6}>E: {genernal_email}</RobotoBodyText> : ''}
      </div>
      {/* {      <span className={styles.detail_contact}>Contact: hien tai trong data khong co</span> :  ''} */}
    </div>
  );
};
