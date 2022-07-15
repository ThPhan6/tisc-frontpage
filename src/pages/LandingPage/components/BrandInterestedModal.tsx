import styles from './SignupModal.less';
import { CustomModal } from '@/components/Modal';
import { MainTitle } from '@/components/Typography';
import { CustomInput } from '@/components/Form/CustomInput';
import CustomButton from '@/components/Button';
import { FC, useState } from 'react';
import { ModalProps } from '../types';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';
import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { Checkbox } from 'antd';
import { PoliciesModal } from './PoliciesModal';

export const BrandInterestedModal: FC<ModalProps> = ({ visible, onClose, theme = 'default' }) => {
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
            Please fill out the below information, and arrange a product DEMO and Q&A session.
          </MainTitle>
        </div>
        <div className={styles.form}>
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder="brand / company name"
            prefix={<BrandIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={styles.brand}
            name="user"
            type={'text'}
            required={true}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder="company website"
            prefix={<InternetIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={styles.website}
            name="user"
            type="text"
            required={true}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder="first name / last name"
            prefix={<UserIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={styles.user}
            name="user"
            type="text"
            required={true}
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
          />
          <Checkbox>By clicking and continuing, we agree TISC’s</Checkbox>
          <div className={styles.customLink}>
            <span onClick={() => setOpenModalPolicies('Policies')}>
              Terms of Services, Privacy Policy and Cookie Policy
            </span>
          </div>
        </div>
        <div className={styles.button}>
          <CustomButton buttonClass={styles.submit}>Book a Demo</CustomButton>
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
