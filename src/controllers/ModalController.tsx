import { useScreen } from '@/helper/common';

import { useAppSelector } from '@/reducers';
import { closeModal } from '@/reducers/modal';

import { LoginModal } from './components/modals/LoginModal';
import { SignupModal } from './components/modals/SignupModal';
import { CustomDrawer } from '@/components/Modal/Drawer';

export const ModalController = () => {
  const modalType = useAppSelector((state) => state.modal.type);

  const { isMobile } = useScreen();

  const renderModalContent = () => {
    switch (modalType) {
      case 'Login':
        return <LoginModal />;
      case 'Tisc Login':
        return <LoginModal tiscLogin />;
      case 'Designer Signup':
        return <SignupModal />;
      case 'none':
      default:
        return null;
    }
  };

  if (isMobile) {
    return (
      <CustomDrawer
        placement="bottom"
        onClose={closeModal}
        visible={!modalType || modalType !== 'none'}
        headerStyle={{ position: 'relative' }}
        height="auto">
        {renderModalContent()}
      </CustomDrawer>
    );
  }

  return renderModalContent();
};
