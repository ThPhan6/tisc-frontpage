import { PATH } from '@/constants/path';
import { Avatar, Spin } from 'antd';
import { useModel } from 'umi';

import DefaultAvatarIcon from '@/assets/icons/ic-user-white.svg';
import { ReactComponent as LogOutIcon } from '@/assets/icons/outside-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon.svg';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getFullName, showImageUrl } from '@/helper/utils';

import store from '@/reducers';

import { MenuHeaderDropdown } from '@/components/HeaderDropdown';
import { setCustomProductList } from '@/pages/Designer/Products/CustomLibrary/slice';

import { HeaderDropdown } from '../HeaderDropdown';
import { BodyText } from '../Typography';
import styles from './styles/AvatarDropdown.less';

export const AvatarDropdown = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const showHeaderDropdown = useBoolean();

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

  const menuHeaderDropdown = (
    <MenuHeaderDropdown
      items={[
        {
          onClick: () => {
            pushTo(PATH.profiles);
          },
          icon: <UserIcon />,
          label: 'User profiles',
        },
        {
          onClick: loginOut,
          icon: <LogOutIcon />,
          label: 'Logout',
        },
      ]}
    />
  );

  return (
    <HeaderDropdown
      containerClass={styles.dropdown}
      overlay={menuHeaderDropdown}
      arrow
      arrowPositionCenter
      visible={showHeaderDropdown.value}
      onVisibleChange={showHeaderDropdown.setValue}
      align={{ offset: [0, 2] }}
      placement="bottom"
      trigger={['click']}
      getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}>
      <span className={`${styles.container}`}>
        <Avatar
          size="small"
          className={`${styles.avatar} ${currentUser?.avatar ? '' : 'default'}`}
          src={currentUser?.avatar ? showImageUrl(currentUser.avatar) : DefaultAvatarIcon}
          alt="avatar"
        />
        <BodyText fontFamily="Roboto" level={4} customClass={styles['user-name']}>
          {getFullName(currentUser)}
        </BodyText>
      </span>
    </HeaderDropdown>
  );
};
