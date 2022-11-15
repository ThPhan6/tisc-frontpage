import { FC, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { Collapse } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { pushTo } from '@/helper/history';
import { getEmailMessageError, getEmailMessageErrorType, getFullName } from '@/helper/utils';

import { ContactDetail, CustomResourceForm } from '../../types';
import { CollapsingProps } from '@/features/how-to/types';

import CustomButton from '@/components/Button';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText } from '@/components/Typography';

import styles from '../../CustomResource.less';

interface ContactProps {
  data: CustomResourceForm;
  setData: (data: CustomResourceForm) => void;
  onSubmit: () => void;
  submitButtonStatus: boolean;
}

interface ContactHeaderProps extends CollapsingProps {
  index: number;
  item: ContactDetail;
}

const DEFAULT_CONTACT: ContactDetail = {
  first_name: '',
  last_name: '',
  position: '',
  work_email: '',
  work_phone: '',
  work_mobile: '',
};
type FieldName = keyof ContactDetail;
const ContactHeader: FC<ContactHeaderProps> = (props) => {
  const { item, activeKey, handleActiveCollapse, index } = props;
  return (
    <div className={styles.panel_header}>
      <div
        className={`${styles.panel_header__field}`}
        onClick={() => handleActiveCollapse(item.first_name ? index : -1)}>
        <div className={styles.titleIcon}>
          <BodyText
            level={5}
            fontFamily="Roboto"
            customClass={
              String(index) !== activeKey ? styles.font_weight_300 : styles.font_weight_500
            }>
            {getFullName(item)}
          </BodyText>
        </div>
        <div className={styles.icon}>
          {String(index) !== activeKey ? <DropdownIcon /> : <DropupIcon />}
        </div>
      </div>
    </div>
  );
};
export const ContactInformation: FC<ContactProps> = ({
  data,
  setData,
  onSubmit,
  submitButtonStatus,
}) => {
  const [activeKey, setActiveKey] = useState<string>('');
  const handleActiveCollapse = (index: number) => {
    setActiveKey(activeKey === String(index) ? '' : String(index));
  };
  const onChangeData = (fieldName: FieldName, fieldValue: any) => {
    setData({ ...data, [fieldName]: fieldValue });
  };

  const handleAddContact = () => {
    setData({ ...data, contacts: [...data.contacts, DEFAULT_CONTACT] });
  };
  return (
    <>
      <TableHeader
        title=""
        rightAction={
          <CustomPlusButton
            size={18}
            label="Add Contact"
            onClick={handleAddContact}
            customClass={styles.label}
          />
        }
      />
      <div
        style={{
          height: 'calc(100vh - 304px)',
          padding: '16px',
          overflow: 'auto',
        }}>
        {data.contacts.map((contact, index) => (
          <Collapse ghost activeKey={activeKey}>
            <Collapse.Panel
              header={
                <ContactHeader
                  index={index}
                  item={contact}
                  activeKey={activeKey}
                  handleActiveCollapse={handleActiveCollapse}
                />
              }
              key={index}
              showArrow={false}
              className={
                String(index) !== activeKey ? styles['bottomMedium'] : styles['bottomBlack']
              }>
              <InputGroup
                label="First Name"
                deleteIcon
                fontLevel={3}
                value={contact.first_name}
                hasPadding
                colorPrimaryDark
                hasBoxShadow
                hasHeight
                onChange={(e) => {
                  onChangeData('first_name', e.target.value);
                }}
                onDelete={() => onChangeData('first_name', '')}
                placeholder="contact first name"
              />
              {/* Last name */}
              <InputGroup
                label="Last Name"
                deleteIcon
                fontLevel={3}
                value={contact.last_name}
                hasPadding
                colorPrimaryDark
                hasBoxShadow
                hasHeight
                onChange={(e) => {
                  onChangeData('last_name', e.target.value);
                }}
                onDelete={() => onChangeData('last_name', '')}
                placeholder="contact last name"
              />
              {/* Position / Role */}
              <InputGroup
                label="Position / Role"
                deleteIcon
                fontLevel={3}
                value={contact.position}
                hasPadding
                colorPrimaryDark
                hasBoxShadow
                hasHeight
                onChange={(e) => {
                  onChangeData('position', e.target.value);
                }}
                onDelete={() => onChangeData('position', '')}
                placeholder="contact position/role "
              />

              {/* Work Email */}
              <InputGroup
                label="Work Email"
                deleteIcon
                fontLevel={3}
                value={contact.work_email}
                hasPadding
                colorPrimaryDark
                hasBoxShadow
                hasHeight
                onChange={(e) => {
                  onChangeData('work_email', e.target.value);
                }}
                onDelete={() => onChangeData('work_email', '')}
                placeholder="contact work email address"
                message={getEmailMessageError(contact.work_email, MESSAGE_ERROR.EMAIL_INVALID)}
                messageType={getEmailMessageErrorType(contact.work_email, 'error', 'normal')}
              />

              {/* Work Phone */}
              <FormGroup label="Work Phone" layout="vertical">
                <PhoneInput
                  phonePlaceholder="area code / number"
                  onChange={(value) => {
                    onChangeData('work_phone', value.phoneNumber);
                  }}
                  colorPlaceholder="mono"
                  containerClass={styles.phoneInputCustom}
                  codeReadOnly
                  value={{
                    zoneCode: '00',
                    phoneNumber: contact.work_phone,
                  }}
                  deleteIcon
                />
              </FormGroup>
              {/* Work Mobile */}
              <FormGroup label="Work Mobile" layout="vertical">
                <PhoneInput
                  phonePlaceholder="mobile number"
                  onChange={(value) => {
                    onChangeData('work_mobile', value.phoneNumber);
                  }}
                  colorPlaceholder="mono"
                  containerClass={styles.phoneInputCustom}
                  codeReadOnly
                  value={{
                    zoneCode: '00',
                    phoneNumber: contact.work_mobile,
                  }}
                  deleteIcon
                />
              </FormGroup>
            </Collapse.Panel>
          </Collapse>
        ))}
      </div>
      <div className={styles.bottom}>
        <CustomButton
          properties="rounded"
          size="small"
          buttonClass={styles.btnCancel}
          onClick={() => pushTo(PATH.designerCustomResource)}>
          Cancel
        </CustomButton>
        <CustomSaveButton onClick={onSubmit} isSuccess={submitButtonStatus}>
          Save
        </CustomSaveButton>
      </div>
    </>
  );
};
