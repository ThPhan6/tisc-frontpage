import CustomButton from '@/components/Button';
import styles from './index.less';
import { ReactComponent as LogoBeta } from '../../assets/icons/logo-beta.svg';
import { ReactComponent as SingleRight } from '../../assets/icons/single-right.svg';
import { ReactComponent as BinocularsIcon } from '../../assets/icons/binoculars-icon.svg';
import { ReactComponent as CheckAllIcon } from '../../assets/icons/check-all-icon.svg';
import { ReactComponent as PiggyBankIcon } from '../../assets/icons/piggy-bank-icon.svg';
import { ReactComponent as TimeMoney } from '../../assets/icons/time-money-icon.svg';
import { ReactComponent as TargetMoneyIcon } from '../../assets/icons/target-money-icon.svg';
import { ReactComponent as GraphicTabletIcon } from '../../assets/icons/graphic-tablet-icon.svg';
import graphic from '../../assets/graphic.png';
import { BodyText, MainTitle, Title } from '@/components/Typography';
import { LoginModal } from './components/LoginModal';
import { useBoolean, useCustomInitialState, useQuery } from '@/helper/hook';
import { loginMiddleware, forgotPasswordMiddleware, resetPasswordMiddleware } from './services/api';
import { message } from 'antd';
import { history } from 'umi';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { STATUS_RESPONSE } from '@/constants/util';
import LoadingPageCustomize from '@/components/LoadingPage';
import { PATH } from '@/constants/path';
import { useEffect } from 'react';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import type { LoginBodyProp, ResetPasswordBodyProp } from './types';
import { redirectAfterLogin } from '@/helper/utils';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { NoticeModal } from './components/NoticeModal';
import { PoliciesModal } from './components/PoliciesModal';

const LandingPage = () => {
  const emailResetPwd = useQuery().get('email');
  const tokenResetPwd = useQuery().get('token');

  const { fetchUserInfo } = useCustomInitialState();
  const openTiscLogin = useBoolean();
  const openResetPwd = useBoolean();
  const isLoading = useBoolean();
  const openTiscAbout = useBoolean();
  const openTiscContact = useBoolean();
  const openTiscNotice = useBoolean();
  const openTiscPolicies = useBoolean();

  useEffect(() => {
    if ((!emailResetPwd || !tokenResetPwd) && history.location.pathname === PATH.resetPassword) {
      history.push(PATH.landingPage);
      return;
    } else {
      openResetPwd.setValue(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailResetPwd]);

  const handleSubmitLogin = (data: LoginBodyProp) => {
    isLoading.setValue(true);
    loginMiddleware(data, async (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.LOGIN_SUCCESS);
        await fetchUserInfo();
        redirectAfterLogin();
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  const handleForgotPassword = (email: string) => {
    isLoading.setValue(true);
    forgotPasswordMiddleware({ email: email }, async (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        openTiscLogin.setValue(false);
        message.success(MESSAGE_NOTIFICATION.RESET_PASSWORD);
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  const handleResetPassword = (data: ResetPasswordBodyProp) => {
    isLoading.setValue(true);
    resetPasswordMiddleware(data, async (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.RESET_PASSWORD_SUCCESS);
        await fetchUserInfo();
        redirectAfterLogin();
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  const handleOnClick = (item: string) => {
    switch (item) {
      case 'About':
        openTiscAbout.setValue(true);
        openTiscContact.setValue(false);
        openTiscNotice.setValue(false);
        openTiscPolicies.setValue(false);
        break;
      case 'Policies':
        openTiscAbout.setValue(false);
        openTiscContact.setValue(false);
        openTiscNotice.setValue(false);
        openTiscPolicies.setValue(true);
        break;
      case 'Contact':
        openTiscContact.setValue(true);
        openTiscAbout.setValue(false);
        openTiscNotice.setValue(false);
        openTiscPolicies.setValue(false);
        break;
      case 'Browser Compatibility':
        openTiscAbout.setValue(false);
        openTiscNotice.setValue(true);
        openTiscContact.setValue(false);
        openTiscPolicies.setValue(false);
      default:
        break;
    }
  };
  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <div className={styles.header}>
          <LogoBeta />
          <CustomButton icon={<SingleRight />} width="104px" buttonClass={styles['login-button']}>
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
                A dedicated platform assists the company in managing the product lines, monetizing
                the projects, generating intelligence, and growing your business.
              </BodyText>
              <div className={styles.feature}>
                {[
                  { icon: BinocularsIcon, content: 'Obtain project visibility & updates' },
                  { icon: TargetMoneyIcon, content: 'Generate potential sales leads' },
                  { icon: PiggyBankIcon, content: 'Save operational cost & resources' },
                ].map((feature, index) => (
                  <div className={styles.item} key={index}>
                    <feature.icon className={styles.icon} />
                    <BodyText level={4} fontFamily="Roboto">
                      {feature.content}
                    </BodyText>
                  </div>
                ))}
              </div>
              <div className={styles['button-wrapper']}>
                <CustomButton
                  width="144px"
                  properties="warning"
                  size="large"
                  buttonClass={styles['action-button']}
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
                An always up-to-date material library that helps the team search, select and specify
                the products for their next project while automating the workflow.
              </BodyText>
              <div className={styles.feature}>
                {[
                  { icon: GraphicTabletIcon, content: 'Convenience to specify & easy to track' },
                  { icon: CheckAllIcon, content: 'Product accuracy & completeness' },
                  { icon: TimeMoney, content: 'Increase team productivity at no cost' },
                ].map((feature, index) => (
                  <div className={styles.item} key={index}>
                    <feature.icon className={styles.icon} />
                    <BodyText level={4} fontFamily="Roboto">
                      {feature.content}
                    </BodyText>
                  </div>
                ))}
              </div>
              <div className={styles['button-wrapper']}>
                <CustomButton
                  width="144px"
                  properties="warning"
                  size="large"
                  buttonClass={styles['action-button']}
                >
                  INTERESTED
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['footer-container']}>
        <div className={styles.footer}>
          <BodyText level={5} fontFamily="Roboto">
            © TISC 2022
          </BodyText>
          <div className={styles['menu-wrapper']}>
            <div className={styles.menu}>
              {['About', 'Policies', 'Contact', 'Browser Compatibility'].map((item, index) => (
                <BodyText
                  key={index}
                  level={5}
                  fontFamily="Roboto"
                  customClass={styles.item}
                  onClick={() => handleOnClick(item)}
                >
                  {item}
                </BodyText>
              ))}
            </div>

            <BodyText
              level={5}
              fontFamily="Roboto"
              customClass={styles['tisc-login']}
              onClick={() => {
                openTiscLogin.setValue(true);
              }}
            >
              TISC Log in
            </BodyText>
          </div>
        </div>
      </div>
      <LoginModal
        visible={openTiscLogin}
        theme="dark"
        handleSubmitLogin={handleSubmitLogin}
        handleForgotPassword={handleForgotPassword}
      />
      <AboutModal visible={openTiscAbout} theme="dark" />
      <ContactModal visible={openTiscContact} theme="dark" />
      <NoticeModal visible={openTiscNotice} theme="dark" />
      <PoliciesModal visible={openTiscPolicies} theme="dark" />
      {emailResetPwd && (
        <ResetPasswordModal
          visible={openResetPwd}
          handleSubmit={handleResetPassword}
          resetData={{
            email: emailResetPwd,
            token: tokenResetPwd || '',
          }}
        />
      )}
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default LandingPage;
