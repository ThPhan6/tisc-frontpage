import { FC } from 'react';

import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';

import { CustomSaveButtonProps } from './types';

import styles from '../Button/styles/index.less';
import { BodyText } from '../Typography';

export const CustomSaveButton: FC<CustomSaveButtonProps> = ({
  isSuccess,
  onClick,
  customClass = '',
  contentButton,
}) => {
  return (
    <button
      className={`${styles.sizeButton} ${
        isSuccess ? styles.customButtonSuccess : styles.customButton
      } ${customClass}`}
      onClick={onClick}>
      {isSuccess ? (
        <CheckSuccessIcon />
      ) : (
        <BodyText level={6} fontFamily="Roboto">
          {contentButton ? contentButton : 'Save'}
        </BodyText>
      )}
    </button>
  );
};
