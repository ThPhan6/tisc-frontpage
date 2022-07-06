import styles from './SignupModal.less';
import { CustomModal } from '@/components/Modal';
import { MainTitle } from '@/components/Typography';
import { CustomInput } from '@/components/Form/CustomInput';
import CustomButton from '@/components/Button';
import { FC, useState } from 'react';
import { ModalProps } from '../types';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';
import { ReactComponent as LockedIcon } from '@/assets/icons/lock-locked-icon.svg';
import classNames from 'classnames';
import { Checkbox } from 'antd';
import { PoliciesModal } from './PoliciesModal';

export const SignupModal: FC<ModalProps> = ({ visible, onClose, theme = 'default' }) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');
  const [openModalPolicies, setOpenModalPolicies] = useState('');

  return (
    <CustomModal
      visible={visible}
      footer={false}
      containerClass={theme === 'dark' && styles.modal}
      bodyStyle={{
        backgroundColor: theme === 'dark' ? '#000' : '',
      }}
      closeIconClass={theme === 'dark' && styles.closeIcon}
      onCancel={onClose}
    >
      <div className={styles.content}>
        <div className={styles.intro}>
          <MainTitle level={2} customClass={styles[`body${themeStyle()}`]}>
            Please fill out the below information, and check your email for verification.
          </MainTitle>
        </div>
        <div className={styles.form}>
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder="first name / last name"
            prefix={<UserIcon />}
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
            placeholder="work email"
            prefix={<EmailIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={classNames(styles.website)}
            name="user"
            type="email"
            required={true}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder="password"
            prefix={<LockedIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={classNames(styles.user)}
            name="user"
            type="password"
            required={true}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            type="password"
            containerClass={classNames(styles.email)}
            size="large"
            placeholder="confirm password"
            prefix={<LockedIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            name="email"
            required={true}
          />
          <Checkbox>By clicking and continuing, we agree TISC’s</Checkbox>
          <div className={styles.customLink}>
            <span onClick={() => setOpenModalPolicies('Policies')}>
              Terms of Services, Privacy Policy and Cookie Policy
            </span>
          </div>
        </div>
        <div className={styles.button}>
          <CustomButton buttonClass={styles.submit}>Let’s be productive</CustomButton>
        </div>
      </div>
      <PoliciesModal
        visible={openModalPolicies === 'Policies'}
        onClose={() => setOpenModalPolicies('')}
        theme="dark"
      />
    </CustomModal>
  );
};
