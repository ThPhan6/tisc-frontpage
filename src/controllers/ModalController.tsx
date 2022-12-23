import { useScreen } from '@/helper/common';

import { useAppSelector } from '@/reducers';
import { closeModal } from '@/reducers/modal';

import { LoginModal } from './components/modals/LoginModal';
import { SignupModal } from './components/modals/SignupModal';
import { CustomDrawer } from '@/components/Modal/Drawer';
import InformationMarketAvailability from '@/features/market-availability/components/InformationMarketAvailability';

import AssignProductModal from '@/features/product/modals/AssignProductModal';

export const ModalController = () => {
  const modalType = useAppSelector((state) => state.modal.type);
  const autoHeightDrawer = useAppSelector((state) => state.modal.autoHeightDrawer);
  const noBorderDrawerHeader = useAppSelector((state) => state.modal.noBorderDrawerHeader);

  const { isMobile } = useScreen();

  const renderModalContent = () => {
    switch (modalType) {
      case 'Login':
        return <LoginModal />;
      case 'Tisc Login':
        return <LoginModal tiscLogin />;
      case 'Designer Signup':
        return <SignupModal />;
      case 'Assign Product':
        return <AssignProductModal />;
      case 'Market Availability':
        return <InformationMarketAvailability />;
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
        headerStyle={{ position: 'relative', boxShadow: noBorderDrawerHeader ? 'none' : undefined }}
        height={autoHeightDrawer ? 'auto' : window.innerHeight * 0.85}>
        {renderModalContent()}
      </CustomDrawer>
    );
  }

  return renderModalContent();
};
