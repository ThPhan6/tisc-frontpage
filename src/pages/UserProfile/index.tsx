import { PersonalProfile } from '@/features/user-profile/components/PersonalProfile';
import { WorkplaceProfile } from '@/features/user-profile/components/WorkplaceProfile';

import styles from './index.less';

const UserProfile = () => {
  return (
    <div className={styles['profile-container']}>
      <WorkplaceProfile />
      <PersonalProfile />
    </div>
  );
};

export default UserProfile;
