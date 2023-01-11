import React, { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { Checkbox, message } from 'antd';
import { history } from 'umi';

import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';

import { checkEmailAlreadyUsed, getBooking } from '../services/api';
import { FooterContent, ModalContainer, useLandingPageStyles } from './hook';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { checkValidURL, validateEmail } from '@/helper/utils';
import { debounce } from 'lodash';

import { InformationBooking } from '../types';
import { CustomInputProps } from '@/components/Form/types';
import { useAppSelector } from '@/reducers';
import { modalThemeSelector } from '@/reducers/modal';

import { CustomInput } from '@/components/Form/CustomInput';
import { CustomModal } from '@/components/Modal';
import { MainTitle } from '@/components/Typography';

import { getAvailableDateInMonth } from '../util';
import { useCalendarModal } from './CalendarModal';
import { usePoliciesModal } from './PoliciesModal';
import styles from './SignupModal.less';
import moment from 'moment';

export const DEFAULT_STATE: InformationBooking = {
  brand_name: '',
  website: '',
  name: '',
  email: '',
  agree_tisc: false,
  date: getAvailableDateInMonth(moment().add(24, 'hours')),
  slot: -1,
  timezone: 'Asia/Singapore',
  id: '',
  time_text: '',
  start_time_text: '',
  end_time_text: '',
};

export const BrandInterestedModal = () => {
  const { theme, darkTheme, themeStyle } = useAppSelector(modalThemeSelector);

  const [emailExisted, setEmailExisted] = useState(false);
  const [agreeTisc, setAgreeTisc] = useState(false);

  const bookingId = useGetParamId();

  const openCancelBooking = useBoolean();
  const openCalendar = useBoolean();

  /// booking information
  const [inputValue, setInputValue] = useState<InformationBooking>(DEFAULT_STATE);

  const { openPoliciesModal, renderPoliciesModal } = usePoliciesModal();
  const { openCalendarModal, renderCalendarModal } = useCalendarModal(inputValue, setInputValue);

  const onCloseModal = () => {
    setInputValue(DEFAULT_STATE);
  };

  const popupStylesProps = useLandingPageStyles(darkTheme, onCloseModal);

  useEffect(() => {
    if (inputValue.email && validateEmail(inputValue.email)) {
      checkEmailAlreadyUsed(inputValue.email).then((res) => {
        setEmailExisted(res);
      });
    }
  }, [inputValue.email]);

  useEffect(() => {
    if (bookingId) {
      getBooking(bookingId).then((res) => {
        if (res) {
          setInputValue(res);
          if (history.location.pathname.indexOf('cancel') !== -1) {
            openCancelBooking.setValue(true);
          }
          if (history.location.pathname.indexOf('re-schedule') !== -1) {
            openCalendar.setValue(true);
          }
        } else {
          pushTo(PATH.landingPage);
        }
      });
    }
  }, []);

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

  const onChangeValue = (value: InformationBooking) => setInputValue(value);

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
      return message.error('Invalid Website');
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
    /// closing another modal
    // closeModal();

    openCalendarModal();
    setAgreeTisc(false);
    setEmailExisted(false);
  };

  const contentProps: CustomInputProps = {
    fromLandingPage: true,
    theme: theme,
    borderBottomColor: darkTheme ? 'white' : 'mono',
    onChange: onChangeInputValue,
    required: true,
    size: 'large',
  };

  return (
    <>
      <CustomModal {...popupStylesProps}>
        <ModalContainer>
          <div className={styles.content}>
            <div className={styles.intro}>
              <MainTitle level={2} customClass={styles[`body${themeStyle}`]}>
                Please fill out the below information, and arrange a product DEMO and Q&A session.
              </MainTitle>
            </div>
            <div className={styles.main}>
              <div className={styles.form}>
                <CustomInput
                  {...contentProps}
                  placeholder="brand / company name"
                  prefix={<BrandIcon />}
                  containerClass={styles.brand}
                  name="brand_name"
                  type="text"
                />
                <CustomInput
                  {...contentProps}
                  placeholder="company website"
                  prefix={<InternetIcon />}
                  containerClass={styles.website}
                  name="website"
                  type="text"
                />
                <CustomInput
                  {...contentProps}
                  placeholder="first name / last name"
                  prefix={<UserIcon />}
                  containerClass={styles.user}
                  name="name"
                  autoComplete={'' + Math.random()}
                  type="text"
                />
                <CustomInput
                  {...contentProps}
                  containerClass={styles.email}
                  placeholder="work email"
                  prefix={<EmailIcon />}
                  name="email"
                  autoComplete={'' + Math.random()}
                  type="email"
                />
                <div
                  className={
                    agreeTisc === true && inputValue.agree_tisc === false ? styles.errorStatus : ''
                  }
                >
                  <Checkbox
                    onChange={() => {
                      setAgreeTisc(!agreeTisc);
                      onChangeValue({ ...inputValue, agree_tisc: !inputValue.agree_tisc });
                    }}
                  >
                    By clicking and continuing, we agree to TISC’s
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
            submitButtonLabel="Book a Demo"
            onSubmit={handleOpenBookingModal}
          />
        </ModalContainer>
      </CustomModal>

      {renderPoliciesModal()}

      {renderCalendarModal()}
    </>
  );
};
