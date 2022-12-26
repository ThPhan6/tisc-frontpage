import { FC, ReactNode } from 'react';

import { closeModal } from '@/reducers/modal';

import styles from './index.less';

export const ModalContainer: FC<{ footerContent?: ReactNode; customClass?: string }> = ({
  children,
  // footerContent,
  customClass = '',
}) => {
  return (
    <div className={`${styles.container} ${customClass}`}>
      {children}
      {/* <div className={styles.button}>{footerContent}</div> */}
    </div>
  );
};

export const useLandingPageStyles = (darkTheme?: boolean, onCancel?: () => void) => {
  const popupStylesProps = {
    visible: true,
    className: styles.modalContainer,
    closeIconClass: `${styles.closeIcon} ${darkTheme ? styles.whiteIcon : ''}`,
    bodyStyle: {
      backgroundColor: darkTheme ? '#000' : '',
      height: '576px',
    },
    onCancel: () => {
      onCancel?.();
      closeModal();
    },
  };

  return popupStylesProps;
};
