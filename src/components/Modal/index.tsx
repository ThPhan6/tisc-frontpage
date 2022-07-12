import { Modal } from 'antd';
import type { FC } from 'react';
import styles from './styles/index.less';
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg';
import type { CustomModalProps } from './types';

export const CustomModal: FC<CustomModalProps> = ({
  centered,
  width,
  children,
  title,
  closeIconClass,
  containerClass,
  closeIcon,
  ...props
}) => {
  return (
    <div className={`${styles.container} ${containerClass}`}>
      <Modal
        centered={centered ? centered : true}
        width={width ? width : 576}
        closeIcon={closeIcon ? closeIcon : <CloseIcon className={closeIconClass} />}
        {...props}
      >
        {children}
      </Modal>
    </div>
  );
};
