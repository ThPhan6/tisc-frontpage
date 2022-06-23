import styles from './AboutModal.less';
import { CustomModal } from '@/components/Modal';
import { FC } from 'react';
import { AboutModalProps } from '../types';

export const AboutModal: FC<AboutModalProps> = ({ visible, theme = 'default' }) => {
  //   const themeStyle = () => (theme === 'default' ? '' : '-dark');
  //   const listTab = [
  //     { tab: 'TERMS OF SERVICES', key: '1' },
  //     { tab: 'PRIVACY POLICY', key: '2' },
  //     { tab: 'COOKIE POLICY', key: '3' },
  //   ];
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
      <div className={styles.header}>
        <div></div>
      </div>
      <div className={styles.body}></div>
    </CustomModal>
  );
};
