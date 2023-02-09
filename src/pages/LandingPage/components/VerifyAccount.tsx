import { FC, useEffect, useState } from 'react';

import store from '@/reducers';
import { closeModal, openModal } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './VerifyAccount.less';

export const VerifyAccount: FC = () => {
  const [time, setTime] = useState(5);

  const openLoginModal = () =>
    store.dispatch(openModal({ type: 'Login', noBorderDrawerHeader: true }));

  useEffect(() => {
    if (time === 0) {
      openLoginModal();
    }
    if (!time) return;
    const intervalId = setInterval(() => {
      setTime(time - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time]);

  return (
    <CustomModal visible centered onCancel={closeModal} className={styles.modal}>
      <div className={styles.content}>
        <MainTitle level={2} textAlign="center">
          Your account was verify successfully
        </MainTitle>
        <BodyText fontFamily="Roboto" level={4} customClass={styles.text}>
          It will be redirect to Login after {time}s
        </BodyText>
        <div className={styles.login}>
          <CustomButton onClick={openLoginModal} buttonClass={styles.submit}>
            Login Now
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};
