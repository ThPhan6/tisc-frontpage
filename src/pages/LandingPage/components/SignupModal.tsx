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
import { signUpDesigner } from '../services/api';

interface SignupInput {
  firstname: string;
  email: string;
  password: string;
  confirmed_password: string;
  agree_tisc: boolean;
}
export const SignupModal: FC<ModalProps> = ({ visible, onClose, theme = 'default' }) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');
  const [openModalPolicies, setOpenModalPolicies] = useState('');
  const [inputValue, setInputValue] = useState<SignupInput>({
    email: '',
    password: '',
    firstname: '',
    confirmed_password: '',
    agree_tisc: false,
  });
  const [agreeTisc, setAgreeTisc] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const handleAgreeTisc = () => {
    setAgreeTisc(!agreeTisc);
    setInputValue({ ...inputValue, agree_tisc: !inputValue.agree_tisc });
  };

  const setErrorMessage = () => {
    if (inputValue.confirmed_password && inputValue.password !== inputValue.confirmed_password) {
      return MESSAGE_ERROR.CONFIRM_PASSWORD;
    }
    if (inputValue.email && !validateEmail(inputValue.email)) {
      return MESSAGE_ERROR.EMAIL_ALREADY_TOKEN;
    }
    if (agreeTisc === true && inputValue.agree_tisc === false) {
      return MESSAGE_ERROR.AGREE_TISC;
    }
    return '';
  };

  const handleSubmit = () => {
    if (inputValue.agree_tisc === true) {
      signUpDesigner({
        firstname: inputValue.firstname,
        email: inputValue.email,
        password: inputValue.password,
        confirmed_password: inputValue.confirmed_password,
      }).then((res) => {
        if (res) {
          onClose();
        }
      });
    } else {
      setAgreeTisc(true);
    }
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
            name="confirmed_password"
            required={true}
            onChange={handleOnChange}
            status={
              inputValue.confirmed_password
                ? inputValue.password !== inputValue.confirmed_password
                  ? 'error'
                  : ''
                : ''
            }
          />
          <div
            className={
              agreeTisc === true && inputValue.agree_tisc === false ? styles.errorStatus : ''
            }
          >
            <Checkbox onChange={handleAgreeTisc}>
              By clicking and continuing, we agree TISC’s
            </Checkbox>
          </div>

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
