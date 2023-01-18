import { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { Checkbox, message } from 'antd';

import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as LockedIcon } from '@/assets/icons/lock-locked-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';

import { useBoolean } from '@/helper/hook';
import { isShowErrorMessage, validateEmail } from '@/helper/utils';
import {
  FooterContent,
  ModalContainer,
  useLandingPageStyles,
} from '@/pages/LandingPage/components/hook';
import { checkEmailAlreadyUsed, signUpDesigner } from '@/pages/LandingPage/services/api';
import { debounce } from 'lodash';

import { useAppSelector } from '@/reducers';
import { landingPagePropsSelector } from '@/reducers/landingpage';
import { closeModal, modalThemeSelector } from '@/reducers/modal';

import { CustomInput } from '@/components/Form/CustomInput';
import { CustomModal } from '@/components/Modal';
import { MainTitle } from '@/components/Typography';
import { usePoliciesModal } from '@/pages/LandingPage/components/PoliciesModal';

import styles from './SignupModal.less';

interface SignUpFormState {
  firstname: string;
  email: string;
  password: string;
  confirmed_password: string;
  agree_tisc: boolean;
}

const DEFAULT_STATE: SignUpFormState = {
  email: '',
  password: '',
  firstname: '',
  confirmed_password: '',
  agree_tisc: false,
};

export const SignupModal = () => {
  const { theme, darkTheme, themeStyle } = useAppSelector(modalThemeSelector);

  const { openPoliciesModal, renderPoliciesModal } = usePoliciesModal();
  const popupStylesProps = useLandingPageStyles(darkTheme);

  const [formInput, setFormInput] = useState<SignUpFormState>(DEFAULT_STATE);
  const [agreeTisc, setAgreeTisc] = useState(false);
  const isLoading = useBoolean();
  const [emailExisted, setEmailExisted] = useState(false);
  const { captcha, setRefreshReCaptcha } = useAppSelector(landingPagePropsSelector);

  useEffect(() => {
    if (formInput.email && validateEmail(formInput.email)) {
      checkEmailAlreadyUsed(formInput.email).then((res) => {
        setEmailExisted(res);
      });
    }
  }, [formInput.email]);

  const handleOnChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  }, 300);

  const handleAgreeTisc = () => {
    setAgreeTisc(!agreeTisc);
    setFormInput({ ...formInput, agree_tisc: !formInput.agree_tisc });
  };

  const getErrorMessage = () => {
    if (formInput.confirmed_password && formInput.password !== formInput.confirmed_password) {
      return MESSAGE_ERROR.CONFIRM_PASSWORD;
    }
    if (formInput.email && !validateEmail(formInput.email)) {
      return MESSAGE_ERROR.EMAIL;
    }
    if (formInput.email && !emailExisted) {
      return MESSAGE_ERROR.EMAIL_ALREADY_USED;
    }
    if (agreeTisc === true && formInput.agree_tisc === false) {
      return MESSAGE_ERROR.AGREE_TISC;
    }
    return '';
  };

  const handleSubmit = () => {
    if (formInput.firstname === '') {
      return message.error(MESSAGE_ERROR.FIRST_NAME);
    }
    if (formInput.email === '') {
      return message.error(MESSAGE_ERROR.EMAIL_REQUIRED);
    }
    if (formInput.password.length < 8) {
      return message.error(MESSAGE_ERROR.PASSWORD_CHARACTER);
    }
    if (formInput.password !== formInput.confirmed_password) {
      return message.error(MESSAGE_ERROR.CONFIRM_PASSWORD);
    }
    if (formInput.agree_tisc === false) {
      return setAgreeTisc(true);
    }
    isLoading.setValue(true);
    signUpDesigner({
      firstname: formInput.firstname,
      email: formInput.email,
      password: formInput.password,
      confirmed_password: formInput.confirmed_password,
      captcha: captcha,
    }).then((res) => {
      if (res) {
        closeModal();
        setFormInput(DEFAULT_STATE);
        setAgreeTisc(false);
        setEmailExisted(false);
      }
      isLoading.setValue(false);
    });
    setRefreshReCaptcha();
  };

  return (
    <>
      <CustomModal {...popupStylesProps}>
        <ModalContainer>
          <div className={styles.content}>
            <div className={styles.intro}>
              <MainTitle level={2} customClass={styles[`body${themeStyle}`]}>
                Please fill out the below information, and check your email for verification.
              </MainTitle>
            </div>
            <div className={styles.main}>
              <div className={styles.form}>
                <CustomInput
                  fromLandingPage
                  theme={theme}
                  size="large"
                  placeholder="first name / last name"
                  prefix={<UserIcon />}
                  borderBottomColor={darkTheme ? 'white' : 'mono'}
                  containerClass={styles.brand}
                  name="firstname"
                  type={'text'}
                  required={true}
                  onChange={handleOnChange}
                />
                <CustomInput
                  autoComplete={'' + Math.random()}
                  fromLandingPage
                  theme={theme}
                  size="large"
                  placeholder="work email"
                  prefix={<EmailIcon />}
                  borderBottomColor={darkTheme ? 'white' : 'mono'}
                  containerClass={styles.website}
                  name="email"
                  type="email"
                  required={true}
                  onChange={handleOnChange}
                  status={isShowErrorMessage('email', formInput.email) ? '' : 'error'}
                />
                <CustomInput
                  autoComplete={'' + Math.random()}
                  fromLandingPage
                  theme={theme}
                  size="large"
                  placeholder="password"
                  prefix={<LockedIcon />}
                  borderBottomColor={darkTheme ? 'white' : 'mono'}
                  containerClass={styles.user}
                  name="password"
                  type="password"
                  required={true}
                  onChange={handleOnChange}
                />
                <CustomInput
                  fromLandingPage
                  theme={theme}
                  type="password"
                  name="confirmed_password"
                  containerClass={styles.email}
                  size="large"
                  placeholder="confirm password"
                  prefix={<LockedIcon />}
                  borderBottomColor={darkTheme ? 'white' : 'mono'}
                  required={true}
                  onChange={handleOnChange}
                  status={
                    formInput.confirmed_password &&
                    formInput.password !== formInput.confirmed_password
                      ? 'error'
                      : ''
                  }
                />
                <div
                  className={
                    agreeTisc === true && formInput.agree_tisc === false ? styles.errorStatus : ''
                  }
                >
                  <Checkbox onChange={handleAgreeTisc}>
                    By clicking and continuing, we agree TISC’s
                  </Checkbox>
                </div>

                <div className={styles.customLink}>
                  <span onClick={openPoliciesModal}>
                    Terms of Services, Privacy Policy and Cookie Policy
                  </span>
                </div>
              </div>
            </div>
          </div>

          <FooterContent
            errorMessage={getErrorMessage()}
            submitButtonLabel="Let’s be productive"
            onSubmit={handleSubmit}
          />
        </ModalContainer>
      </CustomModal>
      ,{renderPoliciesModal()}
    </>
  );
};
