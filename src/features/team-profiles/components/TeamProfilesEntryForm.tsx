import React, { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';

import { ReactComponent as InfoIcon } from '@/assets/icons/info-icon.svg';

import { emailMessageError, emailMessageErrorType } from '@/helper/utils';
import { getDepartmentList } from '@/services';

import { TeamProfileDetailProps, TeamProfileRequestBody } from '../type';
import type { RadioValue } from '@/components/CustomRadio/types';
import { DepartmentData } from '@/types';

import { CustomRadio } from '@/components/CustomRadio';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { Status } from '@/components/Form/Status';

import BrandAccessLevelModal from './BrandAccessLevelModal';
import LocationModal from './LocationModal';
import TISCAccessLevelModal from './TISCAccessLevelModal';
import styles from './TeamProfilesEntryForm.less';

const GenderRadio = [
  { label: 'Male', value: '1' },
  { label: 'Female', value: '0' },
];

interface TeamProfilesEntryFormValue {
  data: TeamProfileDetailProps;
  setData: (value: TeamProfileDetailProps) => void;
  onCancel: () => void;
  handleInvite: (userId: string) => void;
  userId?: string;
  onSubmit: (value: TeamProfileRequestBody, callBack?: (userId: string) => void) => void;
  submitButtonStatus: boolean;
  AccessLevelDataRole: RadioValue[];
  role: 'TISC' | 'BRAND' | 'DESIGNER';
}

type FieldName = keyof TeamProfileDetailProps;

export const TeamProfilesEntryForm: React.FC<TeamProfilesEntryFormValue> = ({
  data,
  setData,
  onCancel,
  onSubmit,
  submitButtonStatus,
  handleInvite,
  userId,
  AccessLevelDataRole,
  role,
}) => {
  /// for department
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [visible, setVisible] = useState({
    workLocationModal: false,
    accessModal: false,
  });

  const [workLocation, setWorkLocation] = useState({
    label: '',
    value: data.location_id,
    phoneCode: '00',
  });

  const onChangeData = (fieldName: FieldName, fieldValue: any) => {
    setData({
      ...data,
      [fieldName]: fieldValue,
    });
  };

  useEffect(() => {
    getDepartmentList().then(setDepartments);
  }, []);
  useEffect(() => {
    onChangeData('location_id', workLocation.value);
  }, [workLocation]);

  const handleSubmit = (callBack?: (id: string) => void) => {
    onSubmit(
      {
        firstname: data.firstname?.trim() ?? '',
        lastname: data.lastname?.trim() ?? '',
        gender: data.gender === true ? true : false,
        location_id: data.location_id,
        department_id: data.department_id?.trim() ?? '',
        position: data.position?.trim() ?? '',
        email: data.email?.trim() ?? '',
        phone: data.phone?.trim() ?? '',
        mobile: data.mobile?.trim() ?? '',
        role_id: data.role_id,
      },
      callBack,
    );
  };

  // format data
  const departmentData = departments.find((department) => department.id === data.department_id) ?? {
    name: data.department_id,
    id: '',
  };

  return (
    <>
      <EntryFormWrapper
        handleCancel={onCancel}
        handleSubmit={() => handleSubmit()}
        submitButtonStatus={submitButtonStatus}
        customClass={styles.entry_form}>
        {/* First Name */}
        <InputGroup
          label="First Name"
          required
          deleteIcon
          fontLevel={3}
          value={data.firstname}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          onChange={(e) => {
            onChangeData('firstname', e.target.value);
          }}
          onDelete={() => onChangeData('firstname', '')}
          placeholder="member first name"
        />
        {/* Last name */}
        <InputGroup
          label="Last Name"
          required
          deleteIcon
          fontLevel={3}
          value={data.lastname}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          onChange={(e) => {
            onChangeData('lastname', e.target.value);
          }}
          onDelete={() => onChangeData('lastname', '')}
          placeholder="member last name"
        />
        {/* Gender */}
        <FormGroup label="Gender" required={true} layout="vertical" formClass={styles.form_group}>
          <CustomRadio
            options={GenderRadio}
            value={data.gender === true ? '1' : '0'}
            onChange={(radioValue) =>
              onChangeData('gender', radioValue.value === '1' ? true : false)
            }
          />
        </FormGroup>

        {/* Work Location */}
        <InputGroup
          label="Work Location"
          required
          fontLevel={3}
          value={workLocation.label}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          rightIcon
          onRightIconClick={() =>
            setVisible({
              workLocationModal: true,
              accessModal: false,
            })
          }
          placeholder="select from list"
        />
        {/* Department */}
        <FormGroup
          label="Department"
          required={true}
          layout="vertical"
          formClass={`${styles.department} ${
            departmentData.name !== '' ? styles.activeDepartment : ''
          }`}>
          <CollapseRadioList
            options={departments.map((department) => {
              return {
                label: department.name,
                value: department.id,
              };
            })}
            checked={data.department_id}
            onChange={(radioValue) => {
              if (radioValue.value === 'other') {
                onChangeData('department_id', radioValue.label);
              } else {
                onChangeData('department_id', radioValue.value);
              }
            }}
            placeholder={departmentData.name === '' ? 'select from list' : departmentData.name}
            otherInput
          />
        </FormGroup>

        {/* Position / Role */}
        <InputGroup
          label="Position / Role"
          required
          deleteIcon
          fontLevel={3}
          value={data.position}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          onChange={(e) => {
            onChangeData('position', e.target.value);
          }}
          onDelete={() => onChangeData('position', '')}
          placeholder="member position/role"
        />

        {/* Work Email */}
        <InputGroup
          label="Work Email"
          required
          deleteIcon
          fontLevel={3}
          value={data.email}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          onChange={(e) => {
            onChangeData('email', e.target.value);
          }}
          onDelete={() => onChangeData('email', '')}
          placeholder="user work email"
          message={emailMessageError(data.email, MESSAGE_ERROR.EMAIL_UNVALID)}
          messageType={emailMessageErrorType(data.email, 'error', 'normal')}
        />

        {/* Work Phone */}
        <FormGroup label="Work Phone" required layout="vertical" formClass={styles.formGroup}>
          <PhoneInput
            phonePlaceholder="area code / number"
            onChange={(value) => {
              onChangeData('phone', value.phoneNumber);
            }}
            colorPlaceholder="mono"
            containerClass={styles.phoneInputCustom}
            codeReadOnly
            value={{
              zoneCode: workLocation.phoneCode,
              phoneNumber: data.phone,
            }}
            deleteIcon
          />
        </FormGroup>
        {/* Work Mobile */}
        <FormGroup label="Work Mobile" required layout="vertical" formClass={styles.formGroup}>
          <PhoneInput
            phonePlaceholder="mobile number"
            onChange={(value) => {
              onChangeData('mobile', value.phoneNumber);
            }}
            colorPlaceholder="mono"
            containerClass={styles.phoneInputCustom}
            codeReadOnly
            value={{
              zoneCode: workLocation.phoneCode,
              phoneNumber: data.mobile,
            }}
            deleteIcon
          />
        </FormGroup>

        {/* Access Level */}
        <FormGroup
          label="Access Level"
          required={true}
          customIcon={<InfoIcon className={styles.warning_icon} />}
          layout="vertical"
          formClass={`${styles.form_group} ${styles.access_label}`}
          onClick={() =>
            setVisible({
              accessModal: true,
              workLocationModal: false,
            })
          }>
          <CustomRadio
            options={AccessLevelDataRole}
            value={data.role_id}
            onChange={(radioValue) => onChangeData('role_id', radioValue.value)}
          />
        </FormGroup>

        {/* Status */}
        <Status
          value={data.status}
          onClick={() => {
            if (!userId) {
              handleSubmit(handleInvite);
            } else {
              handleInvite(userId);
            }
          }}
          label="Status"
          buttonName="Send Invite"
          text_1="Activated"
          text_2="pending invite"
          formClass={styles.status}
        />
      </EntryFormWrapper>

      {role === 'TISC' ? (
        <TISCAccessLevelModal
          visible={visible.accessModal}
          setVisible={(visibled) =>
            setVisible({
              accessModal: visibled,
              workLocationModal: false,
            })
          }
        />
      ) : role === 'BRAND' ? (
        <BrandAccessLevelModal
          visible={visible.accessModal}
          setVisible={(visibled) =>
            setVisible({
              accessModal: visibled,
              workLocationModal: false,
            })
          }
        />
      ) : null}

      {/* Location Modal */}
      <LocationModal
        visible={visible.workLocationModal}
        setVisible={(visibled) =>
          setVisible({
            accessModal: false,
            workLocationModal: visibled,
          })
        }
        workLocation={workLocation}
        setWorkLocation={setWorkLocation}
      />
    </>
  );
};
