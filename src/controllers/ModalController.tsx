import BilledServicesInfo from '@/features/billed-services/BilledServicesModal';
import { BrandCompanyModal } from '@/features/services/components/BrandCompanyModal';
import { useScreen } from '@/helper/common';

import { useAppSelector } from '@/reducers';
import { ModalType, closeModal } from '@/reducers/modal';

import AssignTeamModal from '@/components/AssignTeam';
import InquiryRequestModal from '@/components/InquiryRequest';
import { ProjectTrackingLegendModal } from '@/components/LegendModal/LegendModal';
import { MobileDrawer } from '@/components/Modal/Drawer';
import ShareViaEmail from '@/components/ShareViaEmail';
import InformationMarketAvailability from '@/features/market-availability/components/InformationMarketAvailability';
import LocationModal from '@/features/team-profiles/components/LocationModal';
import AccessLevelModal from '@/features/team-profiles/components/access-level-modal/AccessLevelModal';
import { AboutModal } from '@/pages/LandingPage/components/AboutModal';
import { BrandInterestedModal } from '@/pages/LandingPage/components/BrandInterestedModal';
import { CalendarModal } from '@/pages/LandingPage/components/CalendarModal';
import { CancelBookingModal } from '@/pages/LandingPage/components/CancelBookingModal';
import { ContactModal } from '@/pages/LandingPage/components/ContactModal';
import { LoginModal } from '@/pages/LandingPage/components/LoginModal';
import { NoticeModal } from '@/pages/LandingPage/components/NoticeModal';
import { PasswordModal } from '@/pages/LandingPage/components/PasswordModal';
import { PoliciesModal } from '@/pages/LandingPage/components/PoliciesModal';
import { SignupModal } from '@/pages/LandingPage/components/SignupModal';
import { VerifyAccount } from '@/pages/LandingPage/components/VerifyAccount';
import { Workspace } from '@/pages/LandingPage/components/Workspace';
import { SelectBrandModal } from '@/pages/TISC/Product/Configuration/components/TopBar';

import styles from './index.less';
import { ColorDetection } from '@/features/colorDetection';
import AssignProductModal from '@/features/product/modals/AssignProductModal';

const landingpageModals: ModalType[] = [
  'Login',
  'Tisc Login',
  'Designer Signup',
  'About',
  'Contact',
  'Policies',
  'Browser Compatibility',
  'Brand Interested',
  'Reset Password',
  'Verify Account',
];

export const ModalController = () => {
  const modalType = useAppSelector((state) => state.modal.type);
  const autoHeightDrawer = useAppSelector((state) => state.modal.autoHeightDrawer);
  const noBorderDrawerHeader = useAppSelector((state) => state.modal.noBorderDrawerHeader);
  const darkTheme = useAppSelector((state) => state.modal.theme === 'dark');
  const title = useAppSelector((state) => state.modal.title);
  const { isMobile } = useScreen();

  const isModalOnLandingpage = landingpageModals.includes(modalType);

  const isModalColorAI = modalType === 'Color AI';

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
      case 'Calendar':
        return <CalendarModal />;
      case 'Cancel Booking':
        return <CancelBookingModal />;
      case 'Reset Password':
        return <PasswordModal />;
      case 'Verify Account':
        return <VerifyAccount />;
      case 'Workspaces':
        return <Workspace />;

      // General
      case 'Assign Team':
        return <AssignTeamModal />;
      case 'Project Tracking Legend':
        return <ProjectTrackingLegendModal />;
      case 'Access Level':
        return <AccessLevelModal />;
      case 'Work Location':
        return <LocationModal />;
      case 'Share via email':
        return <ShareViaEmail />;

      // TISC
      case 'Select Brand':
        return <SelectBrandModal />;
      case 'Brand Company':
        return <BrandCompanyModal />;

      // Brand
      case 'Billed Services':
        return <BilledServicesInfo />;

      // design firms
      case 'Assign Product':
        return <AssignProductModal />;
      case 'Market Availability':
        return <InformationMarketAvailability />;
      case 'Inquiry Request':
        return <InquiryRequestModal />;

      case 'Color AI':
        return <ColorDetection />;

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
        className={`${isModalOnLandingpage && isMobile ? styles.bodySpacing : ''} ${
          isModalColorAI ? styles.colorAI : ''
        } `}
      >
        {renderModalContent()}
      </MobileDrawer>
    );
  }
  return renderModalContent();
};
