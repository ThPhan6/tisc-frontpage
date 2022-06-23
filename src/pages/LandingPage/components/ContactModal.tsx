import styles from './ContactModal.less';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';
import { CustomInput } from '@/components/Form/CustomInput';
import CustomButton from '@/components/Button';
import { FC } from 'react';
import { ContactModalProps } from '../types';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';
import { ReactComponent as MessageIcon } from '@/assets/icons/message-icon-18px.svg';
import classNames from 'classnames';
import { CustomTextArea } from '@/components/Form/CustomTextArea';

export const ContactModal: FC<ContactModalProps> = ({ visible, theme = 'default' }) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');

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
          <MainTitle level={1} customClass={styles[`body${themeStyle()}`]}>
            We love to hear from you.
          </MainTitle>
        </div>
        <div className={styles.form}>
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder="first name / last name"
            prefix={<UserIcon />}
            focusColor="secondary"
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={classNames(styles.user)}
            name="user"
            type={'text'}
            required={true}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            type={'email'}
            containerClass={classNames(styles.email)}
            size="large"
            placeholder="contact email"
            prefix={<EmailIcon />}
            focusColor="secondary"
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            name="email"
            required={true}
          />
          <div className={styles.wrapper}>
            <MessageIcon />
            <BodyText level={4} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
              Message
            </BodyText>
          </div>
          <div>
            <CustomTextArea
              showCount
              placeholder="type here..."
              maxLength={125}
              borderBottomColor="mono-medium"
            />
          </div>
        </div>
        <div className={styles.button}>
          <CustomButton buttonClass={styles.submit}>Thank you</CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};
