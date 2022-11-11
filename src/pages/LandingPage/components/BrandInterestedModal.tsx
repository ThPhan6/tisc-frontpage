import { FC, useState } from 'react';

import { Checkbox } from 'antd';

import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';

import { ModalProps } from '../types';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomModal } from '@/components/Modal';
import { MainTitle } from '@/components/Typography';

import { CalendarModal } from './CalendarModal';
import { PoliciesModal } from './PoliciesModal';
import styles from './SignupModal.less';

export const BrandInterestedModal: FC<ModalProps> = ({ visible, onClose, theme = 'default' }) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');
  const [openModal, setOpenModal] = useState('');

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
            style={{ marginBottom: '8px' }}
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
            style={{ marginBottom: '8px' }}
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
            style={{ marginBottom: '8px' }}
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
            style={{ marginBottom: '8px' }}
          />
          <Checkbox>By clicking and continuing, we agree to TISC’s</Checkbox>
          <div className={styles.customLink}>
            <span onClick={() => setOpenModal('Policies')}>
              Terms of Services, Privacy Policy and Cookie Policy
            </span>
          </div>
        </div>
        <CustomButton buttonClass={styles.submitBtn} onClick={() => setOpenModal('BookDemo')}>
          Book a Demo
        </CustomButton>
      </div>
      <PoliciesModal
        visible={openModal === 'Policies'}
        onClose={() => setOpenModal('')}
        theme="dark"
      />
      <CalendarModal visible={openModal === 'BookDemo'} onClose={() => setOpenModal('')} />
    </CustomModal>
  );
};
