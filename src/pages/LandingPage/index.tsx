import { useEffect, useState } from 'react';

import { MESSAGE_ERROR, MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { Col, Row, message } from 'antd';
import { history } from 'umi';

import graphic from '@/assets/graphic.png';
import { ReactComponent as BinocularsIcon } from '@/assets/icons/binoculars-icon.svg';
import { ReactComponent as CheckAllIcon } from '@/assets/icons/check-all-icon.svg';
import { ReactComponent as GraphicTabletIcon } from '@/assets/icons/graphic-tablet-icon.svg';
import { ReactComponent as LogoBeta } from '@/assets/icons/logo-beta.svg';
import { ReactComponent as PiggyBankIcon } from '@/assets/icons/piggy-bank-icon.svg';
import { ReactComponent as SingleRight } from '@/assets/icons/single-right.svg';
import { ReactComponent as TargetMoneyIcon } from '@/assets/icons/target-money-icon.svg';
import { ReactComponent as TimeMoney } from '@/assets/icons/time-money-icon.svg';

import {
  createPasswordVerify,
  getBooking,
  resetPasswordMiddleware,
  validateToken,
  verifyAccount,
} from './services/api';
import { pushTo } from '@/helper/history';
import { useBoolean, useCustomInitialState, useGetParamId, useQuery } from '@/helper/hook';

import { InformationBooking, ModalOpen, PasswordRequestBody } from './types';
import store from '@/reducers';
import { openModal as openModalAction } from '@/reducers/modal';

import { BrandInterestedModal } from './components/BrandInterestedModal';
import { CalendarModal } from './components/CalendarModal';
import { CancelBookingModal } from './components/CancelBookingModal';
import { NoticeModal } from './components/NoticeModal';
import { PasswordModal } from './components/PasswordModal';
import { VerifyAccount } from './components/VerifyAccount';
import CustomButton from '@/components/Button';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import { AboutPoliciesContactModal } from './AboutPolicesContactModal';
import { LandingPageFooter } from './footer';
import styles from './index.less';
import { getAvailableDateInMonth } from './util';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';
import moment from 'moment';

const DEFAULT_STATE: InformationBooking = {
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

const LandingPage = () => {
  const userEmail = useQuery().get('email');
  const tokenResetPwd = useQuery().get('token');
  const tokenVerification = useQuery().get('verification_token');

  const { fetchUserInfo } = useCustomInitialState();
  const openResetPwd = useBoolean();
  const openVerificationModal = useBoolean();

  const listMenuFooter: ModalOpen[] = ['About', 'Policies', 'Contact', 'Browser Compatibility'];
  const [openModal, setOpenModal] = useState<ModalOpen>('');
  const openVerifyAccountModal = useBoolean();
  const [informationBooking, setInformationBooking] = useState<InformationBooking>(DEFAULT_STATE);
  const openCalendar = useBoolean();
  const bookingId = useGetParamId();
  const isUpdateBooking = bookingId ? true : false;
  const openCancelBooking = useBoolean();

  const handleCloseModal = () => {
    setOpenModal('');
  };

  const handleOpenCalendar = () => {
    setOpenModal('');
    openCalendar.setValue(true);
  };

  useEffect(() => {
    if ((!userEmail || !tokenResetPwd) && history.location.pathname === PATH.resetPassword) {
      history.push(PATH.landingPage);
    } else {
      if (tokenResetPwd) {
        validateToken(tokenResetPwd).then((res) => {
          if (res) {
            return openResetPwd.setValue(res);
          }
          history.push(PATH.landingPage);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  useEffect(() => {
    if (tokenVerification && history.location.pathname !== PATH.createPassword) {
      verifyAccount(tokenVerification).then((success) => {
        if (success) {
          openVerifyAccountModal.setValue(success);
        } else {
          history.replace(PATH.landingPage);
          message.error(MESSAGE_ERROR.VERIFY_TOKEN_EXPIRED);
        }
      });
      return;
    } else if (tokenVerification && history.location.pathname === PATH.createPassword) {
      validateToken(tokenVerification).then((success) => {
        if (success) {
          openVerificationModal.setValue(true);
        } else {
          message.error(MESSAGE_ERROR.VERIFY_TOKEN_EXPIRED);
        }
      });
    }
    if (history.location.pathname === PATH.verifyAccount) {
      history.push(PATH.landingPage);
    }
  }, [tokenVerification]);

  useEffect(() => {
    if (bookingId) {
      getBooking(bookingId).then((res) => {
        if (res) {
          setInformationBooking(res);
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
    createPasswordVerify(tokenVerification ?? '', data).then((isSuccess) => {
      if (isSuccess) {
        fetchUserInfo(true);
        hidePageLoading();
        openVerificationModal.setValue(false);
        history.replace(PATH.landingPage);
      }
    });
  };

  const openLoginModal = () =>
    store.dispatch(
      openModalAction({ type: 'Login', autoHeightDrawer: true, noBorderDrawerHeader: true }),
    );

  const renderFeatures = (data: any[]) => {
    return (
      <div className={styles.feature}>
        {data.map((feature, index) => (
          <div className={styles.item} key={index}>
            <feature.icon className={styles.icon} />
            <BodyText level={4} fontFamily="Roboto">
              {feature.content}
            </BodyText>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <Row justify="center">
          <Col span={22}>
            <div className={styles.header}>
              <LogoBeta />
              <CustomButton
                icon={<SingleRight />}
                width="104px"
                buttonClass={styles['login-button']}
                onClick={openLoginModal}>
                Log in
              </CustomButton>
            </div>
            <div className={styles.content}>
              <div className={styles.summary}>
                <div className={styles.message}>
                  <MainTitle customClass={styles.title}>SEARCH, SELECT & SPECIFY</MainTitle>
                  <BodyText customClass={styles.description}>
                    TISC is a free product information and specification platform for the design and
                    construction industry that serves all manufacturer BRANDS and professional
                    DESIGNERS.
                  </BodyText>
                </div>
                <img src={graphic} />
              </div>
              <div className={styles['user-group']}>
                <div className={styles.brands}>
                  <BodyText level={3} fontFamily="Roboto">
                    For
                  </BodyText>
                  <Title level={3} customClass={styles['group-name']}>
                    Brands
                  </Title>
                  <BodyText level={3} fontFamily="Roboto">
                    A dedicated platform assists the company in managing the product lines,
                    monetizing the projects, generating intelligence, and growing your business.
                  </BodyText>
                  {renderFeatures([
                    { icon: BinocularsIcon, content: 'Obtain project visibility & updates' },
                    { icon: TargetMoneyIcon, content: 'Generate potential sales leads' },
                    { icon: PiggyBankIcon, content: 'Save operational cost & resources' },
                  ])}
                  <div className={styles['button-wrapper']}>
                    <CustomButton
                      width="144px"
                      properties="warning"
                      size="large"
                      buttonClass={styles['action-button']}
                      onClick={() => setOpenModal('Brand Interested')}>
                      INTERESTED
                    </CustomButton>
                  </div>
                </div>
                <div className={styles.designer}>
                  <BodyText level={3} fontFamily="Roboto">
                    For
                  </BodyText>
                  <Title level={3} customClass={styles['group-name']}>
                    Designer
                  </Title>
                  <BodyText level={3} fontFamily="Roboto">
                    An always up-to-date material library that helps the team search, select and
                    specify the products for their next project while automating the workflow.
                  </BodyText>
                  {renderFeatures([
                    {
                      icon: GraphicTabletIcon,
                      content: 'Convenience to specify & easy to track',
                    },
                    { icon: CheckAllIcon, content: 'Product accuracy & completeness' },
                    { icon: TimeMoney, content: 'Increase team productivity at no cost' },
                  ])}
                  <div className={styles['button-wrapper']}>
                    <CustomButton
                      width="144px"
                      properties="warning"
                      size="large"
                      buttonClass={styles['action-button']}
                      onClick={() =>
                        store.dispatch(
                          openModalAction({ type: 'Designer Signup', autoHeightDrawer: true }),
                        )
                      }>
                      SIGN ME UP
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <LandingPageFooter setOpenModal={setOpenModal} listMenuFooter={listMenuFooter} />

      <AboutPoliciesContactModal visible={openModal} onClose={handleCloseModal} />

      <NoticeModal
        visible={openModal === 'Browser Compatibility'}
        onClose={handleCloseModal}
        theme="dark"
      />

      {userEmail ? (
        <PasswordModal
          visible={openResetPwd}
          handleSubmit={handleResetPassword}
          data={{
            email: userEmail,
            token: tokenResetPwd || '',
          }}
          type="reset"
        />
      ) : null}
      <PasswordModal
        visible={openVerificationModal}
        handleSubmit={handleVerifyAccount}
        data={{
          email: userEmail ?? '',
          token: tokenVerification || '',
        }}
        type="create"
      />
      {openVerifyAccountModal.value === true ? (
        <VerifyAccount
          visible={openVerifyAccountModal}
          handleSubmit={openLoginModal}
          openLogin={openLoginModal}
        />
      ) : null}
      {openCalendar.value ? (
        <CalendarModal
          visible={openCalendar.value}
          onClose={() => {
            openCalendar.setValue(false);
            setInformationBooking(DEFAULT_STATE);
          }}
          informationBooking={informationBooking}
          isUpdateBooking={isUpdateBooking}
          onChangeValue={(value) => setInformationBooking(value)}
        />
      ) : null}

      <CancelBookingModal
        visible={openCancelBooking.value}
        onClose={() => openCancelBooking.setValue(false)}
        informationBooking={informationBooking}
      />
      {openModal === 'Brand Interested' ? (
        <BrandInterestedModal
          visible={openModal === 'Brand Interested'}
          onClose={handleCloseModal}
          theme="default"
          onChangeValue={(value) => setInformationBooking(value)}
          inputValue={informationBooking}
          onOpenCalendar={handleOpenCalendar}
        />
      ) : null}
    </div>
  );
};

export default LandingPage;
