import { FC, useState } from 'react';

import { Collapse } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { getFullName } from '@/helper/utils';

import { CollapsingProps } from '@/features/how-to/types';
import { DesignFirmDetail, LocationDetail } from '@/types/project-tracking.type';

import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';
import { BodyText } from '@/components/Typography';

import styles from './DesignFirm.less';

interface DesignFirmProp {
  designFirm: DesignFirmDetail;
}

interface LocationProps extends CollapsingProps {
  index: number;
  item: LocationDetail;
}
const RenderHeader: FC<LocationProps> = (props) => {
  const { item, activeKey, handleActiveCollapse, index } = props;
  return (
    <div className={styles.panel_header}>
      <div
        className={`${styles.panel_header__field}`}
        onClick={() => handleActiveCollapse(item.country_name ? index : -1)}>
        <div className={styles.titleIcon}>
          <BodyText
            level={5}
            fontFamily="Roboto"
            customClass={
              String(index) !== activeKey ? styles.font_weight_300 : styles.font_weight_500
            }>
            {item.city_name}, {item.country_name}
          </BodyText>
        </div>
        <div className={styles.icon}>
          {String(index) !== activeKey ? <DropdownIcon /> : <DropupIcon />}
        </div>
      </div>
    </div>
  );
};
export const DesignFirm: FC<DesignFirmProp> = ({ designFirm }) => {
  const [activeKey, setActiveKey] = useState<string>('');
  const handleActiveCollapse = (index: number) => {
    setActiveKey(activeKey === String(index) ? '' : String(index));
  };
  return (
    <div className={styles.content}>
      <TextForm label="Name" boxShadow>
        {designFirm.name ?? ''}
      </TextForm>

      <TextForm boxShadow label="Official Website">
        {designFirm.official_website ?? ''}
      </TextForm>
      {designFirm.locations.map((location, index) => (
        <Collapse ghost activeKey={activeKey}>
          <Collapse.Panel
            header={
              <RenderHeader
                index={index}
                item={location}
                activeKey={activeKey}
                handleActiveCollapse={handleActiveCollapse}
              />
            }
            key={index}
            showArrow={false}
            className={
              String(index) !== activeKey ? styles['bottomMedium'] : styles['bottomBlack']
            }>
            <TextForm boxShadow label="Address">
              {location.address}
            </TextForm>
            <FormGroup label="General Phone" layout="vertical" labelColor="mono-color-dark">
              <PhoneInput
                codeReadOnly
                phoneNumberReadOnly
                value={{
                  zoneCode: '00',
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
                  {location.teamMembers.map((member) => (
                    <tr>
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
          </Collapse.Panel>
        </Collapse>
      ))}
    </div>
  );
};
