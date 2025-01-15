import { PATH } from '@/constants/path';

import { ReactComponent as HomeButton } from '@/assets/icons/home.svg';
import { ReactComponent as LogoBeta } from '@/assets/icons/logo-beta.svg';

import { pushTo } from '@/helper/history';

import CustomButton from '../Button';
import { RobotoBodyText } from '../Typography';
import styles from './index.less';

export const PublicHeader = () => {
  return (
    <div className={styles.header}>
      <LogoBeta />
      <RobotoBodyText level={5} customClass={styles.text}>
        You are viewing product page without account log in, please use Home button to direct back
        to main page for sign up/log in.
      </RobotoBodyText>
      <CustomButton
        icon={<HomeButton />}
        width="104px"
        buttonClass={styles.homeButton}
        onClick={() => pushTo(PATH.landingPage)}
      >
        Home
      </CustomButton>
    </div>
  );
};
