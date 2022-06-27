import styles from './styles/index.less';
import { WorkplaceProfile } from './WorkplaceProfile';
import { PersonalProfile } from './PersonalProfile';
import LoadingPageCustomize from '@/components/LoadingPage';
import { useBoolean } from '@/helper/hook';

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
