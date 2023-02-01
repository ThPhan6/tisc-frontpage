import React from 'react';

import { PATH } from '@/constants/path';
import { UserHomePagePaths } from '@/constants/user.constant';

import { ReactComponent as LanguageIcon } from '@/assets/icons/language-icon.svg';
import { ReactComponent as LanguageWhiteIcon } from '@/assets/icons/language-white-icon.svg';
import { ReactComponent as QuestionIcon } from '@/assets/icons/question-icon.svg';
import { ReactComponent as QuestionWhiteIcon } from '@/assets/icons/question-white-icon.svg';
import logoIcon from '@/assets/tisc-logo-icon.svg';

import { pushTo } from '@/helper/history';
import { useBoolean, useCheckPermission } from '@/helper/hook';
import { getValueByCondition } from '@/helper/utils';

import { useAppSelector } from '@/reducers';

import { HeaderDropdown, MenuHeaderDropdown } from '../HeaderDropdown';
import { LogoIcon } from '../LogoIcon';
import { AvatarDropdown } from './AvatarDropdown';
import styles from './styles/index.less';

const Header = () => {
  const showQuestionDropdown = useBoolean();
  const showLanguageDropdown = useBoolean();
  const user = useAppSelector((state) => state.user.user);

  const isTiscUser = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const isBrandUser = useCheckPermission(['Brand Admin', 'Brand Team']);
  const isDesignerUser = useCheckPermission(['Design Admin', 'Design Team']);

  const logoImage = getValueByCondition(
    [
      [isTiscUser, <LogoIcon logo={logoIcon} size={24} />],
      [isBrandUser, <LogoIcon logo={String(user?.brand?.logo)} size={24} />],
      [isDesignerUser, <LogoIcon logo={String(user?.design?.logo)} size={24} />],
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
    <div className={styles.container}>
      <div className={styles['logo-icon']} onClick={handleRedirectHomePage}>
        {logoImage}
      </div>
      <div className={styles['wrapper-right-content']}>
        <AvatarDropdown />
        {/* <SelectLang className={styles.action} /> */}
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
      </div>
    </div>
  );
};

export default Header;
