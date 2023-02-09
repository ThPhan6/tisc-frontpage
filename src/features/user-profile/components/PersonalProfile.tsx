import { FC, useEffect, useState } from 'react';

import { MESSAGE_ERROR, MESSAGE_NOTIFICATION, MESSAGE_TOOLTIP } from '@/constants/message';
import { AVATAR_ACCEPT_TYPES, STATUS_RESPONSE } from '@/constants/util';
import { Tooltip, Upload, UploadProps, message } from 'antd';

import UserIcon from '@/assets/icons/avatar-default.svg';
import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as UploadIcon } from '@/assets/icons/upload-icon.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { updateAvatarTeamProfile, updateTeamProfile } from '../services';
import { useScreen } from '@/helper/common';
import { useBoolean, useCheckPermission, useCustomInitialState } from '@/helper/hook';
import { getBase64, isShowErrorMessage, showImageUrl, validateEmail } from '@/helper/utils';
import { isEqual } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { PhoneInputValueProp } from '@/components/Form/types';

import CustomButton from '@/components/Button';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { BodyText, Title } from '@/components/Typography';

import styles from './PersonalProfile.less';

export type PersonalProfileState = {
  backupEmail: string;
  phoneNumber: string;
  phoneCode: string;
  linkedin: string;
};

const interestedData = [
  { label: 'Brand Factory/Showroom Visits', value: 0 },
  { label: 'Design Conferences/Events/Seminars', value: 1 },
  { label: 'Industry Exhibitions/Trade Shows', value: 2 },
  {
    label: 'Product Launches/Promotions/Workshops',
    value: 3,
  },
  { label: 'Product Recommendations/Updates', value: 4 },
];

export const PersonalProfile: FC<{ contentHeight?: number }> = ({ contentHeight }) => {
  const [fileInput, setFileInput] = useState<any>();
  const { fetchUserInfo, currentUser } = useCustomInitialState();
  const submitButtonStatus = useBoolean();
  const showInterested = useCheckPermission(['Design Admin', 'Design Team']);

  const { isMobile } = useScreen();

  const [inputValue, setInputValue] = useState<PersonalProfileState>({
    backupEmail: '',
    phoneNumber: '',
    phoneCode: '',
    linkedin: '',
  });

  const [selectedInterested, setSelectedIntersted] = useState<CheckboxValue[]>(
    currentUser?.interested?.map((interestedId) => {
      return {
        label: '',
        value: interestedId,
      };
    }) || [],
  );

  const handleUpdateAvatar = (avtFile: File) => {
    getBase64(avtFile).then((base64Image) => {
      const base64 = base64Image.split(',')[1];
      updateAvatarTeamProfile({ avatar: base64 }, (type: STATUS_RESPONSE, msg?: string) => {
        if (type === STATUS_RESPONSE.SUCCESS) {
          message.success(MESSAGE_NOTIFICATION.UPDATE_AVATAR_SUCCESS);
          fetchUserInfo();
        } else {
          message.error(msg || MESSAGE_NOTIFICATION.UPDATE_AVATAR_ERROR);
          setFileInput(undefined);
        }
      });
    });
  };

  useEffect(() => {
    if (currentUser) {
      setInputValue({
        backupEmail: currentUser.backup_email || '',
        phoneNumber: currentUser.personal_mobile,
        phoneCode: currentUser.personal_phone_code || currentUser.phone_code,
        linkedin: currentUser?.linkedin || '',
      });
    }
  }, [currentUser]);

  const setPreviewAvatar = () => {
    if (fileInput) {
      return URL.createObjectURL(fileInput);
    }
    if (currentUser?.avatar) {
      return showImageUrl(currentUser?.avatar);
    }
    return UserIcon;
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isValid = AVATAR_ACCEPT_TYPES.some((imgType) => file.type.includes(imgType));
      if (!isValid) {
        message.error(
          `Only file with the following extensions are allowed: ${AVATAR_ACCEPT_TYPES.join('/')}.`,
        );
        return false;
      }
      setFileInput(file);
      handleUpdateAvatar(file);
      return true;
    },
    multiple: false,
    showUploadList: false,
    openFileDialogOnClick: true,
  };

  const handleSubmit = () => {
    updateTeamProfile(
      {
        backup_email: inputValue.backupEmail.trim(),
        personal_mobile: inputValue.phoneNumber.trim(),
        personal_phone_code: inputValue.phoneCode.trim(),
        linkedin: inputValue.linkedin.trim(),
        interested: selectedInterested.map((interested) => {
          return interested.value as number;
        }),
      },
      (type: STATUS_RESPONSE, msg?: string) => {
        if (type === STATUS_RESPONSE.SUCCESS) {
          message.success(MESSAGE_NOTIFICATION.UPDATE_PERSONAL_PROFILE_SUCCESS);
          fetchUserInfo();
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 3000);
        } else {
          message.error(msg || MESSAGE_NOTIFICATION.UPDATE_PERSONAL_PROFILE_ERROR);
        }
      },
    );
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangePhoneInput = (phoneValue: PhoneInputValueProp) => {
    setInputValue({
      ...inputValue,
      phoneNumber: phoneValue.phoneNumber,
      phoneCode: phoneValue.zoneCode,
    });
  };

  const checkSaveDisabled = () => {
    if (!currentUser) {
      return true;
    }
    const currentUserData: PersonalProfileState = {
      backupEmail: currentUser.backup_email,
      linkedin: currentUser.linkedin,
      phoneNumber: currentUser.personal_mobile,
      phoneCode: currentUser.personal_phone_code || currentUser.phone_code,
    };
    if (
      (currentUser?.interested?.length ===
        selectedInterested.map((item) => {
          return item.value;
        }).length &&
        isEqual(currentUserData, inputValue)) ||
      (inputValue.backupEmail && !validateEmail(inputValue.backupEmail))
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className={styles['personal-container']}>
      <div className={styles.header}>
        <Title level={7} customClass={styles.title}>
          PERSONAL PROFILE
        </Title>
        <Tooltip
          placement="bottomLeft"
          title={MESSAGE_TOOLTIP.PERSONAL_PROFILE}
          align={{
            offset: [-14, -9],
          }}
          overlayInnerStyle={{
            width: isMobile ? '194px' : '240px',
            padding: '8px 19.5px',
          }}
        >
          <WarningIcon className={styles['warning-icon']} />
        </Tooltip>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.content} style={{ height: contentHeight }}>
          <Upload name="avatar-drag-drop" {...uploadProps}>
            <div className={`${styles.avatarContainer}`}>
              <div>
                <img src={setPreviewAvatar()} alt="avatar-upload" />
                {/* <div className={styles.avatarHover}>
                  <BodyText fontFamily="Roboto" level={7} color="mono-color-dark">
                    Drag & drop profile photo
                  </BodyText>
                </div> */}
              </div>
            </div>
          </Upload>

          <FormGroup label="Avatar" formClass={`${styles['form-upload']} ${styles.form}`}>
            <div className={styles['wrapper-upload']}>
              <Upload name="avatar-click" {...uploadProps}>
                <UploadIcon className={styles.icon} />
              </Upload>
            </div>
          </FormGroup>
          <FormGroup
            message={isShowErrorMessage('email', inputValue.backupEmail) ? '' : MESSAGE_ERROR.EMAIL}
            messageType="error"
            label="Backup email"
            layout="vertical"
            formClass={styles.form}
          >
            <CustomInput
              name="backupEmail"
              status={isShowErrorMessage('email', inputValue.backupEmail) ? '' : 'error'}
              borderBottomColor="mono-medium"
              placeholder="personal email"
              value={inputValue.backupEmail}
              onChange={handleOnChange}
            />
          </FormGroup>
          <FormGroup label="Mobile" layout="vertical" formClass={styles.form} messageType="error">
            <PhoneInput
              phonePlaceholder="personal mobile"
              onChange={handleOnChangePhoneInput}
              codeReadOnly={false}
              value={{
                zoneCode: inputValue.phoneCode,
                phoneNumber: inputValue.phoneNumber,
              }}
            />
          </FormGroup>
          <FormGroup label="Linkedin" layout="vertical" formClass={styles.form}>
            <CustomInput
              name="linkedin"
              placeholder="copy/paste personal Linkedin URL link"
              borderBottomColor="mono-medium"
              value={inputValue.linkedin}
              onChange={handleOnChange}
            />
          </FormGroup>
          {showInterested && (
            <div>
              <FormGroup label="I am interested in" layout="vertical" formClass={styles.interested}>
                <CustomCheckbox
                  options={interestedData}
                  isCheckboxList
                  heightItem="36px"
                  checkboxClass={styles.listInterested}
                  onChange={setSelectedIntersted}
                  selected={selectedInterested}
                />
              </FormGroup>
              <BodyText level={6} fontFamily="Roboto">
                Note: By select above options, you are agreeded to receive relevant email newsletter
                and updates.{' '}
              </BodyText>
            </div>
          )}
        </div>
        <div className={styles['wrapper-submit']}>
          {submitButtonStatus.value ? (
            <CustomButton
              buttonClass={styles['submit-success']}
              size="small"
              width="64px"
              icon={<CheckSuccessIcon />}
            />
          ) : (
            <CustomButton
              buttonClass={styles.submit}
              size="small"
              width="64px"
              onClick={handleSubmit}
              disabled={checkSaveDisabled()}
            >
              <BodyText level={6} fontFamily="Roboto">
                Save
              </BodyText>
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
};
