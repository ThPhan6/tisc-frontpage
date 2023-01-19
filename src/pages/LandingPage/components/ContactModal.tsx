import { useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { message } from 'antd';

import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as MessageIcon } from '@/assets/icons/message-icon-18px.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';

import { useReCaptcha } from '../hook';
import { contact } from '../services/api';
import { ModalContainer, useLandingPageStyles } from './hook';
import { getEmailMessageError } from '@/helper/utils';

import { ContactRequestBody } from '../types';
import { useAppSelector } from '@/reducers';
import { closeModal, modalThemeSelector } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './ContactModal.less';
import buttonStyles from './index.less';

export const ContactModal = () => {
  const { theme, darkTheme, themeStyle } = useAppSelector(modalThemeSelector);
  const popupStylesProps = useLandingPageStyles(darkTheme);
  const { handleReCaptchaVerify } = useReCaptcha();

  const [valueForm, setValueForm] = useState<ContactRequestBody>({
    name: '',
    email: '',
    inquiry: '',
  });

  const handleOnChangeValueForm = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => {
    setValueForm({ ...valueForm, [e.target.name]: e.target.value });
  };

  const handleSubmitContact = async () => {
    /// check email
    const invalidEmail = getEmailMessageError(valueForm.email, MESSAGE_ERROR.EMAIL_INVALID);
    if (invalidEmail) {
      message.error(invalidEmail);
      return;
    }
    const captcha = (await handleReCaptchaVerify()) || '';
    contact({
      email: valueForm.email,
      name: valueForm.name,
      inquiry: valueForm.inquiry,
      captcha: captcha,
    }).then((res) => {
      if (res) {
        closeModal();
        setValueForm({
          name: '',
          email: '',
          inquiry: '',
        });
      }
    });
  };
  return (
    <CustomModal {...popupStylesProps}>
      <ModalContainer>
        <div className={styles.content}>
          <div className={styles.intro}>
            <MainTitle level={1} customClass={styles[`body${themeStyle}`]}>
              We love to hear from you.
            </MainTitle>
          </div>
          <div className={styles.form}>
            <CustomInput
              fromLandingPage
              theme={theme}
              size="large"
              placeholder="first name / last name"
              prefix={<UserIcon />}
              focusColor="secondary"
              borderBottomColor={darkTheme ? 'white' : 'mono'}
              containerClass={styles.user}
              name="name"
              type={'text'}
              required={true}
              onChange={handleOnChangeValueForm}
              value={valueForm.name}
            />
            <CustomInput
              fromLandingPage
              theme={theme}
              type={'email'}
              containerClass={styles.email}
              size="large"
              placeholder="contact email"
              prefix={<EmailIcon />}
              focusColor="secondary"
              borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
              name="email"
              required={true}
              onChange={handleOnChangeValueForm}
              value={valueForm.email}
            />
            <div className={styles.wrapper}>
              <MessageIcon />
              <BodyText level={4} fontFamily="Roboto" customClass={styles[`body${themeStyle}`]}>
                Message
              </BodyText>
            </div>
            <div>
              <CustomTextArea
                showCount
                placeholder="type here..."
                maxLength={250}
                borderBottomColor="mono-medium"
                name="inquiry"
                onChange={handleOnChangeValueForm}
                value={valueForm.inquiry}
              />
            </div>
          </div>
        </div>

        <div className={buttonStyles.button}>
          <CustomButton buttonClass={buttonStyles.submit} onClick={handleSubmitContact}>
            Thank you
          </CustomButton>
        </div>
      </ModalContainer>
    </CustomModal>
  );
};
