import { PATH } from '@/constants/path';
import { Spin } from 'antd';
import { useModel } from 'umi';

import DefaultAvatarIcon from '@/assets/icons/ic-user-white.svg';
import { ReactComponent as LogOutIcon } from '@/assets/icons/outside-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon.svg';

import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getFullName, showImageUrl } from '@/helper/utils';

import store from '@/reducers';

import { MenuHeaderDropdown } from '@/components/HeaderDropdown';
import { setCustomProductList } from '@/pages/Designer/Products/CustomLibrary/slice';

import { HeaderDropdown } from '../HeaderDropdown';
import { DrawerMenu } from '../Menu/DrawerMenu';
import TeamIcon from '../TeamIcon/TeamIcon';
import { BodyText } from '../Typography';
import styles from './styles/AvatarDropdown.less';

export const AvatarDropdown = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const showHeaderDropdown = useBoolean();

  const { isMobile } = useScreen();

  const loginOut = async () => {
    setInitialState((s) => ({ ...s, currentUser: undefined }));
    store.dispatch(setCustomProductList([]));
    localStorage.clear();
    pushTo(PATH.landingPage);
  };

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  const iconWidth = isMobile ? 24 : 16;

  const menuItems = [
    {
      onClick: () => {
        showHeaderDropdown.setValue(false);
        pushTo(PATH.profiles);
      },
      icon: <UserIcon width={iconWidth} height={iconWidth} />,
      label: 'User profiles',
    },
    {
      onClick: () => {
        showHeaderDropdown.setValue(false);
        loginOut();
      },
      icon: <LogOutIcon width={iconWidth} height={iconWidth} />,
      label: 'Logout',
    },
  ];

  const renderAvatarTrigger = (trigger?: boolean) => (
    <span
      className={`${styles.container}`}
      onClick={trigger ? () => showHeaderDropdown.setValue(true) : undefined}>
      <TeamIcon
        customClass={`${styles.avatar} ${currentUser?.avatar ? '' : 'default'}`}
        avatar={currentUser?.avatar ? showImageUrl(currentUser.avatar) : DefaultAvatarIcon}
      />
      {
        <BodyText fontFamily="Roboto" level={4} customClass={styles['user-name']} color="white">
          {getFullName(currentUser)}
        </BodyText>
      }
    </span>
  );

  if (isMobile) {
    return (
      <>
        {renderAvatarTrigger(true)}

        <DrawerMenu
          visible={showHeaderDropdown.value}
          onClose={() => showHeaderDropdown.setValue(false)}
          items={menuItems}
        />
      </>
    );
  }

  return (
    <HeaderDropdown
      containerClass={styles.dropdown}
      overlay={<MenuHeaderDropdown items={menuItems} />}
      arrow
      arrowPositionCenter
      visible={showHeaderDropdown.value}
      onVisibleChange={showHeaderDropdown.setValue}
      align={{ offset: [0, 2] }}
      placement="bottom"
      trigger={['click']}
      getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}>
      {renderAvatarTrigger()}
    </HeaderDropdown>
  );
};
