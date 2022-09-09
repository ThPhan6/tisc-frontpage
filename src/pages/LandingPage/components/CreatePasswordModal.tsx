import type { FC } from 'react';
import { useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';

import { ReactComponent as LockedIcon } from '@/assets/icons/circle-pass-icon.svg';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-white-icon.svg';

import { pushTo } from '@/helper/history';
import { isShowErrorMessage, validatePassword } from '@/helper/utils';

import type { CreatePasswordRequestBody, ResetPasswordInput } from '../types';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './ResetPasswordModal.less';

interface CreatePasswordModalProps {
  data: {
    email: string;
    token: string;
  };
  visible: {
    value: boolean;
    setValue: (value: boolean) => void;
  };
  handleSubmit: (data: CreatePasswordRequestBody) => void;
}

export const CreatePasswordModal: FC<CreatePasswordModalProps> = ({
  visible,
  data,
  handleSubmit,
}) => {
  const [resetInputValue, setResetInputValue] = useState<ResetPasswordInput>({
    password: '',
    confirmPassword: '',
  });

  const setErrorMessage = () => {
    if (resetInputValue.password && !validatePassword(resetInputValue.password)) {
      return MESSAGE_ERROR.PASSWORD;
    }
    if (
      resetInputValue.confirmPassword &&
      resetInputValue.confirmPassword !== resetInputValue.password
    ) {
      return MESSAGE_ERROR.CONFIRM_PASSWORD;
    }
    return '';
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetInputValue({
      ...resetInputValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleDisableButton = () => {
    if (
      !validatePassword(resetInputValue.password) ||
      resetInputValue.confirmPassword !== resetInputValue.password
    ) {
      return true;
    }
    return false;
  };

  const handleOnSubmit = () => {
    handleSubmit({
      password: resetInputValue.password,
      confirmed_password: resetInputValue.confirmPassword,
    });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (handleDisableButton()) {
        return;
      }
      handleOnSubmit();
    }
  };

  return (
    <CustomModal
      visible={visible.value}
      onOk={() => visible.setValue(false)}
      onCancel={() => {
        visible.setValue(false);
        pushTo(PATH.landingPage);
      }}
      bodyStyle={{ height: '576px' }}
      footer={false}>
      <div className={styles.content}>
        <div className={styles.intro}>
          <MainTitle level={2} customClass={styles.body}>
            Set Account Password
          </MainTitle>
          <BodyText level={2} customClass={styles.title}>
            (Strong password mixes characters, numbers and upper & lower case letters.)
          </BodyText>
        </div>
        <div className={styles.form}>
          <CustomInput
            size="large"
            containerClass={styles.email}
            placeholder="work email"
            prefix={<EmailIcon />}
            name="email"
            borderBottomColor="mono"
            readOnly
            value={data.email}
          />
          <CustomInput
            required
            fromLandingPage
            containerClass={styles.password}
            type={'password'}
            size="large"
            placeholder="password"
            prefix={<LockedIcon />}
            focusColor="secondary"
            name="password"
            borderBottomColor="mono"
            onChange={handleOnChange}
            onPressEnter={onKeyPress}
            status={isShowErrorMessage('password', resetInputValue.password) ? '' : 'error'}
          />
          <CustomInput
            required
            fromLandingPage
            type={'password'}
            size="large"
            placeholder="Confirm password"
            prefix={<LockedIcon />}
            focusColor="secondary"
            name="confirmPassword"
            borderBottomColor="mono"
            onChange={handleOnChange}
            onPressEnter={onKeyPress}
            status={
              resetInputValue.confirmPassword &&
              resetInputValue.confirmPassword !== resetInputValue.password
                ? 'error'
                : ''
            }
          />
        </div>
        <div className={styles.action}>
          <div>
            {setErrorMessage() && (
              <div className={styles.warning}>
                <WarningIcon />
                <BodyText level={4} fontFamily="Roboto">
                  {setErrorMessage()}
                </BodyText>
              </div>
            )}
          </div>
          <CustomButton
            disabled={handleDisableButton()}
            buttonClass={styles.submit}
            width={'128px'}
            onClick={handleOnSubmit}>
            Save
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};
