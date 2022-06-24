import styles from './SignupModal.less';
import { CustomModal } from '@/components/Modal';
import { MainTitle } from '@/components/Typography';
import { CustomInput } from '@/components/Form/CustomInput';
import CustomButton from '@/components/Button';
import { FC, useState } from 'react';
import { ContactModalProps } from '../types';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';
import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { ReactComponent as LockedIcon } from '@/assets/icons/lock-locked-icon.svg';
import classNames from 'classnames';
import { Checkbox } from 'antd';
import { useBoolean } from '@/helper/hook';
import { PoliciesModal } from './PoliciesModal';

export const SignupModal: FC<ContactModalProps> = ({ visible, theme = 'default', type }) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');
  const openTiscPolicies = useBoolean();
  const [border, setBorder] = useState(false);

  return (
    <CustomModal
      visible={visible.value}
      footer={false}
      containerClass={theme === 'dark' && styles.modal}
      bodyStyle={{
        backgroundColor: theme === 'dark' ? '#000' : '',
      }}
      closeIconClass={theme === 'dark' && styles.closeIcon}
      onCancel={() => visible.setValue(false)}
    >
      <div className={styles.content}>
        <div className={styles.intro}>
          <MainTitle level={2} customClass={styles[`body${themeStyle()}`]}>
            Please fill out the below information, and{' '}
            {type === 'interested'
              ? 'arrange a product DEMO and Q&A session '
              : 'check your email for verification'}
            .
          </MainTitle>
        </div>
        <div className={styles.form}>
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder={type === 'interested' ? 'brand / company name' : 'first name / last name'}
            prefix={type === 'interested' ? <BrandIcon /> : <UserIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={classNames(styles.brand)}
            name="user"
            type={'text'}
            required={true}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder={type === 'interested' ? 'company website' : 'work email'}
            prefix={type === 'interested' ? <InternetIcon /> : <EmailIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={classNames(styles.website)}
            name="user"
            type={type === 'interested' ? 'text' : 'email'}
            required={true}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder={type === 'interested' ? 'first name / last name' : 'password'}
            prefix={type === 'interested' ? <UserIcon /> : <LockedIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={classNames(styles.user)}
            name="user"
            type={type === 'interested' ? 'text' : 'password'}
            required={true}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            type={type === 'interested' ? 'email' : 'password'}
            containerClass={classNames(styles.email)}
            size="large"
            placeholder={type === 'interested' ? 'work email' : 'confirm password'}
            prefix={type === 'interested' ? <EmailIcon /> : <LockedIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            name="email"
            required={true}
          />
          <Checkbox onClick={() => setBorder(!border)} className={border && styles.customBorder}>
            By clicking and continuing, we agree TISC’s
          </Checkbox>
          <div className={styles.customLink}>
            <span onClick={() => openTiscPolicies.setValue(true)}>
              Terms of Services, Privacy Policy and Cookie Policy
            </span>
          </div>
        </div>
        <div className={styles.button}>
          <CustomButton buttonClass={styles.submit}>
            {type === 'interested' ? 'Book a Demo' : 'Let’s be productive'}
          </CustomButton>
        </div>
      </div>
      <PoliciesModal visible={openTiscPolicies} theme="dark" />
    </CustomModal>
  );
};
