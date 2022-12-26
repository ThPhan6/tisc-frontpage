import type { FC, ReactElement } from 'react';

import { Modal } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';

import { useScreen } from '@/helper/common';

import type { CustomModalProps } from './types';
import { closeModal } from '@/reducers/modal';

import { MobileDrawer } from './Drawer';
import styles from './styles/index.less';

export const CustomModal: FC<CustomModalProps> = ({
  centered,
  width,
  children,
  closeIconClass,
  containerClass,
  closeIcon,
  onCancel,
  onOk,
  secondaryModal,
  darkTheme,
  ...props
}) => {
  const { isMobile } = useScreen();

  if (isMobile) {
    if (secondaryModal) {
      return (
        <MobileDrawer
          onClose={onCancel}
          visible={props.visible}
          darkTheme={darkTheme}
          noHeaderBorder
        >
          {children}
        </MobileDrawer>
      );
    }
    return children as ReactElement;
  }

  const runWithCloseModal = (callback: any) => () => {
    if (!secondaryModal) {
      closeModal();
    }
    callback?.();
  };

  return (
    <div className={`${styles.container} ${containerClass}`}>
      <Modal
        centered={centered ? centered : true}
        width={width ?? 576}
        footer={false}
        closeIcon={closeIcon ? closeIcon : <CloseIcon className={closeIconClass} />}
        onCancel={runWithCloseModal(onCancel)}
        onOk={runWithCloseModal(onOk)}
        {...props}
      >
        {children}
      </Modal>
    </div>
  );
};
