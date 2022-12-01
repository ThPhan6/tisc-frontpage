import { FC, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { Collapse } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { pushTo } from '@/helper/history';
import {
  getEmailMessageError,
  getEmailMessageErrorType,
  getFullName,
  validateEmail,
} from '@/helper/utils';

import { ContactDetail, CustomResourceForm } from '../type';
import { CollapsingProps } from '@/features/how-to/types';

import CustomButton from '@/components/Button';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText } from '@/components/Typography';

import styles from '../CustomResource.less';

interface ContactInformationProps {
  data: CustomResourceForm;
  setData: (data: CustomResourceForm) => void;
  onSubmit?: () => void;
  submitButtonStatus?: boolean;
  type: 'view' | 'create';
}

interface ContactHeaderProps extends CollapsingProps {
  index: number;
  item: ContactDetail;
  handleClickDeleteItem: () => void;
  type: 'view' | 'create';
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

const checkContactValue = (data: ContactDetail) => {
  return (
    data.first_name === '' ||
    data.last_name === '' ||
    data.position === '' ||
    data.work_phone === '' ||
    data.work_email === '' ||
    data.work_mobile === '' ||
    !validateEmail(data.work_email)
  );
};

const ContactHeader: FC<ContactHeaderProps> = (props) => {
  const { item, activeKey, handleActiveCollapse, index, handleClickDeleteItem, type } = props;
  return (
    <div
      className={styles.panel_header}
      onClick={() => handleActiveCollapse(item.first_name ? index : -1)}>
      <div className={`${styles.panel_header__field}`}>
        {String(index) === activeKey || checkContactValue(item) ? (
          <div className={styles.titleIcon}>
            <BodyText level={4}>CONTACT INFORMATION</BodyText>
            {type === 'create' && (
              <DeleteIcon onClick={handleClickDeleteItem} className={styles.deleteIcon} />
            )}
          </div>
        ) : (
          <div className={styles.title}>
            <BodyText level={5} fontFamily="Roboto">
              {getFullName(item)}
            </BodyText>
            <BodyText level={4} style={{ marginLeft: '12px', color: '#808080' }}>
              {item.position}
            </BodyText>
          </div>
        )}
      </div>

      <div className={styles.icon}>
        {String(index) !== activeKey ? <DropdownIcon /> : <DropupIcon />}
      </div>
    </div>
  );
};

export const ContactInformation: FC<ContactInformationProps> = ({
  data,
  setData,
  onSubmit,
  submitButtonStatus,
  type,
}) => {
  const [activeKey, setActiveKey] = useState<string>('');

  const handleActiveCollapse = (index: number) => {
    setActiveKey(activeKey === String(index) ? '' : String(index));
  };

  const onChangeData = (fieldName: FieldName, fieldValue: any, index: number) => {
    const newContact = [...data.contacts];
    newContact[index] = { ...newContact[index], [fieldName]: fieldValue };
    setData({ ...data, contacts: newContact });
    setActiveKey(String(index));
  };

  const handleDisableButton = () => {
    for (const element of data.contacts) {
      if (checkContactValue(element)) {
        return true;
      }
    }
    return false;
  };

  const handleAddContact = () => {
    if (!handleDisableButton()) {
      setData({ ...data, contacts: [...data.contacts, DEFAULT_CONTACT] });
    }
  };

  const handleClickDelete = (index: number) => {
    const newContact = [...data.contacts];
    newContact.splice(index, 1);
    setData({ ...data, contacts: newContact });
  };

  const renderContacts = (contact: ContactDetail, index: number) => {
    return (
      <Collapse ghost activeKey={checkContactValue(contact) ? index : activeKey}>
        <Collapse.Panel
          header={
            <ContactHeader
              index={index}
              item={contact}
              activeKey={checkContactValue(contact) ? index : activeKey}
              handleActiveCollapse={handleActiveCollapse}
              handleClickDeleteItem={() => handleClickDelete(index)}
              type={type}
            />
          }
          key={index}
          collapsible={checkContactValue(contact) ? 'disabled' : undefined}
          showArrow={false}
          className={String(index) !== activeKey ? styles['bottomMedium'] : ''}>
          <InputGroup
            label="First Name"
            required
            deleteIcon={type === 'create'}
            fontLevel={4}
            value={contact.first_name}
            hasPadding
            colorPrimaryDark={type === 'create'}
            hasBoxShadow
            hasHeight
            onChange={(e) => {
              onChangeData('first_name', e.target.value, index);
            }}
            onDelete={() => onChangeData('first_name', '', index)}
            placeholder="contact first name"
            readOnly={type === 'view'}
          />
          {/* Last name */}
          <InputGroup
            label="Last Name"
            required
            deleteIcon={type === 'create'}
            fontLevel={4}
            value={contact.last_name}
            hasPadding
            colorPrimaryDark={type === 'create'}
            hasBoxShadow
            hasHeight
            onChange={(e) => {
              onChangeData('last_name', e.target.value, index);
            }}
            onDelete={() => onChangeData('last_name', '', index)}
            placeholder="contact last name"
            readOnly={type === 'view'}
          />
          {/* Position / Role */}
          <InputGroup
            label="Position / Role"
            required
            deleteIcon={type === 'create'}
            fontLevel={4}
            value={contact.position}
            hasPadding
            colorPrimaryDark={type === 'create'}
            hasBoxShadow
            hasHeight
            onChange={(e) => {
              onChangeData('position', e.target.value, index);
            }}
            onDelete={() => onChangeData('position', '', index)}
            placeholder="contact position/role "
            readOnly={type === 'view'}
          />

          {/* Work Email */}
          <InputGroup
            label="Work Email"
            required
            deleteIcon={type === 'create'}
            fontLevel={4}
            value={contact.work_email}
            hasPadding
            colorPrimaryDark={type === 'create'}
            hasBoxShadow
            hasHeight
            onChange={(e) => {
              onChangeData('work_email', e.target.value, index);
            }}
            onDelete={() => onChangeData('work_email', '', index)}
            placeholder="contact work email address"
            message={getEmailMessageError(contact.work_email, MESSAGE_ERROR.EMAIL_INVALID)}
            messageType={getEmailMessageErrorType(contact.work_email, 'error', 'normal')}
            readOnly={type === 'view'}
          />

          {/* Work Phone */}
          <FormGroup
            label="Work Phone"
            layout="vertical"
            required
            style={{ marginBottom: '16px' }}
            labelFontSize={4}>
            <PhoneInput
              phonePlaceholder="area code / number"
              onChange={(value) => {
                onChangeData('work_phone', value.phoneNumber, index);
              }}
              colorPlaceholder="mono"
              containerClass={type === 'create' ? styles.customPhoneInput : ''}
              codeReadOnly
              value={{
                zoneCode: data.phone_code ?? '00',
                phoneNumber: contact.work_phone,
              }}
              deleteIcon={type === 'create'}
              phoneNumberReadOnly={type === 'view'}
            />
          </FormGroup>
          {/* Work Mobile */}
          <FormGroup
            label="Work Mobile"
            layout="vertical"
            required
            labelFontSize={4}
            style={{ marginBottom: '16px' }}>
            <PhoneInput
              phonePlaceholder="mobile number"
              onChange={(value) => {
                onChangeData('work_mobile', value.phoneNumber, index);
              }}
              colorPlaceholder="mono"
              containerClass={type === 'create' ? styles.customPhoneInput : ''}
              codeReadOnly
              value={{
                zoneCode: data.phone_code ?? '00',
                phoneNumber: contact.work_mobile,
              }}
              deleteIcon={type === 'create'}
              phoneNumberReadOnly={type === 'view'}
            />
          </FormGroup>
        </Collapse.Panel>
      </Collapse>
    );
  };

  return (
    <>
      <TableHeader
        title=""
        rightAction={
          type === 'create' ? (
            <CustomPlusButton
              size={18}
              label="Add Contact"
              onClick={handleAddContact}
              customClass={styles.label}
              disabled={handleDisableButton()}
            />
          ) : (
            <CloseIcon
              onClick={() => pushTo(PATH.designerCustomResource)}
              style={{ cursor: 'pointer' }}
            />
          )
        }
      />
      <div className={styles.information}>
        {data.contacts.map((contact, index) => renderContacts(contact, index))}
      </div>
      {type === 'create' && (
        <div className={styles.bottom}>
          <CustomButton
            properties="rounded"
            size="small"
            buttonClass={styles.btnCancel}
            onClick={() => pushTo(PATH.designerCustomResource)}>
            Cancel
          </CustomButton>
          <CustomSaveButton
            onClick={!handleDisableButton() ? onSubmit : undefined}
            isSuccess={submitButtonStatus}
            customClass={handleDisableButton() ? styles.disableButton : ''}>
            Save
          </CustomSaveButton>
        </div>
      )}
    </>
  );
};
