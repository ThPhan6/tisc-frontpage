import CustomButton from '@/components/Button';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, Title } from '@/components/Typography';
import { message, Tooltip, Upload, UploadProps } from 'antd';
import styles from './styles/PersonalProfile.less';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { ReactComponent as UploadIcon } from '@/assets/icons/upload-icon.svg';
import { MESSAGE_ERROR, MESSAGE_NOTIFICATION, MESSAGE_TOOLTIP } from '@/constants/message';
import avatarImg from '@/assets/img-avatar.png';
import { FC, useEffect, useState } from 'react';
import { isShowErrorMessage, showImageUrl, validateEmail } from '@/helper/utils';
import { useCustomInitialState } from '@/helper/hook';
import classNames from 'classnames';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { updateAvatarTeamProfile, updateTeamProfile } from './services/api';
import { STATUS_RESPONSE } from '@/constants/util';
import { PersonalProfileProps } from './types';
import { PhoneInputValueProp } from '@/components/Form/types';

export const PersonalProfile: FC<PersonalProfileProps> = ({ isLoading }) => {
  const [fileInput, setFileInput] = useState<any>();
  const { initialState, fetchUserInfo } = useCustomInitialState();

  const [inputValue, setInputValue] = useState({
    backupEmail: '',
    mobile: {
      zoneCode: '',
      phoneNumber: '',
    },
    linkedin: '',
  });

  useEffect(() => {
    setInputValue({
      backupEmail: initialState?.currentUser?.backup_email || '',
      mobile: {
        zoneCode: '',
        phoneNumber: initialState?.currentUser?.personal_mobile || '',
      },
      linkedin: initialState?.currentUser?.linkedin || '',
    });
  }, []);

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
    if (initialState?.currentUser?.avatar) {
      return showImageUrl(initialState?.currentUser?.avatar);
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
    const bodyData = {
      backup_email: inputValue.backupEmail,
      personal_mobile: inputValue.mobile.phoneNumber,
      linkedin: inputValue.linkedin,
      zone_code: inputValue.mobile.zoneCode,
    };
    updateTeamProfile(bodyData, () => {});
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangePhoneInput = (value: PhoneInputValueProp) => {
    setInputValue({
      ...inputValue,
      mobile: value,
    });
  };

  return (
    <div className={styles['personal-container']}>
      <div className={styles.header}>
        <Title level={7} customClass={styles.title}>
          PERSONAL PROFILE
        </Title>
        <Tooltip placement="bottomLeft" title={MESSAGE_TOOLTIP.PERSONAL_PROFILE}>
          <WarningIcon className={styles['warning-icon']} />
        </Tooltip>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.avatar}>
            <img src={setPreviewAvatar()} alt="avatar-upload" className={styles.img} />
          </div>
          <FormGroup label="Avatar" formClass={classNames(styles['form-upload'], styles.form)}>
            <div className={styles['wrapper-upload']}>
              <Upload maxCount={1} showUploadList={false} {...props} accept=".png">
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
          <FormGroup label="Mobile" layout="vertical" formClass={styles.form}>
            <PhoneInput phonePlaceholder="personal mobile" onChange={handleOnChangePhoneInput} />
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
          <CustomButton
            buttonClass={styles.submit}
            size="small"
            width="64px"
            onClick={handleSubmit}
            disabled={
              !validateEmail(inputValue.backupEmail) &&
              !inputValue.linkedin &&
              !(inputValue.mobile.phoneNumber && inputValue.mobile.zoneCode)
            }
          >
            <BodyText level={6} fontFamily="Roboto">
              Save
            </BodyText>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
