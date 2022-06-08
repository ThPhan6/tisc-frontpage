import styles from './styles/index.less';
import { WorkplaceProfile } from './WorkplaceProfile';
import { PersonalProfile } from './PersonalProfile';

const ProfilesPage = () => {
  return (
    <div className={styles['profile-container']}>
      <WorkplaceProfile />
      <PersonalProfile />
    </div>
  );
};

export default ProfilesPage;
