import { FC, useEffect, useState } from 'react';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './VerifyAccount.less';

interface VerifyAccountModal {
  visible: { value: boolean; setValue: (value: boolean) => void };
  handleSubmit: () => void;
  openLogin: () => void;
}
export const VerifyAccount: FC<VerifyAccountModal> = ({ visible, handleSubmit, openLogin }) => {
  const [time, setTime] = useState(5);

  useEffect(() => {
    if (time === 0) {
      openLogin();
      visible.setValue(false);
    }
    if (!time) return;
    const intervalId = setInterval(() => {
      setTime(time - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time]);

  return (
    <CustomModal visible={visible.value} footer={false} onCancel={() => visible.setValue(false)}>
      <div className={styles.content}>
        <MainTitle level={2} textAlign="center">
          Your account was verify successfully
        </MainTitle>
        <BodyText fontFamily="Roboto" level={4} customClass={styles.text}>
          It will be redirect to Login after {time}s
        </BodyText>
        <div className={styles.login}>
          <CustomButton onClick={handleSubmit} buttonClass={styles.submit}>
            Login Now
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};
