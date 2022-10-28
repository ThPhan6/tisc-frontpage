import { FC } from 'react';

import { ModalOpen } from './types';

import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { PoliciesModal } from './components/PoliciesModal';

interface AboutPoliciesContactModalProps {
  visible: ModalOpen;
  onClose: () => void;
}

export const AboutPoliciesContactModal: FC<AboutPoliciesContactModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <>
      <AboutModal visible={visible === 'About'} onClose={onClose} theme="dark" />
      <PoliciesModal visible={visible === 'Policies'} onClose={onClose} theme="dark" />
      <ContactModal visible={visible === 'Contact'} onClose={onClose} theme="dark" />
    </>
  );
};
