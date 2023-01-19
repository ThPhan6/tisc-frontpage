import { useState } from 'react';

import { MESSAGE_ERROR, MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { history } from 'umi';

import { ReactComponent as LockedIcon } from '@/assets/icons/circle-pass-icon.svg';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon.svg';

import { useReCaptcha } from '../hook';
import { createPasswordVerify, resetPasswordMiddleware } from '../services/api';
import { FooterContent, ModalContainer, useLandingPageStyles } from './hook';
import { pushTo } from '@/helper/history';
import { useCustomInitialState } from '@/helper/hook';
import { isShowErrorMessage, validatePassword } from '@/helper/utils';

import { PasswordInput, PasswordRequestBody } from '../types';
import { useAppSelector } from '@/reducers';
import { closeModal, modalPropsSelector } from '@/reducers/modal';

import { CustomInput } from '@/components/Form/CustomInput';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './PasswordModal.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

export const PasswordModal = () => {
  const { fetchUserInfo } = useCustomInitialState();

  const { email, token, passwordType } = useAppSelector(modalPropsSelector);
  const { handleReCaptchaVerify } = useReCaptcha();
  const popupStylesProps = useLandingPageStyles(false, () => {
    pushTo(PATH.landingPage);
  });

  const [resetInputValue, setResetInputValue] = useState<PasswordInput>({
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

  const handleResetPassword = (data: PasswordRequestBody) => {
    showPageLoading();
    resetPasswordMiddleware(data, async (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.RESET_PASSWORD_SUCCESS);
        await fetchUserInfo(true);
      } else {
        message.error(msg);
      }
      hidePageLoading();
    });
  };

  const handleVerifyAccount = (data: PasswordRequestBody) => {
    showPageLoading();
    createPasswordVerify(token ?? '', data).then((isSuccess) => {
      if (isSuccess) {
        fetchUserInfo(true);
        hidePageLoading();
        closeModal();
        history.replace(PATH.landingPage);
      }
    });
  };

  const handleOnSubmit = async () => {
    const handleSubmit = passwordType === 'create' ? handleVerifyAccount : handleResetPassword;
    const captcha = (await handleReCaptchaVerify()) || '';
    handleSubmit({
      password: resetInputValue.password,
      confirmed_password: resetInputValue.confirmPassword,
      reset_password_token: token,
      captcha: captcha,
    });
    closeModal();
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
    <CustomModal {...popupStylesProps}>
      <ModalContainer>
        <div className={styles.content}>
          <div className={styles.intro}>
            <MainTitle level={2} customClass={styles.body}>
              Set Account Password
            </MainTitle>
            <BodyText level={2} customClass={styles.title}>
              (Strong password mixes characters, numbers and upper & lower case letters.)
            </BodyText>
          </div>
          <div className={styles.main}>
            <div className={styles.form}>
              <CustomInput
                size="large"
                containerClass={styles.email}
                placeholder="work email"
                prefix={<EmailIcon />}
                name="email"
                borderBottomColor="mono"
                readOnly
                value={email}
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
          </div>
        </div>

        <FooterContent
          errorMessage={setErrorMessage()}
          onSubmit={handleOnSubmit}
          buttonDisabled={handleDisableButton()}
          buttonWidth={'128px'}
          submitButtonLabel={passwordType === 'create' ? 'Save' : 'Save / Log in'}
        />
      </ModalContainer>
    </CustomModal>
  );
};
