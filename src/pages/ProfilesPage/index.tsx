import { useBoolean } from '@/helper/hook';

import LoadingPageCustomize from '@/components/LoadingPage';

import { PersonalProfile } from './PersonalProfile';
import { WorkplaceProfile } from './WorkplaceProfile';
import styles from './styles/index.less';

const ProfilesPage = () => {
  const isLoading = useBoolean();
  return (
    <div className={styles['profile-container']}>
      <WorkplaceProfile />
      <PersonalProfile isLoading={isLoading} />
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default ProfilesPage;
