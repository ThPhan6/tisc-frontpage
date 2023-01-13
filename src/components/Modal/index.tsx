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
  noHeaderBorder = true,
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
          noHeaderBorder={noHeaderBorder}
          title={props.title}
          footer={props.footer}
        >
          {children}
        </MobileDrawer>
      );
    }
    if (props.footer) {
      return (
        <>
          <div style={{ paddingBottom: 48 }}>
            {children}

            <div
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 48,
                boxShadow: 'inset 0px 0.7px 0px #000000',
                background: '#fff',
              }}
              className="flex-end"
            >
              {props.footer}
            </div>
          </div>
        </>
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
