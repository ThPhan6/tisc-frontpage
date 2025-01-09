import { PATH } from '@/constants/path';
import { Spin } from 'antd';
import { useModel } from 'umi';

import DefaultAvatarIcon from '@/assets/icons/ic-user-white.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { ReactComponent as LogOutIcon } from '@/assets/icons/outside-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon.svg';

import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getFullName, showImageUrl } from '@/helper/utils';
import { switchToWorkspace } from '@/pages/LandingPage/services/api';

import store, { useAppSelector } from '@/reducers';

import { setCustomProductList } from '@/pages/Designer/Products/CustomLibrary/slice';

import { HeaderDropdown, MenuIconProps } from '../HeaderDropdown';
import TeamIcon from '../TeamIcon/TeamIcon';
import { BodyText } from '../Typography';
import styles from './styles/AvatarDropdown.less';

export const AvatarDropdown = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const workspaces = useAppSelector((state) => state.user.user?.workspaces || []);
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

  console.log('workspaces', workspaces);

  const { currentUser } = initialState;

  const iconWidth = isMobile ? 24 : 16;

  const menuItems: MenuIconProps[] = [
    {
      onClick: () => {
        showHeaderDropdown.setValue(false);
        pushTo(PATH.profiles);
      },
      icon: <UserIcon width={iconWidth} height={iconWidth} />,
      label: 'User profiles',
    },
    {
      onClick: () => {},
      icon: <InternetIcon width={iconWidth} height={iconWidth} />,
      label: 'User workspaces',
      containerClass: 'workspace',
      additionalStyle: {
        cursor: 'default',
      },
    },
    ...workspaces.map((workspace) => ({
      onClick: async () => {
        showHeaderDropdown.setValue(false);
        if (!workspace?.id || workspace.id === currentUser?.relation_id) return;

        const response = await switchToWorkspace(workspace.id);

        if (response?.token) {
          localStorage.setItem('access_token', response.token);
          window.location.replace('/');
        }
      },
      icon: (
        <img
          src={showImageUrl(workspace.logo)}
          style={{
            width: 16,
            height: 16,
          }}
        />
      ),
      label: workspace.name,
      containerClass: 'workspace-item',
      additionalStyle: {
        backgroundColor: workspace.id === currentUser?.relation_id ? '#FFCDB3' : 'transparent',
      },
    })),
    {
      onClick: () => {
        showHeaderDropdown.setValue(false);
        loginOut();
      },
      icon: <LogOutIcon width={iconWidth} height={iconWidth} />,
      label: 'Logout',
      containerClass: 'logout',
    },
  ];

  const renderAvatarTrigger = (trigger?: boolean) => (
    <span
      className={`${styles.container}`}
      onClick={trigger ? () => showHeaderDropdown.setValue(true) : undefined}
    >
      {currentUser?.avatar ? (
        <TeamIcon customClass={styles.avatar} avatar={currentUser?.avatar} />
      ) : (
        <img
          className={`default ${styles.avatar}`}
          src={DefaultAvatarIcon}
          alt="avatar"
          style={{
            height: 20,
            width: 20,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      )}
      {isMobile ? null : (
        <BodyText
          fontFamily="Roboto"
          level={4}
          customClass={`text-overflow ${styles['user-name']}`}
          color="white"
          style={{ maxWidth: '50vw', marginRight: 40 }}
        >
          {getFullName(currentUser)}
        </BodyText>
      )}
    </span>
  );

  return (
    <HeaderDropdown
      menuDropdown
      containerClass={styles.dropdown}
      items={menuItems}
      arrow
      arrowPositionCenter
      align={{ offset: [0, 2] }}
      placement="bottom"
      trigger={['click']}
    >
      {renderAvatarTrigger()}
    </HeaderDropdown>
  );
};
