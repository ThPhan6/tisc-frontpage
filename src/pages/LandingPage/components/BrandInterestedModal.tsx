import React, { FC, useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { Checkbox, message } from 'antd';

import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-white-icon.svg';

import { checkEmailAlreadyUsed } from '../services/api';
import { checkValidURL, validateEmail } from '@/helper/utils';
import { debounce } from 'lodash';

import { InformationBooking, ModalProps } from '../types';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import { PoliciesModal } from './PoliciesModal';
import styles from './SignupModal.less';

interface BrandInterestedProps extends ModalProps {
  onChangeValue: (inputValue: InformationBooking) => void;
  inputValue: InformationBooking;
  onOpenCalendar: () => void;
}

export const BrandInterestedModal: FC<BrandInterestedProps> = ({
  visible,
  onClose,
  theme = 'default',
  inputValue,
  onChangeValue,
  onOpenCalendar,
}) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');
  const [openModal, setOpenModal] = useState('');
  const [emailExisted, setEmailExisted] = useState(false);
  const [agreeTisc, setAgreeTisc] = useState(false);

  useEffect(() => {
    if (inputValue.email && validateEmail(inputValue.email)) {
      checkEmailAlreadyUsed(inputValue.email).then((res) => {
        setEmailExisted(res);
      });
    }
  }, [inputValue.email]);

  const getErrorMessage = () => {
    if (inputValue.email && !validateEmail(inputValue.email)) {
      return MESSAGE_ERROR.EMAIL;
    }
    if (inputValue.email && !emailExisted) {
      return MESSAGE_ERROR.EMAIL_ALREADY_USED;
    }
    if (agreeTisc === true && inputValue.agree_tisc === false) {
      return MESSAGE_ERROR.AGREE_TISC;
    }
    return '';
  };

  const onChangeInputValue = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue({ ...inputValue, [e.target.name]: e.target.value });
  }, 300);

  const handleOpenBookingModal = () => {
    if (inputValue.brand_name.trim() === '') {
      return message.error('Brand / company name is required');
    }
    if (inputValue.website === '') {
      return message.error('Company website is required');
    }
    if (!checkValidURL(inputValue.website)) {
      return message.error('Company website must start with "http://" or "https://"');
    }
    if (inputValue.name.trim() === '') {
      return message.error('First name / last name is required');
    }
    if (inputValue.email === '') {
      return message.error(MESSAGE_ERROR.EMAIL_REQUIRED);
    }
    if (inputValue.agree_tisc === false) {
      return setAgreeTisc(true);
    }
    if (!validateEmail(inputValue.email)) {
      return message.error(MESSAGE_ERROR.EMAIL_INVALID);
    }
    if (emailExisted === false) {
      return message.error(MESSAGE_ERROR.EMAIL_ALREADY_USED);
    }
    onOpenCalendar();
    setAgreeTisc(false);
    setEmailExisted(false);
  };

  return (
    <CustomModal
      visible={visible}
      footer={false}
      containerClass={theme === 'dark' && styles.modal}
      bodyStyle={{
        backgroundColor: theme === 'dark' ? '#000' : '',
        height: '576px',
      }}
      closeIconClass={theme === 'dark' && styles.closeIcon}
      onCancel={onClose}>
      <div className={styles.content}>
        <div className={styles.intro}>
          <MainTitle level={2} customClass={styles[`body${themeStyle()}`]}>
            Please fill out the below information, and arrange a product DEMO and Q&A session.
          </MainTitle>
        </div>
        <div className={styles.main}>
          <div className={styles.form}>
            <CustomInput
              fromLandingPage
              theme={theme}
              size="large"
              placeholder="brand / company name"
              prefix={<BrandIcon />}
              borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
              containerClass={styles.brand}
              name="brand_name"
              type={'text'}
              required={true}
              onChange={onChangeInputValue}
            />
            <CustomInput
              fromLandingPage
              theme={theme}
              size="large"
              placeholder="company website"
              prefix={<InternetIcon />}
              borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
              containerClass={styles.website}
              name="website"
              type="text"
              required={true}
              onChange={onChangeInputValue}
            />
            <CustomInput
              fromLandingPage
              theme={theme}
              size="large"
              placeholder="first name / last name"
              prefix={<UserIcon />}
              borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
              containerClass={styles.user}
              name="name"
              type="text"
              required={true}
              onChange={onChangeInputValue}
              autoComplete={'' + Math.random()}
            />
            <CustomInput
              fromLandingPage
              theme={theme}
              type="email"
              containerClass={styles.email}
              size="large"
              placeholder="work email"
              prefix={<EmailIcon />}
              borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
              name="email"
              required={true}
              onChange={onChangeInputValue}
              autoComplete={'' + Math.random()}
            />
            <div
              className={
                agreeTisc === true && inputValue.agree_tisc === false ? styles.errorStatus : ''
              }>
              <Checkbox
                onChange={() => {
                  setAgreeTisc(!agreeTisc);
                  onChangeValue({ ...inputValue, agree_tisc: !inputValue.agree_tisc });
                }}>
                By clicking and continuing, we agree to TISC’s
              </Checkbox>
            </div>
            <div className={styles.customLink}>
              <span onClick={() => setOpenModal('Policies')}>
                Terms of Services, Privacy Policy and Cookie Policy
              </span>
            </div>
          </div>
          <div className={styles.action}>
            <div className={getErrorMessage() ? styles.action_between : styles.action_right}>
              {getErrorMessage() ? (
                <div className={styles.warning}>
                  <WarningIcon />
                  <BodyText level={4} fontFamily="Roboto">
                    {getErrorMessage()}
                  </BodyText>
                </div>
              ) : (
                ''
              )}
              <CustomButton buttonClass={styles.submit} onClick={handleOpenBookingModal}>
                Book a Demo
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
      <PoliciesModal
        visible={openModal === 'Policies'}
        onClose={() => setOpenModal('')}
        theme="dark"
      />
    </CustomModal>
  );
};
