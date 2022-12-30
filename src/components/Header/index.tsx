import React from 'react';

import { PATH } from '@/constants/path';
import { UserHomePagePaths } from '@/constants/user.constant';
import { USER_ROLE } from '@/constants/userRoles';
import { HeaderViewProps } from '@ant-design/pro-layout/lib/Header';
import SiderMenu from '@ant-design/pro-layout/lib/components/SiderMenu/SiderMenu';
import { Row } from 'antd';

import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as LanguageIcon } from '@/assets/icons/language-icon.svg';
import { ReactComponent as LanguageWhiteIcon } from '@/assets/icons/language-white-icon.svg';
import { ReactComponent as QuestionIcon } from '@/assets/icons/question-icon.svg';
import { ReactComponent as QuestionWhiteIcon } from '@/assets/icons/question-white-icon.svg';
import TISCLogoIcon from '@/assets/tisc-logo-icon.svg';

import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetUserRoleFromPathname } from '@/helper/hook';
import { getValueByCondition } from '@/helper/utils';

import { useAppSelector } from '@/reducers';

import { HeaderDropdown, MenuHeaderDropdown } from '../HeaderDropdown';
import { LogoIcon } from '../LogoIcon';
import { DrawerMenu } from '../Menu/DrawerMenu';
import { CustomDrawer } from '../Modal/Drawer';
import { AvatarDropdown } from './AvatarDropdown';
import styles from './styles/index.less';

const Header = (props: HeaderViewProps) => {
  const { isMobile } = useScreen();
  const showQuestionDropdown = useBoolean();
  const showLanguageDropdown = useBoolean();
  const showFaqMenu = useBoolean();
  const showSiderMenu = useBoolean();

  const user = useAppSelector((state) => state.user.user);

  const currentUser = useGetUserRoleFromPathname();
  const isTiscUser = currentUser === USER_ROLE.tisc;
  const isBrandUser = currentUser === USER_ROLE.brand;
  const isDesignerUser = currentUser === USER_ROLE.design;

  const logoImage = getValueByCondition(
    [
      [isTiscUser, <img src={TISCLogoIcon} alt="logo" />],
      [isBrandUser, <LogoIcon logo={String(user?.brand?.logo)} />],
      [isDesignerUser, <LogoIcon logo={String(user?.design?.logo)} />],
    ],
    '',
  );

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

  const onLeftIconClick = () => {
    if (!user) {
      return false;
    }
    if (!isMobile) {
      return pushTo(UserHomePagePaths[user.type]);
    }
    showSiderMenu.setValue(true);
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
      getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
    >
      {icon}
    </HeaderDropdown>
  );

  return (
    <Row
      className={`${styles.container} ${isMobile ? styles.mobile : ''}`}
      justify={'space-between'}
      align="middle"
    >
      <div className={styles['logo-icon']} onClick={onLeftIconClick}>
        {logoImage}
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

      <CustomDrawer
        className="sider-menu"
        visible={showSiderMenu.value}
        onClose={() => showSiderMenu.setValue(false)}
        placement="left"
        closable={false}
        height="auto"
        closeOnMask
        width="100%"
        bodyStyle={{ padding: 0, position: 'relative' }}
      >
        <SiderMenu
          appProps={props.children}
          menu={props.menuData}
          onClose={() => showSiderMenu.setValue(false)}
        />
      </CustomDrawer>
    </Row>
  );
};

export default Header;
