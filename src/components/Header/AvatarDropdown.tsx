import { Avatar, Spin } from 'antd';
import { useModel } from 'umi';
import { HeaderDropdown } from '../HeaderDropdown';
import styles from './styles/AvatarDropdown.less';
import AvatarIcon from '@/assets/icons/avatar-icon.svg';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { BodyText } from '../Typography';
import { ReactComponent as LogOutIcon } from '@/assets/icons/outside-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon.svg';
import { MenuHeaderDropdown } from '@/components/HeaderDropdown';
import { getFullName, showImageUrl } from '@/helper/utils';
import { useBoolean } from '@/helper/hook';

export const AvatarDropdown = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const showHeaderDropdown = useBoolean();

  const loginOut = async () => {
    setInitialState((s) => ({ ...s, currentUser: undefined }));
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
            showHeaderDropdown.setValue(false);
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
      align={{ offset: [0, 11] }}
      placement="topLeft"
      trigger={['click']}
      getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
    >
      <span className={`${styles.container}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={currentUser?.avatar ? showImageUrl(currentUser.avatar) : AvatarIcon}
          alt="avatar"
        />
        <BodyText fontFamily="Roboto" level={4} customClass={styles['user-name']}>
          {/* {`${currentUser?.lastname} ${currentUser?.firstname}`} */}
          {getFullName(currentUser)}
        </BodyText>
      </span>
    </HeaderDropdown>
  );
};
