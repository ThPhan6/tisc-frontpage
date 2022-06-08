import CustomButton from '@/components/Button';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, Title } from '@/components/Typography';
import { Tooltip, Upload, UploadProps } from 'antd';
import styles from './styles/PersonalProfile.less';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { ReactComponent as UploadIcon } from '@/assets/icons/upload-icon.svg';
import { MESSAGE_ERROR, MESSAGE_TOOLTIP } from '@/constants/message';
import avatarImg from '@/assets/img-avatar.png';
import type { RcFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import { isShowErrorMessage, validateEmail } from '@/helper/utils';
import { useCustomInitialState } from '@/helper/hook';
import classNames from 'classnames';

export const PersonalProfile = () => {
  const [fileList, setFileList] = useState<any>([]);
  const { initialState } = useCustomInitialState();

  const [inputValue, setInputValue] = useState({
    backupEmail: '',
    mobile: '',
    linkedin: '',
  });

  useEffect(() => {
    setInputValue({
      backupEmail: initialState?.currentUser?.backup_email || '',
      mobile: initialState?.currentUser?.mobile || '',
      linkedin: initialState?.currentUser?.linkedin || '',
    });
  }, []);

  const setPreviewAvatar = () => {
    if (fileList.length > 0) {
      return URL.createObjectURL(fileList[0]);
    }
    if (initialState?.currentUser?.avatar) {
      return initialState?.currentUser?.avatar;
    }
    return avatarImg;
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  const handleSubmit = () => {
    const formData = new FormData();
    fileList.forEach((file: any) => {
      formData.append('files[]', file.originFileObj as RcFile);
    });
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
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
              <Upload
                maxCount={1}
                showUploadList={false}
                // beforeUpload={beforeUpload}
                {...props}
                accept="image/*"
              >
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
            <CustomInput borderBottomColor="mono-medium" value={inputValue.mobile} />
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
              !validateEmail(inputValue.backupEmail) && !inputValue.linkedin && !inputValue.mobile
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
