import CustomButton from '@/components/Button';
import LoadingPageCustomize from '@/components/LoadingPage';
import { BodyText, MainTitle, Title } from '@/components/Typography';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { useBoolean, useCustomInitialState, useQuery } from '@/helper/hook';
import {
  redirectAfterBrandLogin,
  redirectAfterDesignerLogin,
  redirectAfterLogin,
} from '@/helper/utils';
import { Col, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import graphic from '../../assets/graphic.png';
import { ReactComponent as BinocularsIcon } from '../../assets/icons/binoculars-icon.svg';
import { ReactComponent as CheckAllIcon } from '../../assets/icons/check-all-icon.svg';
import { ReactComponent as GraphicTabletIcon } from '../../assets/icons/graphic-tablet-icon.svg';
import { ReactComponent as LogoBeta } from '../../assets/icons/logo-beta.svg';
import { ReactComponent as PiggyBankIcon } from '../../assets/icons/piggy-bank-icon.svg';
import { ReactComponent as SingleRight } from '../../assets/icons/single-right.svg';
import { ReactComponent as TargetMoneyIcon } from '../../assets/icons/target-money-icon.svg';
import { ReactComponent as TimeMoney } from '../../assets/icons/time-money-icon.svg';
import { AboutModal } from './components/AboutModal';
import { BrandInterestedModal } from './components/BrandInterestedModal';
import { ContactModal } from './components/ContactModal';
import { LoginModal } from './components/LoginModal';
import { NoticeModal } from './components/NoticeModal';
import { PoliciesModal } from './components/PoliciesModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { CreatePasswordModal } from './components/CreatePasswordModal';
import { SignupModal } from './components/SignupModal';
import styles from './index.less';
import {
  forgotPasswordMiddleware,
  loginMiddleware,
  resetPasswordMiddleware,
  validateResetToken,
  createPasswordVerify,
  loginByBrandOrDesigner,
} from './services/api';
import type {
  LoginInput,
  ModalOpen,
  ResetPasswordRequestBody,
  CreatePasswordRequestBody,
  LoginResponseProp,
} from './types';

const LandingPage = () => {
  const userEmail = useQuery().get('email');
  const tokenResetPwd = useQuery().get('token');
  const tokenVerification = useQuery().get('verification_token');

  const { fetchUserInfo } = useCustomInitialState();
  const openResetPwd = useBoolean();
  const openVerificationModal = useBoolean();
  const isLoading = useBoolean();
  const [openModal, setOpenModal] = useState<ModalOpen>('');
  const listMenuFooter: ModalOpen[] = ['About', 'Policies', 'Contact', 'Browser Compatibility'];
  const handleCloseModal = () => {
    setOpenModal('');
  };

  useEffect(() => {
    if ((!userEmail || !tokenResetPwd) && history.location.pathname === PATH.resetPassword) {
      history.push(PATH.landingPage);
      return;
    } else {
      if (tokenResetPwd) {
        validateResetToken(tokenResetPwd).then((res) => {
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
    if (!tokenVerification && history.location.pathname === PATH.createPassword) {
      history.push(PATH.landingPage);
      return;
    } else {
      if (tokenVerification) {
        openVerificationModal.setValue(true);
      }
    }
  }, [tokenVerification]);

  const handleSubmitLogin = (data: LoginInput) => {
    isLoading.setValue(true);
    if (openModal === 'Tisc Login') {
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
    } else {
      loginByBrandOrDesigner(
        data,
        async (type: STATUS_RESPONSE, msg?: string, response?: LoginResponseProp) => {
          if (type === STATUS_RESPONSE.SUCCESS) {
            message.success(MESSAGE_NOTIFICATION.LOGIN_SUCCESS);
            if (response?.type === 'design') {
              await fetchUserInfo();
              redirectAfterDesignerLogin();
            } else if (response?.type === 'brand') {
              await fetchUserInfo();
              redirectAfterBrandLogin();
            }
          } else {
            message.error(msg);
          }
          isLoading.setValue(false);
        },
      );
    }
  };

  const handleForgotPassword = (email: string) => {
    isLoading.setValue(true);
    forgotPasswordMiddleware({ email: email }, async (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        setOpenModal('');
        message.success(MESSAGE_NOTIFICATION.RESET_PASSWORD);
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  const handleResetPassword = (data: ResetPasswordRequestBody) => {
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

  const handleVerifyAccount = (data: CreatePasswordRequestBody) => {
    isLoading.setValue(true);
    createPasswordVerify(tokenVerification ?? '', data).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        redirectAfterLogin();
      }
    });
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
                onClick={() => setOpenModal('Login')}
              >
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
                      onClick={() => setOpenModal('Brand Interested')}
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
                  <div className={styles.feature}>
                    {[
                      {
                        icon: GraphicTabletIcon,
                        content: 'Convenience to specify & easy to track',
                      },
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
                      onClick={() => setOpenModal('Designer Signup')}
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
      <div className={styles['footer-container']}>
        <Row justify="center">
          <Col span={22}>
            <div className={styles.footer}>
              <BodyText level={5} fontFamily="Roboto">
                © TISC 2022
              </BodyText>
              <div className={styles['menu-wrapper']}>
                <div className={styles.menu}>
                  {listMenuFooter.map((item, index) => (
                    <BodyText
                      key={index}
                      level={5}
                      fontFamily="Roboto"
                      customClass={styles.item}
                      onClick={() => setOpenModal(item)}
                    >
                      {item}
                    </BodyText>
                  ))}
                </div>

                <BodyText
                  level={5}
                  fontFamily="Roboto"
                  customClass={styles['tisc-login']}
                  onClick={() => setOpenModal('Tisc Login')}
                >
                  TISC Log in
                </BodyText>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <LoginModal
        visible={openModal === 'Login' || openModal === 'Tisc Login'}
        onClose={handleCloseModal}
        theme={openModal === 'Tisc Login' ? 'dark' : 'default'}
        handleSubmitLogin={handleSubmitLogin}
        handleForgotPassword={handleForgotPassword}
        type={openModal}
      />
      <AboutModal visible={openModal === 'About'} onClose={handleCloseModal} theme="dark" />
      <PoliciesModal visible={openModal === 'Policies'} onClose={handleCloseModal} theme="dark" />
      <ContactModal visible={openModal === 'Contact'} onClose={handleCloseModal} theme="dark" />
      <NoticeModal
        visible={openModal === 'Browser Compatibility'}
        onClose={handleCloseModal}
        theme="dark"
      />
      <SignupModal
        visible={openModal === 'Designer Signup'}
        onClose={handleCloseModal}
        theme="default"
      />
      <BrandInterestedModal
        visible={openModal === 'Brand Interested'}
        onClose={handleCloseModal}
        theme="default"
      />
      {userEmail && (
        <ResetPasswordModal
          visible={openResetPwd}
          handleSubmit={handleResetPassword}
          resetData={{
            email: userEmail,
            token: tokenResetPwd || '',
          }}
        />
      )}
      <CreatePasswordModal
        visible={openVerificationModal}
        handleSubmit={handleVerifyAccount}
        data={{
          email: userEmail ?? '',
          token: tokenVerification || '',
        }}
      />
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default LandingPage;
