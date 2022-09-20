import { useLoadingAction } from '@/helper/hook';

import { PersonalProfile } from '@/features/user-profile/components/PersonalProfile';
import { WorkplaceProfile } from '@/features/user-profile/components/WorkplaceProfile';

import styles from './index.less';

const UserProfile = () => {
  const { loadingAction } = useLoadingAction();

  return (
    <div className={styles['profile-container']}>
      <WorkplaceProfile />
      <PersonalProfile />
      {loadingAction}
    </div>
  );
};

export default UserProfile;
