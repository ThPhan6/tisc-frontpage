import { AvatarDropdown } from './AvatarDropdown';
import styles from './styles/index.less';
import logoIcon from '@/assets/tisc-logo-icon.svg';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { ReactComponent as QuestionIcon } from '@/assets/icons/question-white-icon.svg';
import { ReactComponent as LanguageIcon } from '@/assets/icons/language-white-icon.svg';

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles['logo-icon']} onClick={() => pushTo(PATH.homePage)}>
        <img src={logoIcon} alt="logo" />
      </div>
      <div className={styles['wrapper-right-content']}>
        <AvatarDropdown />
        {/* <SelectLang className={styles.action} /> */}
        <span className={styles.action}>
          <QuestionIcon className={styles['question-icon']} />
          <LanguageIcon className={styles['language-icon']} />
        </span>
      </div>
    </div>
  );
};

export default Header;
