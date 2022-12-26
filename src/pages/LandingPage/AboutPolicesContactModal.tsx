import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { PoliciesModal } from './components/PoliciesModal';

export const AboutPoliciesContactModal = () => {
  return (
    <>
      <AboutModal />
      <PoliciesModal />
      <ContactModal />
    </>
  );
};
