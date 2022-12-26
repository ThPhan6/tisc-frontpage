import { useScreen } from '@/helper/common';

import { useAppSelector } from '@/reducers';
import { closeModal } from '@/reducers/modal';

import { LoginModal } from './components/modals/LoginModal';
import { SignupModal } from './components/modals/SignupModal';
import { MobileDrawer } from '@/components/Modal/Drawer';
import InformationMarketAvailability from '@/features/market-availability/components/InformationMarketAvailability';
import { AboutModal } from '@/pages/LandingPage/components/AboutModal';
import { BrandInterestedModal } from '@/pages/LandingPage/components/BrandInterestedModal';
import { CancelBookingModal } from '@/pages/LandingPage/components/CancelBookingModal';
import { ContactModal } from '@/pages/LandingPage/components/ContactModal';
import { NoticeModal } from '@/pages/LandingPage/components/NoticeModal';
import { PasswordModal } from '@/pages/LandingPage/components/PasswordModal';
import { PoliciesModal } from '@/pages/LandingPage/components/PoliciesModal';
import { VerifyAccount } from '@/pages/LandingPage/components/VerifyAccount';

import AssignProductModal from '@/features/product/modals/AssignProductModal';

export const ModalController = () => {
  const modalType = useAppSelector((state) => state.modal.type);
  const autoHeightDrawer = useAppSelector((state) => state.modal.autoHeightDrawer);
  const noBorderDrawerHeader = useAppSelector((state) => state.modal.noBorderDrawerHeader);
  const darkTheme = useAppSelector((state) => state.modal.theme === 'dark');
  const title = useAppSelector((state) => state.modal.title);

  const { isMobile } = useScreen();

  const renderModalContent = () => {
    switch (modalType) {
      // landing page
      case 'Login':
        return <LoginModal />;
      case 'Tisc Login':
        return <LoginModal tiscLogin />;
      case 'Designer Signup':
        return <SignupModal />;
      case 'About':
        return <AboutModal />;
      case 'Contact':
        return <ContactModal />;
      case 'Policies':
        return <PoliciesModal />;
      case 'Browser Compatibility':
        return <NoticeModal />;
      case 'Brand Interested':
        return <BrandInterestedModal />;
      case 'Cancel Booking':
        return <CancelBookingModal />;
      case 'Reset Password':
        return <PasswordModal />;
      case 'Verify Account':
        return <VerifyAccount />;

      // design firms
      case 'Assign Product':
        return <AssignProductModal />;
      case 'Market Availability':
        return <InformationMarketAvailability />;

      //
      case 'none':
      default:
        return null;
    }
  };

  if (isMobile) {
    return (
      <MobileDrawer
        onClose={closeModal}
        visible={!modalType || modalType !== 'none'}
        noHeaderBorder={noBorderDrawerHeader}
        autoHeight={autoHeightDrawer}
        darkTheme={darkTheme}
        title={title}
      >
        {renderModalContent()}
      </MobileDrawer>
    );
  }

  return renderModalContent();
};
