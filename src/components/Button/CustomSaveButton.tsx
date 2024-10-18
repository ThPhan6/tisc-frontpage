import { FC } from 'react';

import { Spin } from 'antd';

import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';

import { CustomSaveButtonProps } from './types';

import styles from '../Button/styles/index.less';
import { BodyText } from '../Typography';

export const CustomSaveButton: FC<Omit<CustomSaveButtonProps, 'className'>> = ({
  isLoading,
  isSuccess,
  onClick,
  customClass = '',
  contentButton,
  ...props
}) => {
  return (
    <button
      className={`${styles.sizeButton} ${
        isSuccess ? styles.customButtonSuccess : styles.customButton
      } ${customClass}`}
      onClick={onClick}
      {...props}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spin className={styles.spin} />
      ) : isSuccess ? (
        <CheckSuccessIcon />
      ) : (
        <BodyText level={6} fontFamily="Roboto">
          {contentButton ? contentButton : 'Save'}
        </BodyText>
      )}
    </button>
  );
};
