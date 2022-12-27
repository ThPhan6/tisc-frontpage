import { FC } from 'react';

import { showImageUrl } from '@/helper/utils';

import { CustomModal } from '@/components/Modal';

import styles from '../index.less';

interface ModalProps {
  visible: { value: boolean; setValue: (value: boolean) => void };
  previewURL: string;
}
export const PreviewModal: FC<ModalProps> = ({ visible, previewURL }) => {
  return (
    <CustomModal
      visible={visible.value}
      onCancel={() => visible.setValue(false)}
      className={styles.modal}
      closable={false}>
      <img src={showImageUrl(previewURL)} style={{ width: '100%', height: '100%' }} />
    </CustomModal>
  );
};
