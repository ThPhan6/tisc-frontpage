import { FC, useEffect, useState } from 'react';

import { MESSAGE_ERROR, MESSAGE_NOTIFICATION } from '@/constants/message';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon.svg';
import { ReactComponent as LockedForgotIcon } from '@/assets/icons/lock-forgot-icon.svg';
import { ReactComponent as LockedIcon } from '@/assets/icons/lock-locked-icon.svg';

import {
  ForgotType,
  forgotPasswordMiddleware,
  loginByBrandOrDesigner,
  loginMiddleware,
} from '../../../pages/LandingPage/services/api';
import { useReCaptcha } from '../hook';
import { useBoolean, useCustomInitialState, useString } from '@/helper/hook';
import { isShowErrorMessage, throttleAction, validateEmail } from '@/helper/utils';
import {
  FooterContent,
  ModalContainer,
  useLandingPageStyles,
} from '@/pages/LandingPage/components/hook';
import { sample } from 'lodash';

import type { LoginInput } from '@/pages/LandingPage/types';
import { useAppSelector } from '@/reducers';
import { closeModal, modalThemeSelector } from '@/reducers/modal';
import { Quotation } from '@/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './LoginModal.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

export const LoginModal: FC<{
  tiscLogin?: boolean;
}> = ({ tiscLogin }) => {
  const { theme, darkTheme, themeStyle } = useAppSelector(modalThemeSelector);
  const popupStylesProps = useLandingPageStyles(darkTheme);

  const quotation = useAppSelector((state) => state.quotation.quotations);

  const { handleReCaptchaVerify } = useReCaptcha();
  const { fetchUserInfo } = useCustomInitialState();

  const [inputValue, setInputValue] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const verifyEmail = useString('');
  const showForgotPassword = useBoolean(false);

  const [randomQuotation, setRandomQuotation] = useState<Quotation>();

  const pickRandomQuotation = () => {
    if (!quotation?.length) {
      return;
    }

    const randomQuote = sample(quotation);
    if (randomQuote === randomQuotation && quotation.length > 1) {
      pickRandomQuotation();
    } else {
      setRandomQuotation(randomQuote);
    }
  };

  useEffect(() => {
    pickRandomQuotation();
  }, [quotation]);

  useEffect(() => {
    if (!showForgotPassword.value) {
      verifyEmail.setValue('');
    }
  }, [showForgotPassword.value]);

  const handleDisableButton = () => {
    if (showForgotPassword.value) {
      if (!verifyEmail.value || !validateEmail(verifyEmail.value)) {
        return true;
      }
    } else {
      if (
        !inputValue.email ||
        !inputValue.password ||
        inputValue.password.length < 8 ||
        !validateEmail(inputValue.email)
      ) {
        return true;
      }
    }
    return false;
  };

  const setErrorMessage = () => {
    if (!showForgotPassword.value) {
      if (inputValue.email && !validateEmail(inputValue.email)) {
        return MESSAGE_ERROR.EMAIL;
      }
      if (inputValue.password && inputValue.password.length < 8) {
        return MESSAGE_ERROR.PASSWORD;
      }
    }
    if (verifyEmail.value && !validateEmail(verifyEmail.value)) {
      return MESSAGE_ERROR.EMAIL;
    }
    return '';
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotPassword = async (email: string) => {
    showPageLoading();
    const captcha = (await handleReCaptchaVerify()) || '';
    forgotPasswordMiddleware(
      { email: email, type: tiscLogin ? ForgotType.TISC : ForgotType.OTHER, captcha: captcha },
      async (type: STATUS_RESPONSE, msg?: string) => {
        if (type === STATUS_RESPONSE.SUCCESS) {
          message.success(MESSAGE_NOTIFICATION.RESET_PASSWORD);
          closeModal();
        } else {
          message.error(msg);
        }
        hidePageLoading();
      },
    );
  };

  const handleLogin = (data: { captcha: string; email: string; password: string }) => {
    showPageLoading();

    const successCallback = async (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.LOGIN_SUCCESS);
        await fetchUserInfo(true);
        closeModal();
      } else {
        message.error(msg);
      }
      hidePageLoading();
    };

    const onLogin = tiscLogin ? loginMiddleware : loginByBrandOrDesigner;
    onLogin(data, successCallback);
  };

  const handleSubmit = async () => {
    if (showForgotPassword.value) {
      handleForgotPassword(verifyEmail.value);
      return;
    }

    const captcha = (await handleReCaptchaVerify()) || '';

    handleLogin({
      email: inputValue.email,
      password: inputValue.password,
      captcha,
    });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (handleDisableButton()) {
        return;
      }
      handleSubmit();
    }
  };

  const getSubmitButtonWidth = () => {
    if (showForgotPassword.value) return '216px';
    return darkTheme ? '120px' : '112px';
  };

  const getSubmitButtonTitle = () => {
    if (showForgotPassword.value) return 'Submit & Check your email';
    return darkTheme ? 'Let’s do this' : 'Get started';
  };

  return (
    <CustomModal {...popupStylesProps}>
      <ModalContainer>
        <div className={styles.content}>
          <div className={styles.intro}>
            <MainTitle level={2} customClass={styles[`body${themeStyle}`]}>
              {randomQuotation ? `"${randomQuotation.quotation}"` : ''}
            </MainTitle>
            <BodyText level={2} customClass={styles[`title${themeStyle}`]}>
              {randomQuotation ? `${randomQuotation.author}, ${randomQuotation.identity}` : ''}
            </BodyText>
          </div>
          <div className={styles.main}>
            <div className={styles.form}>
              <div onClick={() => showForgotPassword.setValue(false)}>
                <CustomInput
                  fromLandingPage
                  status={isShowErrorMessage('email', inputValue.email) ? '' : 'error'}
                  theme={theme}
                  size="large"
                  containerClass={`${styles.email} ${
                    showForgotPassword.value ? styles.disabled : ''
                  }`}
                  placeholder="work email"
                  prefix={<EmailIcon />}
                  focusColor="secondary"
                  borderBottomColor={darkTheme ? 'white' : 'mono'}
                  disabled={showForgotPassword.value}
                  onChange={handleOnChange}
                  onPressEnter={onKeyPress}
                  name="email"
                />
                <CustomInput
                  fromLandingPage
                  status={inputValue.password && inputValue.password.length < 8 ? 'error' : ''}
                  theme={theme}
                  type={'password'}
                  containerClass={`${styles.password} ${
                    showForgotPassword.value ? styles.disabled : ''
                  }`}
                  size="large"
                  placeholder="password"
                  prefix={<LockedIcon />}
                  focusColor="secondary"
                  borderBottomColor={darkTheme ? 'white' : 'mono'}
                  disabled={showForgotPassword.value}
                  onChange={handleOnChange}
                  onPressEnter={onKeyPress}
                  name="password"
                />
              </div>
              <div className={styles['forgot-password']}>
                <div
                  className={`${styles.wrapper} ${styles[`wrapper${themeStyle}`]} ${
                    showForgotPassword.value ? styles[`wrapper-active${themeStyle}`] : ''
                  }
              `}
                  onClick={() => showForgotPassword.setValue(!showForgotPassword.value)}
                >
                  <LockedForgotIcon className={styles.icon} />
                  <BodyText fontFamily="Roboto" level={4} customClass={styles.text}>
                    Forgot password?
                  </BodyText>
                </div>
                {showForgotPassword.value ? (
                  <CustomInput
                    required
                    fromLandingPage
                    status={isShowErrorMessage('email', verifyEmail.value) ? '' : 'error'}
                    theme={theme}
                    size="large"
                    containerClass={
                      tiscLogin ? styles['forgot-input-dark'] : styles['forgot-input']
                    }
                    placeholder="type your work email to verify"
                    focusColor="secondary"
                    borderBottomColor={darkTheme ? 'white' : 'mono'}
                    value={verifyEmail.value}
                    onChange={(e) => verifyEmail.setValue(e.target.value)}
                    onPressEnter={onKeyPress}
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
        <FooterContent
          errorMessage={setErrorMessage()}
          buttonDisabled={handleDisableButton()}
          buttonWidth={getSubmitButtonWidth()}
          submitButtonLabel={getSubmitButtonTitle()}
          onSubmit={throttleAction(handleSubmit)}
        />
      </ModalContainer>
    </CustomModal>
  );
};
