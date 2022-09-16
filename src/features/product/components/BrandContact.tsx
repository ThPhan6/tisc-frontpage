import { FC } from 'react';

import { getFullName } from '@/helper/utils';

import { RobotoBodyText } from '@/components/Typography';

import styles from './BrandContact.less';

export interface BusinessDetailProps {
  data?: any;
  customClass?: string;
  type?: string;
}
export const BusinessDetail: FC<BusinessDetailProps> = ({ data = '', customClass = '', type }) => {
  const getBusinessAddress = (businessAddress: any) => {
    const city = businessAddress.city_name !== '' ? `${businessAddress.city_name},` : '';
    const state = businessAddress.state_name !== '' ? `${businessAddress.state_name},` : '';
    return `${businessAddress.address}, ${city} ${state} ${businessAddress.country_name}`;
  };
  return (
    <div className={`${styles.detail} ${customClass}`}>
      <div className={styles.detail_business}>
        <RobotoBodyText level={6} customClass={styles.name}>
          {data.business_name || data.name || ''}
        </RobotoBodyText>
        <RobotoBodyText level={6} customClass={styles.type}>
          {type ? `(${type})` : ''}
        </RobotoBodyText>
      </div>
      <RobotoBodyText level={6} customClass={styles.detail_address}>
        {getBusinessAddress(data)}
      </RobotoBodyText>
      <div className={styles.detail_phoneEmail}>
        {data.general_phone || data.phone ? (
          <RobotoBodyText level={6} customClass={styles.phone}>
            T: {`${data.phone_code} ${data.general_phone || data.phone}`}
          </RobotoBodyText>
        ) : (
          ''
        )}
        {data.genernal_email || data.email ? (
          <RobotoBodyText level={6}>E: {data.genernal_email || data.email}</RobotoBodyText>
        ) : (
          ''
        )}
      </div>
      <span className={styles.detail_contact}>
        {data.first_name ? (
          <RobotoBodyText level={6}>Contact: {getFullName(data)}</RobotoBodyText>
        ) : (
          ''
        )}
      </span>
    </div>
  );
};
