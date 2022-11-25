import { FC } from 'react';

import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';

import { CustomSaveButtonProps } from './types';

import styles from '../Button/styles/index.less';
import { BodyText } from '../Typography';
import classNames from 'classnames';

export const CustomSaveButton: FC<CustomSaveButtonProps> = ({
  isSuccess,
  onClick,
  contentButton,
}) => {
  return (
    <button
      className={classNames(
        styles.sizeButton,
        isSuccess ? styles.customButtonSuccess : styles.customButton,
      )}
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
