import { useEffect } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { Col, Row, message } from 'antd';
import { history, useLocation } from 'umi';

import graphic from '@/assets/graphic.png';
import { ReactComponent as BinocularsIcon } from '@/assets/icons/binoculars-icon.svg';
import { ReactComponent as CheckAllIcon } from '@/assets/icons/check-all-icon.svg';
import { ReactComponent as GraphicTabletIcon } from '@/assets/icons/graphic-tablet-icon.svg';
import { ReactComponent as LogoBeta } from '@/assets/icons/logo-beta.1.svg';
import { ReactComponent as PiggyBankIcon } from '@/assets/icons/piggy-bank-icon.svg';
import { ReactComponent as SingleRight } from '@/assets/icons/single-right.svg';
import { ReactComponent as TargetMoneyIcon } from '@/assets/icons/target-money-icon.svg';
import { ReactComponent as TimeMoney } from '@/assets/icons/time-money-icon.svg';

import { getBooking, getListQuotation, validateToken, verifyAccount } from './services/api';
import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useGetParamId, useQuery } from '@/helper/hook';

import store from '@/reducers';
import { ModalType, openModal } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import { LandingPageFooter } from './footer';
import styles from './index.less';

const LandingPage = () => {
  const location = useLocation();
  const url = location.search;
  const emailMatch = url.match(/email=([^&]+)/);
  const userEmail = emailMatch ? decodeURIComponent(emailMatch[1]) : null;
  const tokenResetPwd = useQuery().get('token');
  const tokenVerification = useQuery().get('verification_token');

  const listMenuFooter: ModalType[] = ['About', 'Policies', 'Contact', 'Browser Compatibility'];

  const isMobile = useScreen().isMobile;

  const bookingId = useGetParamId();

  useEffect(() => {
    getListQuotation();
  }, []);

  // You can use useEffect to trigger the verification as soon as the component being loaded

  useEffect(() => {
    if ((!userEmail || !tokenResetPwd) && history.location.pathname === PATH.resetPassword) {
      history.push(PATH.landingPage);
    } else {
      if (tokenResetPwd) {
        validateToken(tokenResetPwd).then((res) => {
          if (res) {
            store.dispatch(
              openModal({
                type: 'Reset Password',
                props: {
                  email: userEmail || '',
                  token: tokenResetPwd || '',
                  passwordType: 'reset',
                },
                noBorderDrawerHeader: true,
              }),
            );
          } else {
            history.push(PATH.landingPage);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  useEffect(() => {
    if (!tokenVerification) {
      if (history.location.pathname === PATH.verifyAccount) {
        history.push(PATH.landingPage);
      }
      return;
    }

    const isCreatePassword = history.location.pathname === PATH.createPassword;
    const handleVerifyToken = isCreatePassword ? validateToken : verifyAccount;
    const verifyTokenCallback = (success: boolean) => {
      if (success) {
        store.dispatch(
          openModal({
            type: isCreatePassword ? 'Reset Password' : 'Verify Account',
            props: isCreatePassword
              ? {
                  email: userEmail || '',
                  token: tokenVerification,
                  passwordType: 'create',
                }
              : undefined,
            noBorderDrawerHeader: true,
          }),
        );
      } else {
        message.error(MESSAGE_ERROR.VERIFY_TOKEN_EXPIRED);
        if (isCreatePassword === false) {
          history.replace(PATH.landingPage);
        }
      }
    };

    handleVerifyToken(tokenVerification).then(verifyTokenCallback);
  }, [tokenVerification]);

  /// handle booking
  useEffect(() => {
    if (bookingId) {
      getBooking(bookingId).then((res) => {
        if (res) {
          if (history.location.pathname.indexOf('cancel') !== -1) {
            store.dispatch(
              openModal({
                type: 'Cancel Booking',
                title: 'Cancel Booking',
                props: { informationBooking: res },
              }),
            );
          }
          if (history.location.pathname.indexOf('re-schedule') !== -1) {
            store.dispatch(
              openModal({
                type: 'Calendar',
                props: {
                  informationBooking: res,
                  reScheduleBooking: true,
                },
              }),
            );
          }
        } else {
          pushTo(PATH.landingPage);
        }
      });
    }
  }, []);

  const openLoginModal = () => {
    store.dispatch(openModal({ type: 'Login', noBorderDrawerHeader: true }));
  };

  const openBrandInterested = () =>
    store.dispatch(
      openModal({
        type: 'Brand Interested',
        noBorderDrawerHeader: true,
      }),
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
                onClick={openLoginModal}
              >
                Log in
              </CustomButton>
            </div>
            <div className={styles.content}>
              <div
                className={styles.summary}
                style={{ flexDirection: isMobile ? 'column-reverse' : undefined }}
              >
                <div
                  className={styles.message}
                  style={{ textAlign: isMobile ? 'center' : undefined }}
                >
                  <MainTitle customClass={styles.title}>SEARCH, SELECT & SPECIFY</MainTitle>
                  <BodyText customClass={styles.description}>
                    TISC is a free product information and specification platform for the design and
                    construction industry that serves all manufacturer BRANDS and professional
                    DESIGNERS.
                  </BodyText>
                </div>
                <img src={graphic} className={styles.noneImage} />
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
                      onClick={openBrandInterested}
                    >
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
                          openModal({
                            type: 'Designer Signup',
                            noBorderDrawerHeader: true,
                          }),
                        )
                      }
                    >
                      SIGN ME UP
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <LandingPageFooter listMenuFooter={listMenuFooter} />
    </div>
  );
};

export default LandingPage;
