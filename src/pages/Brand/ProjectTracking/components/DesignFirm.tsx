import { FC } from 'react';

import { Collapse } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

// import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { DesignFirmDetail } from '@/types/project-tracking.type';

import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';
import { BodyText } from '@/components/Typography';

import styles from './DesignFirm.less';

interface DesignFirmProp {
  designFirm: DesignFirmDetail;
}

const RenderHeader = () => {
  return (
    <div className={styles.panel_header}>
      <div className={`${styles.panel_header__field}`}>
        <div className={styles.titleIcon}>
          <BodyText level={4} fontFamily="Roboto">
            aaaaaa
          </BodyText>
        </div>
        <div className={styles.icon}>
          <DropdownIcon />
        </div>
      </div>
    </div>
  );
};
export const DesignFirm: FC<DesignFirmProp> = ({ designFirm }) => {
  return (
    <div className={styles.content}>
      <TextForm label="Name" boxShadow>
        {designFirm.name ?? ''}
      </TextForm>

      <TextForm boxShadow label="Official Website">
        {designFirm.official_website ?? ''}
      </TextForm>
      <Collapse ghost>
        <Collapse.Panel
          header={<RenderHeader />}
          key={'1'}
          showArrow={false}
          className={styles.customHeadleCollapse}
          // className={value.id !== activeKey ? styles['bottomMedium'] : styles['bottomBlack']}
        >
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
          <TextForm boxShadow label="Team Members">
            {designFirm.email ?? ''}
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
                <tr>
                  <td className={styles.name}>
                    <BodyText level={5} fontFamily="Roboto">
                      {'N/A'}
                    </BodyText>
                  </td>
                  <td className={styles.position}>
                    <BodyText level={5} fontFamily="Roboto">
                      {'aaa'}
                    </BodyText>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
