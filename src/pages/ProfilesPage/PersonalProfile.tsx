import CustomButton from '@/components/Button';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, Title } from '@/components/Typography';
import { message, Tooltip, Upload, UploadProps } from 'antd';
import styles from './styles/PersonalProfile.less';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { ReactComponent as UploadIcon } from '@/assets/icons/upload-icon.svg';
import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { MESSAGE_ERROR, MESSAGE_NOTIFICATION, MESSAGE_TOOLTIP } from '@/constants/message';
import avatarImg from '@/assets/img-avatar.png';
import { FC, useEffect, useState } from 'react';
import { isShowErrorMessage, showImageUrl, validateEmail } from '@/helper/utils';
import { useBoolean, useCustomInitialState } from '@/helper/hook';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { updateAvatarTeamProfile, updateTeamProfile } from './services/api';
import { STATUS_RESPONSE } from '@/constants/util';
import { PhoneInputValueProp } from '@/components/Form/types';
import { isEqual } from 'lodash';

export type PersonalProfileState = {
  backupEmail: string;
  phoneNumber: string;
  linkedin: string;
};

export interface PersonalProfileProps {
  isLoading: {
    value: boolean;
    setValue: (value: boolean) => void;
  };
}

export const PersonalProfile: FC<PersonalProfileProps> = ({ isLoading }) => {
  const [fileInput, setFileInput] = useState<any>();
  const { fetchUserInfo, currentUser } = useCustomInitialState();
  const submitButtonStatus = useBoolean();

  const [inputValue, setInputValue] = useState<PersonalProfileState>({
    backupEmail: '',
    phoneNumber: '',
    linkedin: '',
  });

  useEffect(() => {
    if (currentUser) {
      setInputValue({
        backupEmail: currentUser.backup_email || '',
        phoneNumber: currentUser.personal_mobile,
        linkedin: currentUser?.linkedin || '',
      });
    }
  }, [currentUser]);

  const handleUpdateAvatar = () => {
    const formData = new FormData();
    formData.append('avatar', fileInput);
    isLoading.setValue(true);
    updateAvatarTeamProfile(formData, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.UPDATE_AVATAR_SUCCESS);
        fetchUserInfo();
      } else {
        message.error(msg || MESSAGE_NOTIFICATION.UPDATE_AVATAR_ERROR);
      }
      isLoading.setValue(false);
    });
  };

  useEffect(() => {
    if (fileInput) {
      handleUpdateAvatar();
    }
  }, [fileInput]);

  const setPreviewAvatar = () => {
    // if (fileInput) {
    //   return URL.createObjectURL(fileInput);
    // }
    if (currentUser?.avatar) {
      return showImageUrl(currentUser?.avatar);
    }
    return avatarImg;
  };
  const props: UploadProps = {
    beforeUpload: (file) => {
      setFileInput(file);
      return false;
    },
  };

  const handleSubmit = () => {
    isLoading.setValue(true);
    updateTeamProfile(
      {
        backup_email: inputValue.backupEmail,
        personal_mobile: inputValue.phoneNumber,
        linkedin: inputValue.linkedin,
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
        isLoading.setValue(false);
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
    };
    if (
      isEqual(currentUserData, inputValue) ||
      (inputValue.backupEmail && !validateEmail(inputValue.backupEmail)) ||
      !inputValue.phoneNumber
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
            width: '240px',
            height: '96px',
            padding: '8px 19.5px',
            fontWeight: '300',
            fontSize: '12px',
            lineHeight: '20px',
            letterSpacing: '0.24px',
          }}
        >
          <WarningIcon className={styles['warning-icon']} />
        </Tooltip>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.avatar}>
            <img src={setPreviewAvatar()} alt="avatar-upload" className={styles.img} />
          </div>
          <FormGroup label="Avatar" formClass={`${styles['form-upload']} ${styles.form}`}>
            <div className={styles['wrapper-upload']}>
              <Upload maxCount={1} showUploadList={false} {...props} accept=".png,.jpg,.jpeg,.webp">
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
              codeReadOnly
              value={{
                zoneCode: currentUser?.phone_code || '',
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
