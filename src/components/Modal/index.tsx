import { Modal } from 'antd';
import type { FC } from 'react';
import styles from './styles/index.less';
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg';
import type { CustomModalProps } from './types';
import classNames from 'classnames';

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
    <div className={classNames(styles.container, containerClass)}>
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
