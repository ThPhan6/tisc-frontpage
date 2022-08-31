import { PATH } from '@/constants/path';
import { UserHomePagePaths } from '@/constants/user.constant';

import { ReactComponent as LanguageIcon } from '@/assets/icons/language-icon.svg';
import { ReactComponent as LanguageWhiteIcon } from '@/assets/icons/language-white-icon.svg';
import { ReactComponent as QuestionIcon } from '@/assets/icons/question-icon.svg';
import { ReactComponent as QuestionWhiteIcon } from '@/assets/icons/question-white-icon.svg';
import logoIcon from '@/assets/tisc-logo-icon.svg';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { useAppSelector } from '@/reducers';

import { HeaderDropdown, MenuHeaderDropdown } from '../HeaderDropdown';
import { AvatarDropdown } from './AvatarDropdown';
import styles from './styles/index.less';

const Header = () => {
  const showQuestionDropdown = useBoolean();
  const showLanguageDropdown = useBoolean();
  const user = useAppSelector((state) => state.user.user);

  const menuQuestionDropdown = (
    <MenuHeaderDropdown
      items={[
        {
          onClick: () => {
            showQuestionDropdown.setValue(false);
            pushTo(PATH.howTo);
          },
          icon: <QuestionIcon />,
          label: 'How-To',
        },
      ]}
    />
  );

  const menuLanguageDropdown = (
    <MenuHeaderDropdown
      items={[
        {
          onClick: () => {
            showLanguageDropdown.setValue(false);
          },
          icon: <LanguageIcon />,
          label: 'LANGUAGE',
        },
        {
          onClick: () => {
            showLanguageDropdown.setValue(false);
          },
          label: 'English',
        },
      ]}
    />
  );

  const handleRedirectHomePage = () => {
    if (!user) {
      return false;
    }
    return pushTo(UserHomePagePaths[user.type]);
  };

  return (
    <div className={styles.container}>
      <div className={styles['logo-icon']} onClick={handleRedirectHomePage}>
        <img src={logoIcon} alt="logo" />
      </div>
      <div className={styles['wrapper-right-content']}>
        <AvatarDropdown />
        {/* <SelectLang className={styles.action} /> */}
        <span className={styles.action}>
          <HeaderDropdown
            containerClass={styles['dropdown']}
            overlay={menuQuestionDropdown}
            arrow
            visible={showQuestionDropdown.value}
            onVisibleChange={showQuestionDropdown.setValue}
            align={{ offset: [0, 11] }}
            placement="topRight"
            trigger={['click']}
            getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}>
            <QuestionWhiteIcon className={styles.icon} />
          </HeaderDropdown>
          <HeaderDropdown
            containerClass={styles['dropdown']}
            overlay={menuLanguageDropdown}
            arrow
            visible={showLanguageDropdown.value}
            onVisibleChange={showLanguageDropdown.setValue}
            align={{ offset: [0, 11] }}
            placement="topRight"
            trigger={['click']}
            getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}>
            <LanguageWhiteIcon className={styles.icon} />
          </HeaderDropdown>
        </span>
      </div>
    </div>
  );
};

export default Header;
