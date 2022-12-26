import { closeModal } from '@/reducers/modal';

import styles from './index.less';

export const useLandingPageStyles = (darkTheme?: boolean, onCancel?: () => void) => {
  const popupStylesProps = {
    visible: true,
    bodyStyle: {
      backgroundColor: darkTheme ? '#000' : '',
      height: '576px',
    },
    closeIconClass: `${styles.closeIcon} ${darkTheme ? styles.whiteIcon : ''}`,
    onCancel: () => {
      onCancel?.();
      closeModal();
    },
  };

  return popupStylesProps;
};
