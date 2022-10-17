import { FC } from 'react';

import PageTemplate from '@/assets/images/page.png';

import { CustomModal } from '@/components/Modal';

interface ModalProps {
  visible: { value: boolean; setValue: (value: boolean) => void };
}
export const Modal: FC<ModalProps> = ({ visible }) => {
  return (
    <CustomModal visible={visible.value} footer={false} onCancel={() => visible.setValue(false)}>
      <img src={PageTemplate} />
    </CustomModal>
  );
};
