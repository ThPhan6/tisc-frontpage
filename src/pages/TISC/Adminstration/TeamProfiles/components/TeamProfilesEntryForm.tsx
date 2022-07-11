import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import styles from '../styles/TeamProfilesEntryForm.less';
import { ReactComponent as WarningCircleIcon } from '@/assets/icons/warning-circle-icon.svg';
import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/pagination-right.svg';
import { ReactComponent as DropUpIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as DropDownIcon } from '@/assets/icons/drop-down-icon.svg';
import React, { FC, useState } from 'react';
import {
  TeamProfilesProps,
  typeInput,
  typeOpenModal,
  typePhoneInput,
  typeRadio,
} from '@/types/team-profile.type';
import { RadioValue } from '@/components/CustomRadio/types';
import classNames from 'classnames';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { PhoneInputValueProp } from '@/components/Form/types';
import TISCAccessLevelModal from './TISCAccessLevelModal';
import LocationModal from './LocationModal';
import { Status } from '@/components/Form/Status';

const genderData = [
  { label: 'Male', value: '1' },
  { label: 'Female', value: '2' },
];

const accessLevelData = [
  { label: 'TISC Admin', value: '111' },
  { label: 'TISC Team', value: '222', disabled: true },
  { label: 'Consultant Team', value: '333' },
];

const departmentData = [
  { label: 'Accounting/Finance', value: '11' },
  { label: 'Communication & PR', value: '21' },
  { label: 'DeSign & Creativity', value: '31' },
  { label: 'Human Resource', value: '41' },
  { label: 'Marketing & Sales', value: '51' },
];

interface TeamProfilesEntryFormValue {
  value: TeamProfilesProps;
  onChange: (value: TeamProfilesProps) => void;
}

export const TeamProfilesEntryForm: FC<TeamProfilesEntryFormValue> = ({ value, onChange }) => {
  // for location, department and TISC Access Level modal
  const [visible, setVisible] = useState<typeOpenModal | boolean>('' || false);
  const handleOpenContent = (typeModal: typeOpenModal) => {
    setVisible(typeModal);
  };
  const handleCloseContent = () => {
    setVisible('');
  };

  /// handle phone and mobile input
  const handleOnChangePhoneNumber = (
    phoneInputKey: typePhoneInput,
    phoneNumber: PhoneInputValueProp,
  ) => {
    onChange({ ...value, [phoneInputKey]: phoneNumber });
  };
  const handleRemovePhoneInputContent = (phoneInputKey: typePhoneInput) => {
    onChange({ ...value, [phoneInputKey]: { zoneCode: value.phone.zoneCode, phoneNumber: '' } });
  };

  /// handle another input
  const handleOnChangeInput = (inputKey: typeInput, e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [inputKey]: e.target.value });
  };
  const handleRemoveInputContent = (inputKey: typeInput) => {
    onChange({ ...value, [inputKey]: '' });
  };

  const handleChooseRadioContentType = (radioKey: typeRadio, radioValue: RadioValue) => {
    /// overwrite data
    onChange({ ...value, [radioKey]: { value: radioValue.value, label: radioValue.label } });
  };

  ///
  const handleSendInvite = () => {
    onChange({ ...value, status: value.status ? false : true });
  };

  return (
    <>
      <EntryFormWrapper customClass={styles.entry_form}>
        {/* First Name */}
        <FormGroup
          label="First Name"
          required={true}
          layout="vertical"
          formClass={styles.form_group}
        >
          <div className={styles.form_group__content}>
            <CustomInput
              borderBottomColor="mono-medium"
              placeholder="member first name"
              value={value.firstname}
              onChange={(e) => handleOnChangeInput('firstname', e)}
            />
            {value.firstname && (
              <ActionRemoveIcon
                className={styles.remove_icon}
                onClick={() => handleRemoveInputContent('firstname')}
              />
            )}
          </div>
        </FormGroup>

        {/*  Last Name */}
        <FormGroup
          label="Last Name"
          required={true}
          layout="vertical"
          formClass={styles.form_group}
        >
          <div className={styles.form_group__content}>
            <CustomInput
              borderBottomColor="mono-medium"
              placeholder="member last name"
              value={value.lastname}
              onChange={(e) => handleOnChangeInput('lastname', e)}
            />
            {value.lastname && (
              <ActionRemoveIcon
                className={styles.remove_icon}
                onClick={() => handleRemoveInputContent('lastname')}
              />
            )}
          </div>
        </FormGroup>

        {/* Gender */}
        <FormGroup label="Gender" required={true} layout="vertical">
          <CustomRadio
            options={genderData}
            value={value.gender.value}
            onChange={(radioValue) => handleChooseRadioContentType('gender', radioValue)}
          />
        </FormGroup>

        {/* Work Location */}
        <FormGroup
          label="Work Location"
          required={true}
          layout="vertical"
          formClass={styles.form_group}
        >
          <div className={styles.form_group__content}>
            <CustomInput
              borderBottomColor="mono-medium"
              placeholder="select from the list"
              disabled
            />
            <ActionRightIcon
              className={styles.action_right_icon}
              onClick={() => handleOpenContent('location')}
            />
          </div>
        </FormGroup>

        {/* Department */}
        <FormGroup
          label="Department"
          required={true}
          layout="vertical"
          formClass={styles.form_group}
        >
          <div className={styles.form_group__content}>
            <CustomInput
              borderBottomColor="mono-medium"
              placeholder="select from the list"
              disabled
              value={value.department.label as string}
            />
            {visible === 'department' ? (
              <DropUpIcon className={styles.drop_icon} onClick={handleCloseContent} />
            ) : (
              <DropDownIcon
                className={styles.drop_icon}
                onClick={() => handleOpenContent('department')}
              />
            )}
          </div>
          <div className={styles.radio_list}>
            {visible === 'department' && (
              <CustomRadio
                options={departmentData}
                isRadioList
                otherInput
                value={value.department.value}
                onChange={(radioValue) => handleChooseRadioContentType('department', radioValue)}
              />
            )}
          </div>
        </FormGroup>

        {/* Position / Role */}
        <FormGroup
          label="Position / Role"
          required={true}
          layout="vertical"
          formClass={styles.form_group}
        >
          <div className={styles.form_group__content}>
            <CustomInput
              borderBottomColor="mono-medium"
              placeholder="member position/role"
              value={value.position}
              onChange={(e) => handleOnChangeInput('position', e)}
            />
            {value.position && (
              <ActionRemoveIcon
                className={styles.remove_icon}
                onClick={() => handleRemoveInputContent('position')}
              />
            )}
          </div>
        </FormGroup>

        {/* Work Email */}
        <FormGroup
          label="Work Email"
          required={true}
          layout="vertical"
          formClass={styles.form_group}
        >
          <div className={styles.form_group__content}>
            <CustomInput
              borderBottomColor="mono-medium"
              placeholder="user work email address"
              value={value.email}
              onChange={(e) => handleOnChangeInput('email', e)}
            />
            {value.email && (
              <ActionRemoveIcon
                className={styles.remove_icon}
                onClick={() => handleRemoveInputContent('email')}
              />
            )}
          </div>
        </FormGroup>

        {/* Work Phone */}
        <FormGroup
          label=" Work Phone"
          required={true}
          layout="vertical"
          formClass={styles.form_group}
        >
          <div className={styles.form_group__content}>
            <PhoneInput
              phonePlaceholder="area code / number"
              value={value.phone}
              onChange={(phoneInputValue) => handleOnChangePhoneNumber('phone', phoneInputValue)}
              containerClass={styles.phone_input}
            />
            {value.phone.phoneNumber && (
              <ActionRemoveIcon
                className={styles.remove_icon}
                onClick={() => handleRemovePhoneInputContent('phone')}
              />
            )}
          </div>
        </FormGroup>

        {/* Work Mobile */}
        <FormGroup
          label="Work Mobile"
          required={true}
          layout="vertical"
          formClass={styles.form_group}
        >
          <div className={styles.form_group__content}>
            <PhoneInput
              phonePlaceholder="mobile number"
              value={value.mobile}
              onChange={(mobileInputValue) => handleOnChangePhoneNumber('mobile', mobileInputValue)}
              containerClass={styles.phone_input}
            />
            {value.mobile.phoneNumber && (
              <ActionRemoveIcon
                className={styles.remove_icon}
                onClick={() => handleRemovePhoneInputContent('mobile')}
              />
            )}
          </div>
        </FormGroup>

        {/* Access Level */}
        <FormGroup
          label="Access Level"
          required={true}
          tooltip={'How are you'}
          iconTooltip={<WarningCircleIcon className={styles.warning_icon} />}
          layout="vertical"
          formClass={classNames(styles.form_group, styles.access_label)}
          onClick={() => handleOpenContent('access_level')}
        >
          <CustomRadio
            options={accessLevelData}
            value={value.access_level.value}
            onChange={(radioValue) => handleChooseRadioContentType('access_level', radioValue)}
          />
        </FormGroup>

        {/* Status */}
        <Status
          value={value.status}
          onClick={handleSendInvite}
          label="Status"
          buttonName="Send Invite"
          text_1="Activated"
          text_2="Unactivated"
          formClass={styles.status}
        />
      </EntryFormWrapper>

      {/* TISC Access level modal */}
      <TISCAccessLevelModal visible={visible === 'access_level'} setVisible={setVisible} />

      {/* Location Modal */}
      <LocationModal visible={visible === 'location'} setVisible={setVisible} />
    </>
  );
};
