import { useAppSelector } from '@/reducers';
import { closeModal, modalThemeSelector } from '@/reducers/modal';

import styles from './index.less';

export const useLandingPageStyles = () => {
  const { darkTheme } = useAppSelector(modalThemeSelector);

  const popupStylesProps = {
    visible: true,
    bodyStyle: {
      backgroundColor: darkTheme ? '#000' : '',
      height: '576px',
    },
    closeIconClass: darkTheme ? styles.closeIcon : '',
    onCancel: closeModal,
  };

  return popupStylesProps;
};
