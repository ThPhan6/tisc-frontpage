import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';

import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon.svg';
import { ReactComponent as LockedForgotIcon } from '@/assets/icons/lock-forgot-icon.svg';
import { ReactComponent as LockedIcon } from '@/assets/icons/lock-locked-icon.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-white-icon.svg';

import { getListQuotation } from '../services/api';
import { useBoolean, useString } from '@/helper/hook';
import { isShowErrorMessage, validateEmail } from '@/helper/utils';
import { sample } from 'lodash';

import type { LoginInput, ModalProps, Quotation } from '../types';
import { DataTableResponse } from '@/components/Table/types';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './LoginModal.less';

export interface LoginModalProps extends ModalProps {
  handleSubmitLogin: (data: { email: string; password: string }) => void;
  handleForgotPassword: (email: string) => void;
  type?: string;
}

export const LoginModal: FC<LoginModalProps> = ({
  theme = 'default',
  visible,
  onClose,
  handleSubmitLogin,
  handleForgotPassword,
  type,
}) => {
  const [inputValue, setInputValue] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const verifyEmail = useString('');
  const showForgotPassword = useBoolean(false);
  const [quotation, setQuotation] = useState<Quotation[]>([]);
  const [randomQuotation, setRandomQuotation] = useState<Quotation>();

  const pickRandomQuotation = (quotes: Quotation[]) => {
    const randomQuote = sample(quotes);
    if (randomQuote === randomQuotation && quotes.length > 1) {
      pickRandomQuotation(quotes);
    } else {
      setRandomQuotation(randomQuote);
    }
  };

  useEffect(() => {
    getListQuotation({ page: 1, pageSize: 99999 }, (data: DataTableResponse<Quotation[]>) => {
      setQuotation(data.data);
      pickRandomQuotation(data.data);
    });
  }, []);

  useEffect(() => {
    if (!showForgotPassword.value) {
      verifyEmail.setValue('');
    }
  }, [showForgotPassword.value]);

  useEffect(() => {
    if (!visible && quotation.length) {
      pickRandomQuotation(quotation);
    }
  }, [visible, quotation]);

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

  const handleSubmit = () => {
    if (showForgotPassword.value) {
      handleForgotPassword(verifyEmail.value);
      return;
    }
    handleSubmitLogin({
      email: inputValue.email,
      password: inputValue.password,
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

  const themeStyle = () => (theme === 'default' ? '' : '-dark');

  const widthButtonThemeDark = theme === 'dark' ? '120px' : '112px';

  const contentButtonThemeDark = theme === 'dark' ? 'Let’s do this' : 'Get started';

  return (
    <CustomModal
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      footer={false}
      containerClass={theme === 'dark' ? styles.modal : ''}
      bodyStyle={{
        backgroundColor: theme === 'dark' ? '#000' : '',
        height: '576px',
      }}
      closeIconClass={theme === 'dark' ? styles.closeIcon : ''}>
      <div className={styles.content}>
        <div className={styles.intro}>
          <MainTitle level={2} customClass={styles[`body${themeStyle()}`]}>
            {randomQuotation ? `"${randomQuotation.quotation}"` : ''}
          </MainTitle>
          <BodyText level={2} customClass={styles[`title${themeStyle()}`]}>
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
                containerClass={`
                ${styles.email}
                ${showForgotPassword.value ? styles.disabled : ''}`}
                placeholder="work email"
                prefix={<EmailIcon />}
                focusColor="secondary"
                borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
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
                containerClass={`
                ${styles.password}
                ${showForgotPassword.value ? styles.disabled : ''}`}
                size="large"
                placeholder="password"
                prefix={<LockedIcon />}
                focusColor="secondary"
                borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
                disabled={showForgotPassword.value}
                onChange={handleOnChange}
                onPressEnter={onKeyPress}
                name="password"
              />
            </div>
            <div className={styles['forgot-password']}>
              <div
                className={`
                ${styles.wrapper}
                ${theme === 'dark' ? styles['wrapper-dark'] : ''}
                ${showForgotPassword.value ? styles[`wrapper-active${themeStyle()}`] : ''}
              `}
                onClick={() => showForgotPassword.setValue(!showForgotPassword.value)}>
                <LockedForgotIcon className={styles.icon} />
                <BodyText fontFamily="Roboto" level={4} customClass={styles.text}>
                  Forgot password?
                </BodyText>
              </div>
              {showForgotPassword.value && (
                <CustomInput
                  required
                  fromLandingPage
                  status={isShowErrorMessage('email', verifyEmail.value) ? '' : 'error'}
                  theme={theme}
                  size="large"
                  containerClass={
                    type === 'Tisc Login' ? styles['forgot-input-dark'] : styles['forgot-input']
                  }
                  placeholder="type your work email to verify"
                  focusColor="secondary"
                  borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
                  value={verifyEmail.value}
                  onChange={(e) => verifyEmail.setValue(e.target.value)}
                  onPressEnter={onKeyPress}
                />
              )}
            </div>
          </div>
          <div className={styles.action}>
            <div className={setErrorMessage() ? styles.action_between : styles.action_right}>
              {setErrorMessage() ? (
                <div className={styles.warning}>
                  <WarningIcon />
                  <BodyText level={4} fontFamily="Roboto">
                    {setErrorMessage()}
                  </BodyText>
                </div>
              ) : (
                ''
              )}
              <CustomButton
                disabled={handleDisableButton()}
                buttonClass={styles.submit}
                width={showForgotPassword.value ? '216px' : widthButtonThemeDark}
                onClick={handleSubmit}>
                {showForgotPassword.value ? 'Submit & Check your email' : contentButtonThemeDark}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
