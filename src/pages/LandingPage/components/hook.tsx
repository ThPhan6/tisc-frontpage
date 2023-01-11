import { FC } from 'react';

import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-white-icon.svg';

import { CustomButtonProps } from '@/components/Button/types';
import { closeModal } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import { BodyText } from '@/components/Typography';

import styles from './index.less';

export const ModalContainer: FC<{ customClass?: string }> = ({ children, customClass = '' }) => {
  return <div className={`${styles.container} ${customClass}`}>{children}</div>;
};

interface FooterContentProps extends CustomButtonProps {
  submitButtonLabel?: string;
  buttonDisabled?: boolean;
  buttonWidth?: string;
  errorMessage?: string;
  onSubmit?: () => void;
}

export const FooterContent: FC<FooterContentProps> = ({
  errorMessage,
  submitButtonLabel,
  onSubmit,
  buttonDisabled,
  buttonWidth,
}) => {
  return (
    <div className={styles.action}>
      <div className={errorMessage ? styles.action_between : styles.action_right}>
        {errorMessage ? (
          <div className={styles.warning}>
            <WarningIcon />
            <BodyText level={4} fontFamily="Roboto">
              {errorMessage}
            </BodyText>
          </div>
        ) : (
          ''
        )}
        {submitButtonLabel ? (
          <CustomButton
            buttonClass={styles.submit}
            disabled={buttonDisabled}
            width={buttonWidth}
            onClick={onSubmit}
          >
            {submitButtonLabel}
          </CustomButton>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export const useLandingPageStyles = (darkTheme?: boolean, onCancel?: () => void) => {
  const popupStylesProps = {
    visible: true,
    closeIconClass: `${styles.closeIcon} ${darkTheme ? styles.whiteIcon : ''}`,
    bodyStyle: {
      backgroundColor: darkTheme ? '#000' : '',
      height: '576px',
      padding: '48px 48px 32px 48px',
    },
    onCancel: () => {
      onCancel?.();
      closeModal();
    },
  };

  return popupStylesProps;
};
