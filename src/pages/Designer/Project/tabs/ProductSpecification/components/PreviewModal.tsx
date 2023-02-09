import { FC } from 'react';

import { useScreen } from '@/helper/common';
import { showImageUrl } from '@/helper/utils';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';

import styles from '../index.less';

interface ModalProps {
  visible: { value: boolean; setValue: (value: boolean) => void };
  previewURL: string;
}
export const PreviewModal: FC<ModalProps> = ({ visible, previewURL }) => {
  const { isMobile } = useScreen();
  return (
    <CustomModal
      visible={visible.value}
      onCancel={() => visible.setValue(false)}
      className={styles.modal}
      closable={false}
      secondaryModal
      footer={
        // only display footer for mobile
        isMobile ? (
          <CustomButton size="small" properties="rounded" onClick={() => visible.setValue(false)}>
            Close
          </CustomButton>
        ) : null
      }
    >
      <img
        src={showImageUrl(previewURL)}
        style={{ width: '100%', height: '100%', boxShadow: ' 1px 1px 3px rgba(0, 0, 0, 0.5)' }}
      />
    </CustomModal>
  );
};
