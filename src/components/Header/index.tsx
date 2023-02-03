import React from 'react';

import { PATH } from '@/constants/path';
import { UserHomePagePaths } from '@/constants/user.constant';
import { HeaderViewProps } from '@ant-design/pro-layout/lib/Header';
import { Row } from 'antd';

import { ReactComponent as AlignRightIcon } from '@/assets/icons/align-right-icon.svg';
import { ReactComponent as LanguageIcon } from '@/assets/icons/language-icon.svg';
import { ReactComponent as LanguageWhiteIcon } from '@/assets/icons/language-white-icon.svg';
import { ReactComponent as QuestionIcon } from '@/assets/icons/question-icon.svg';
import { ReactComponent as QuestionWhiteIcon } from '@/assets/icons/question-white-icon.svg';
import TISCLogoIcon from '@/assets/tisc-logo-icon.svg';

import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean, useCheckPermission } from '@/helper/hook';
import { getValueByCondition } from '@/helper/utils';

import { useAppSelector } from '@/reducers';

import { HeaderDropdown, MenuIconProps } from '../HeaderDropdown';
import { LogoIcon } from '../LogoIcon';
import { SiderMenu } from '../Menu/AsideMenu';
import { CustomDrawer } from '../Modal/Drawer';
import { AvatarDropdown } from './AvatarDropdown';
import styles from './styles/index.less';

const PageHeader = (props: HeaderViewProps) => {
  const { isMobile } = useScreen();
  const showSiderMenu = useBoolean();

  const user = useAppSelector((state) => state.user.user);

  const isTiscUser = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const isBrandUser = useCheckPermission(['Brand Admin', 'Brand Team']);
  const isDesignerUser = useCheckPermission(['Design Admin', 'Design Team']);

  const iconSize = isMobile ? 24 : 16;

  const logoImage = getValueByCondition(
    [
      [isMobile, <AlignRightIcon style={{ color: '#fff' }} width={24} height={24} />],
      [isTiscUser, <img src={TISCLogoIcon} alt="logo" />],
      [isBrandUser, <LogoIcon logo={String(user?.brand?.logo)} size={24} />],
      [isDesignerUser, <LogoIcon logo={String(user?.design?.logo)} size={24} />],
    ],
    '',
  );

  const questionItems = [
    {
      onClick: () => {
        pushTo(PATH.howTo);
      },
      icon: <QuestionIcon width={iconSize} height={iconSize} />,
      label: 'How-To',
    },
  ];

  const languageItems = [
    {
      onClick: () => undefined,
      icon: <LanguageIcon width={iconSize} height={iconSize} />,
      label: 'LANGUAGE',
    },
    {
      onClick: () => undefined,
      label: 'English',
    },
  ];

  const onLeftIconClick = () => {
    if (!user) {
      return false;
    }
    if (!isMobile) {
      return pushTo(UserHomePagePaths[user.type]);
    }
    showSiderMenu.setValue(true);
  };

  const renderHeaderDropDown = (items: MenuIconProps[], icon: React.ReactNode) => (
    <HeaderDropdown
      menuDropdown
      containerClass={styles['dropdown']}
      items={items}
      arrow
      align={{ offset: [0, -4] }}
      placement="topRight"
      trigger={['click']}
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

        {
          <span className={styles.action}>
            {renderHeaderDropDown(questionItems, <QuestionWhiteIcon className={styles.icon} />)}
            {renderHeaderDropDown(languageItems, <LanguageWhiteIcon className={styles.icon} />)}
          </span>
        }
      </div>

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

export default PageHeader;
