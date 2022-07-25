import styles from './SignupModal.less';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';
import { CustomInput } from '@/components/Form/CustomInput';
import CustomButton from '@/components/Button';
import { FC, useState } from 'react';
import { ModalProps } from '../types';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';
import { ReactComponent as LockedIcon } from '@/assets/icons/lock-locked-icon.svg';
import { Checkbox } from 'antd';
import { PoliciesModal } from './PoliciesModal';
import { MESSAGE_ERROR } from '@/constants/message';
import { isShowErrorMessage, validateEmail } from '@/helper/utils';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-white-icon.svg';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { signUpDesigner } from '../services/api';

interface SignupInput {
  firstname: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}
export const SignupModal: FC<ModalProps> = ({ visible, onClose, theme = 'default' }) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');
  const [openModalPolicies, setOpenModalPolicies] = useState('');
  const [inputValue, setInputValue] = useState<SignupInput>({
    email: '',
    password: '',
    firstname: '',
    confirmPassword: '',
    agree: false,
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const handleAgree = (e: CheckboxChangeEvent) => {
    setInputValue({ ...inputValue, agree: e.target.checked });
  };

  const setErrorMessage = () => {
    if (inputValue.confirmPassword && inputValue.password !== inputValue.confirmPassword) {
      return MESSAGE_ERROR.CONFIRM_PASSWORD;
    }
    if (inputValue.email && !validateEmail(inputValue.email)) {
      return MESSAGE_ERROR.EMAIL_ALREADY_TOKEN;
    }
    if (inputValue.agree && inputValue.agree !== true) {
      return MESSAGE_ERROR.AGREE_TISC;
    }
    return '';
  };

  const handleSubmit = () => {
    if (inputValue.agree === true) {
      signUpDesigner(inputValue).then((res) => {
        if (res) {
        }
      });
    }
    setErrorMessage();
  };

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
            containerClass={styles.brand}
            name="firstname"
            type={'text'}
            required={true}
            onChange={handleOnChange}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder="work email"
            prefix={<EmailIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={styles.website}
            name="email"
            type="email"
            required={true}
            onChange={handleOnChange}
            status={isShowErrorMessage('email', inputValue.email) ? '' : 'error'}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            size="large"
            placeholder="password"
            prefix={<LockedIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            containerClass={styles.user}
            name="password"
            type="password"
            required={true}
            onChange={handleOnChange}
          />
          <CustomInput
            fromLandingPage
            theme={theme}
            type="password"
            containerClass={styles.email}
            size="large"
            placeholder="confirm password"
            prefix={<LockedIcon />}
            borderBottomColor={theme === 'dark' ? 'white' : 'mono'}
            name="confirmPassword"
            required={true}
            onChange={handleOnChange}
            status={
              inputValue.confirmPassword
                ? inputValue.password !== inputValue.confirmPassword
                  ? 'error'
                  : ''
                : ''
            }
          />
          <Checkbox onChange={handleAgree}>By clicking and continuing, we agree TISC’s</Checkbox>
          <div className={styles.customLink}>
            <span onClick={() => setOpenModalPolicies('Policies')}>
              Terms of Services, Privacy Policy and Cookie Policy
            </span>
          </div>
        </div>
        <div className={styles.button}>
          <div>
            {setErrorMessage() && (
              <div className={styles.warning}>
                <WarningIcon />
                <BodyText level={4} fontFamily="Roboto">
                  {setErrorMessage()}
                </BodyText>
              </div>
            )}
          </div>
          <CustomButton buttonClass={styles.submit} onClick={handleSubmit}>
            Let’s be productive
          </CustomButton>
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
