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
import { useBoolean } from '@/helper/hook';

const LandingPage = () => {
  const openLogin = useBoolean();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <LogoBeta />
        <CustomButton
          onClick={() => openLogin.setValue(true)}
          icon={<SingleRight />}
          width="104px"
          buttonClass={styles['login-button']}
        >
          Log in
        </CustomButton>
      </div>
      <div className={styles.main}>
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
                  width="140px"
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
        <div className={styles.footer}>
          <BodyText level={5} fontFamily="Roboto">
            © TISC 2022
          </BodyText>
          <div className={styles['menu-wrapper']}>
            <div className={styles.menu}>
              {['About', 'Policies', 'Contact'].map((item, index) => (
                <BodyText key={index} level={5} fontFamily="Roboto" customClass={styles.item}>
                  {item}
                </BodyText>
              ))}
            </div>
            <BodyText level={5} fontFamily="Roboto" customClass={styles['tisc-login']}>
              TISC Log in
            </BodyText>
          </div>
        </div>
      </div>
      <LoginModal visible={openLogin} />
    </div>
  );
};

export default LandingPage;
