import { FC } from 'react';

import { getFullName } from '@/helper/utils';

import { useCollapseGroupActiveCheck } from '@/reducers/active';
import { DesignFirmDetail, LocationDetail } from '@/types/project-tracking.type';

import CustomCollapse from '@/components/Collapse';
import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';
import { BodyText } from '@/components/Typography';

import styles from './DesignFirm.less';

interface LocationProps {
  index: number;
  location: LocationDetail;
}
const AddressGroup: FC<LocationProps> = (props) => {
  const { location, index } = props;
  const { curActiveKey, onKeyChange } = useCollapseGroupActiveCheck(
    'project-tracking-address',
    index,
  );

  return (
    <CustomCollapse
      activeKey={curActiveKey}
      onChange={onKeyChange}
      header={
        <BodyText level={5} fontFamily="Roboto">
          {location.city_name !== '' ? `${location.city_name},` : ''} {location.country_name}
        </BodyText>
      }
      noPadding
      noBorder
      arrowAlignRight
      style={{ marginBottom: 8 }}
    >
      <TextForm boxShadow label="Address">
        {location.address}
      </TextForm>
      <FormGroup label="General Phone" layout="vertical" labelColor="mono-color-dark">
        <PhoneInput
          codeReadOnly
          phoneNumberReadOnly
          value={{
            zoneCode: location.phone_code,
            phoneNumber: location.general_phone,
          }}
          containerClass={styles.customPhoneCode}
        />
      </FormGroup>
      <TextForm boxShadow label="General Email">
        {location.general_email ?? ''}
      </TextForm>
      <div className={styles.team}>
        <div className={styles.label}>
          <BodyText level={4} color="mono-color-dark">
            Team Members
          </BodyText>
          <span className={styles.colon}>:</span>
        </div>
        <table className={styles.table}>
          <tbody>
            {location.teamMembers.map((member, idx) => (
              <tr key={idx}>
                <td className={styles.name}>
                  <BodyText level={5} fontFamily="Roboto">
                    {getFullName(member)}
                  </BodyText>
                </td>
                <td className={styles.position}>
                  <BodyText level={5} fontFamily="Roboto">
                    {member.position}
                  </BodyText>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomCollapse>
  );
};

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
      {designFirm.locations.map((location, index) => (
        <AddressGroup key={index} location={location} index={index} />
      ))}
    </div>
  );
};
