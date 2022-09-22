import { useEffect, useState } from 'react';

import { DEFAULT_TEAMPROFILE, DEFAULT_TEAMPROFILE_WITH_GENDER } from '../constants/entryForm';
import { BrandAccessLevelDataRole, TISCAccessLevelDataRole } from '../constants/role';
import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { message } from 'antd';
import { useHistory } from 'umi';

import { ReactComponent as InfoIcon } from '@/assets/icons/info-icon.svg';

import {
  useBoolean,
  useCheckPermission,
  useCustomInitialState,
  useGetParamId,
} from '@/helper/hook';
import { getEmailMessageError, getEmailMessageErrorType } from '@/helper/utils';
import { getDepartmentList } from '@/services';

import { TeamProfileDetailProps, TeamProfileRequestBody } from '../types';
import { useAppSelector } from '@/reducers';
import { DepartmentData } from '@/types';

import { CustomRadio } from '@/components/CustomRadio';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { Status } from '@/components/Form/Status';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { createTeamProfile, getOneTeamProfile, inviteUser, updateTeamProfile } from '../api';
import BrandAccessLevelModal from './BrandAccessLevelModal';
import LocationModal from './LocationModal';
import TISCAccessLevelModal from './TISCAccessLevelModal';
import styles from './TeamProfilesEntryForm.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const GenderRadio = [
  { label: 'Male', value: '1' },
  { label: 'Female', value: '0' },
];

type FieldName = keyof TeamProfileDetailProps;

const TeamProfilesEntryForm = () => {
  const userProfileId = useAppSelector((state) => state.user.user?.id);
  const { fetchUserInfo } = useCustomInitialState();
  const history = useHistory();
  const userIdParam = useGetParamId();
  const isUpdate = userIdParam ? true : false;

  const isTISCAdmin = useCheckPermission('TISC Admin');
  const isBrandAdmin = useCheckPermission('Brand Admin');
  /// for access level
  const accessLevelDataRole = isTISCAdmin
    ? TISCAccessLevelDataRole
    : isBrandAdmin
    ? BrandAccessLevelDataRole
    : [];
  /// for user role path
  const userRolePath = isTISCAdmin
    ? PATH.tiscTeamProfile
    : isBrandAdmin
    ? PATH.brandTeamProfile
    : '';

  const submitButtonStatus = useBoolean(false);
  const [loadedData, setLoadedData] = useState(false);
  const [data, setData] = useState<TeamProfileDetailProps>(
    isUpdate ? DEFAULT_TEAMPROFILE : DEFAULT_TEAMPROFILE_WITH_GENDER,
  );

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
    if (userIdParam) {
      getOneTeamProfile(userIdParam).then((res) => {
        if (res) {
          setData(res);
          setLoadedData(true);
        }
      });
    }
    getDepartmentList().then(setDepartments);
  }, []);

  useEffect(() => {
    setWorkLocation((prevState) => ({ ...prevState, value: data.location_id }));
  }, [data.location_id]);

  useEffect(() => {
    onChangeData('location_id', workLocation.value);
  }, [workLocation]);

  const handleCreateData = (
    submitData: TeamProfileRequestBody,
    callBack?: (userIdParam: string) => void,
  ) => {
    createTeamProfile(submitData).then((teamProfile) => {
      hidePageLoading();
      if (teamProfile) {
        submitButtonStatus.setValue(true);
        if (callBack) {
          callBack(teamProfile.id ?? '');
        } else {
          history.replace(userRolePath);
        }
      }
    });
  };

  const handleUpdateData = (submitData: TeamProfileRequestBody) => {
    updateTeamProfile(userIdParam, submitData).then((isSuccess) => {
      hidePageLoading();
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        const isUpdateCurrentUser = userIdParam === userProfileId;
        if (isUpdateCurrentUser) {
          fetchUserInfo();
        }
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 1000);
      }
    });
  };

  const handleSubmit = (callBack?: (id: string) => void) => {
    /// check email
    const invalidEmail = getEmailMessageError(data.email, MESSAGE_ERROR.EMAIL_INVALID);

    if (invalidEmail) {
      message.error(invalidEmail);
      return;
    }

    showPageLoading();

    const body: TeamProfileRequestBody = {
      firstname: data.firstname?.trim() ?? '',
      lastname: data.lastname?.trim() ?? '',
      gender: Boolean(data.gender),
      location_id: data.location_id,
      department_id: data.department_id?.trim() ?? '',
      position: data.position?.trim() ?? '',
      email: data.email?.trim() ?? '',
      phone: data.phone?.trim() ?? '',
      mobile: data.mobile?.trim() ?? '',
      role_id: data.role_id,
    };

    if (isUpdate) {
      handleUpdateData(body);
    } else {
      handleCreateData(body, callBack);
    }
  };

  const handleInvite = (usrId: string) => {
    inviteUser(usrId);
    if (!isUpdate) {
      history.replace(userRolePath);
    }
  };

  const handleSendInvite = () => {
    if (userIdParam) {
      handleInvite(userIdParam);
    } else {
      handleSubmit(handleInvite);
    }
  };

  // format data
  const departmentData = departments.find((department) => department.id === data.department_id) ?? {
    name: data.department_id,
    id: '',
  };

  if (isUpdate && !loadedData) {
    return null;
  }

  return (
    <div>
      <TableHeader title="TEAM PROFILES" rightAction={<CustomPlusButton disabled />} />

      <EntryFormWrapper
        handleCancel={history.goBack}
        handleSubmit={() => handleSubmit()}
        submitButtonStatus={submitButtonStatus.value}
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
            value={data.gender ? '1' : '0'}
            onChange={(radioValue) => onChangeData('gender', radioValue.value === '1')}
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
          message={getEmailMessageError(data.email, MESSAGE_ERROR.EMAIL_INVALID)}
          messageType={getEmailMessageErrorType(data.email, 'error', 'normal')}
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
            options={accessLevelDataRole}
            value={data.role_id}
            onChange={(radioValue) => onChangeData('role_id', radioValue.value)}
          />
        </FormGroup>

        {/* Status */}
        <Status
          value={data.status}
          onClick={handleSendInvite}
          label="Status"
          buttonName="Send Invite"
          text_1="Activated"
          text_2="pending invite"
          formClass={styles.status}
        />
      </EntryFormWrapper>

      {isTISCAdmin ? (
        <TISCAccessLevelModal
          visible={visible.accessModal}
          setVisible={(visibled) =>
            setVisible({
              accessModal: visibled,
              workLocationModal: false,
            })
          }
        />
      ) : null}

      {isBrandAdmin ? (
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
    </div>
  );
};

export default TeamProfilesEntryForm;
