import React from 'react';

import { PATH } from '@/constants/path';
import { UserHomePagePaths } from '@/constants/user.constant';
import { Row } from 'antd';

import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as LanguageIcon } from '@/assets/icons/language-icon.svg';
import { ReactComponent as LanguageWhiteIcon } from '@/assets/icons/language-white-icon.svg';
import MenuIcon from '@/assets/icons/mobile/hamburger-menu.svg';
import { ReactComponent as QuestionIcon } from '@/assets/icons/question-icon.svg';
import { ReactComponent as QuestionWhiteIcon } from '@/assets/icons/question-white-icon.svg';
import LogoIcon from '@/assets/tisc-logo-icon.svg';

import { useCheckMobile } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { useAppSelector } from '@/reducers';

import { HeaderDropdown, MenuHeaderDropdown } from '../HeaderDropdown';
import { DrawerMenu } from '../Menu/DrawerMenu';
import { AvatarDropdown } from './AvatarDropdown';
import styles from './styles/index.less';

const Header = () => {
  const isMobile = useCheckMobile();
  const showQuestionDropdown = useBoolean();
  const showLanguageDropdown = useBoolean();
  const showFaqMenu = useBoolean();

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

  const renderHeaderDropDown = (
    overlay: React.ReactElement | (() => React.ReactNode),
    visible: {
      value: boolean;
      setValue: React.Dispatch<boolean>;
    },
    icon: React.ReactNode,
  ) => (
    <HeaderDropdown
      containerClass={styles['dropdown']}
      overlay={overlay}
      arrow
      visible={visible.value}
      onVisibleChange={visible.setValue}
      align={{ offset: [0, -4] }}
      placement="topRight"
      trigger={['click']}
      getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}>
      {icon}
    </HeaderDropdown>
  );

  return (
    <Row
      className={`${styles.container} ${isMobile ? styles.mobile : ''}`}
      justify={'space-between'}>
      <div className={styles['logo-icon']} onClick={handleRedirectHomePage}>
        <img src={isMobile ? MenuIcon : LogoIcon} alt="logo" />
      </div>

      <div className={styles['wrapper-right-content']}>
        <AvatarDropdown />

        {isMobile ? (
          <div className="flex-center cursor-pointer" onClick={() => showFaqMenu.setValue(true)}>
            <ActionIcon width={24} height={24} style={{ marginTop: 0, marginLeft: 12 }} />
          </div>
        ) : (
          <span className={styles.action}>
            {renderHeaderDropDown(
              menuQuestionDropdown,
              showQuestionDropdown,
              <QuestionWhiteIcon className={styles.icon} />,
            )}
            {renderHeaderDropDown(
              menuLanguageDropdown,
              showLanguageDropdown,
              <LanguageWhiteIcon className={styles.icon} />,
            )}
          </span>
        )}
      </div>

      <DrawerMenu
        visible={showFaqMenu.value}
        onClose={() => showFaqMenu.setValue(false)}
        items={[
          {
            onClick: () => {
              showFaqMenu.setValue(false);
              pushTo(PATH.howTo);
            },
            icon: <QuestionIcon width={20} height={20} />,
            label: 'How-To',
          },
          {
            onClick: () => {
              showFaqMenu.setValue(false);
            },
            icon: <LanguageIcon width={20} height={20} />,
            label: 'English',
          },
        ]}
      />
    </Row>
  );
};

export default Header;
