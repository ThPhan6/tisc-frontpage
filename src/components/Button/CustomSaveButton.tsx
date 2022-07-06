import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { FC } from 'react';
import { CustomSaveButtonProps } from './types';
import styles from '../Button/styles/index.less';
import { BodyText } from '../Typography';
import classNames from 'classnames';

export const CustomSaveButton: FC<CustomSaveButtonProps> = ({ submitButtonStatus, onClick }) => {
  return (
    <button
      className={classNames(
        styles.sizeButton,
        submitButtonStatus ? styles.customButtonSuccess : styles.customButton,
      )}
      onClick={onClick}
    >
      {submitButtonStatus ? (
        <CheckSuccessIcon />
      ) : (
        <BodyText level={6} fontFamily="Roboto">
          Save
        </BodyText>
      )}
    </button>
  );
};
