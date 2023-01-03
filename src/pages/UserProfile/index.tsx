import { useScreen } from '@/helper/common';

import { PersonalProfile } from '@/features/user-profile/components/PersonalProfile';
import { WorkplaceProfile } from '@/features/user-profile/components/WorkplaceProfile';

import styles from './index.less';

const UserProfile = () => {
  const { isMobile } = useScreen();
  const screenHeight = screen.height;
  return (
    <div
      className={styles['profile-container']}
      style={{ height: isMobile ? screenHeight - 72 : '' }}>
      <WorkplaceProfile contentHeight={isMobile ? screenHeight / 2 - 104 : undefined} />
      <PersonalProfile contentHeight={isMobile ? screenHeight / 2 - 152 : undefined} />
    </div>
  );
};

export default UserProfile;
