import { useBoolean } from '@/helper/hook';

import LoadingPageCustomize from '@/components/LoadingPage';
import { PersonalProfile } from '@/features/user-profile/components/PersonalProfile';
import { WorkplaceProfile } from '@/features/user-profile/components/WorkplaceProfile';

import styles from './index.less';

const UserProfile = () => {
  const isLoading = useBoolean();
  return (
    <div className={styles['profile-container']}>
      <WorkplaceProfile />
      <PersonalProfile isLoading={isLoading} />
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default UserProfile;
