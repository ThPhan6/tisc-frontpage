import styles from './LoginModal.less';
import { CustomModal } from '@/components/Modal';
import { FC, useEffect, useState } from 'react';
import { InputValueProp, LoginModalProps } from '../types';
import { BodyText, MainTitle } from '@/components/Typography';
import { CustomInput } from '@/components/Form/CustomInput';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon.svg';
import { ReactComponent as LockedIcon } from '@/assets/icons/lock-locked-icon.svg';
import { ReactComponent as LockedForgotIcon } from '@/assets/icons/lock-forgot-icon.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { useBoolean, useString } from '@/helper/hook';
import classNames from 'classnames';
import CustomButton from '@/components/Button';
import { ERROR_MESSAGE } from '@/constants/message';
import { validateEmail } from '@/helper/utils';

export const LoginModal: FC<LoginModalProps> = ({
  theme = 'default',
  visible,
  handleSubmitLogin,
}) => {
  const [inputValue, setInputValue] = useState<InputValueProp>({
    email: '',
    password: '',
  });
  const verifyEmail = useString('');
  const showForgotPassword = useBoolean(false);

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
        return ERROR_MESSAGE.EMAIL;
      }
      if (inputValue.password && inputValue.password.length < 8) {
        return ERROR_MESSAGE.PASSWORD;
      }
    }
    if (verifyEmail.value && !validateEmail(verifyEmail.value)) {
      return ERROR_MESSAGE.EMAIL;
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (showForgotPassword.value) {
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

  return (
    <CustomModal
      visible={visible.value}
      onOk={() => visible.setValue(false)}
      onCancel={() => visible.setValue(false)}
      footer={false}
      containerClass={theme === 'dark' && styles.modal}
      bodyStyle={{
        backgroundColor: theme === 'dark' ? '#000' : '',
      }}
      closeIconClass={theme === 'dark' && styles.closeIcon}
    >
      <div className={styles.content}>
        <div className={styles.intro}>
          <MainTitle level={2} customClass={styles[`body${themeStyle()}`]}>
            “Do or do not. There is no try.”
          </MainTitle>
          <BodyText level={2} customClass={styles[`title${themeStyle()}`]}>
            Yoda, Jedi Master
          </BodyText>
        </div>
        <div className={styles.form}>
          <CustomInput
            theme={theme}
            size="large"
            containerClass={classNames(styles.email, showForgotPassword.value && styles.disabled)}
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
            theme={theme}
            type={'password'}
            containerClass={classNames(
              styles.password,
              showForgotPassword.value && styles.disabled,
            )}
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
          <div className={styles['forgot-password']}>
            <div
              className={classNames(
                styles.wrapper,
                styles[`${theme === 'dark' && 'wrapper-dark'}`],
                styles[showForgotPassword.value && `wrapper-active${themeStyle()}`],
              )}
              onClick={() => showForgotPassword.setValue(!showForgotPassword.value)}
            >
              <LockedForgotIcon className={styles.icon} />
              <BodyText fontFamily="Roboto" level={4} customClass={styles.text}>
                Forgot password?
              </BodyText>
            </div>
            {showForgotPassword.value && (
              <CustomInput
                theme={theme}
                size="large"
                containerClass={styles[`forgot-input${themeStyle()}`]}
                placeholder="* type your work email to verify"
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
            width={showForgotPassword.value ? '212px' : theme === 'dark' ? '117px' : '112px'}
            onClick={handleSubmit}
          >
            {showForgotPassword.value
              ? 'Submit & Check your email'
              : theme === 'dark'
              ? 'Let’s do this'
              : 'Get started'}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};
