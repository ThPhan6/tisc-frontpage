import { CSSProperties, FC } from 'react';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as BillingIcon } from '@/assets/icons/billing-icon.svg';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';
import { ReactComponent as LogOutIcon } from '@/assets/icons/outside-icon.svg';
import { ReactComponent as CopyIcon } from '@/assets/icons/tabs-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon.svg';

import { useScreen } from '@/helper/common';

import { HeaderDropdown, HeaderDropdownProps, MenuIconProps } from '../HeaderDropdown';
import styles from './index.less';

type ActionType =
  | 'specify'
  | 'updated'
  | 'copy'
  | 'deleted'
  | 'view'
  | 'invite'
  | 'user'
  | 'logout'
  | 'billing';

interface ActionFormProps extends HeaderDropdownProps {
  actionItems?: (MenuIconProps & { type: ActionType })[];
  actionIcon?: JSX.Element;
  offsetAlign?: [number, number];
  containerStyle?: CSSProperties;
  editActionOnMobile?: boolean;
  disabledOnMobile?: boolean;
}

const DEFAULT_ACTION_INFO: {
  [key in ActionType]: {
    icon: JSX.Element;
    label: string;
  };
} = {
  specify: {
    icon: <DispatchIcon />,
    label: 'Specify',
  },
  view: {
    icon: <ViewIcon />,
    label: 'View',
  },
  invite: {
    icon: <EmailInviteIcon />,
    label: 'Email Invite',
  },
  copy: {
    icon: <CopyIcon />,
    label: 'Copy',
  },
  updated: {
    icon: <EditIcon />,
    label: 'Edit',
  },
  deleted: {
    icon: <DeleteIcon />,
    label: 'Delete',
  },
  user: {
    icon: <UserIcon />,
    label: 'User profiles',
  },
  logout: {
    icon: <LogOutIcon />,
    label: 'Logout',
  },
  billing: {
    icon: <BillingIcon />,
    label: 'Billing',
  },
};

export const ActionMenu: FC<ActionFormProps> = ({
  actionItems,
  offsetAlign = [14, 4],
  actionIcon,
  trigger = ['click'],
  arrow = true,
  placement = 'bottomRight',
  containerStyle,
  editActionOnMobile = true,
  disabledOnMobile,
  ...props
}) => {
  const isTablet = useScreen().isTablet;
  const filledActionItems = actionItems?.map((item) => ({
    ...item,
    icon: item.icon || DEFAULT_ACTION_INFO[item.type].icon,
    label: item.label || DEFAULT_ACTION_INFO[item.type].label,
  }));

  if (isTablet && editActionOnMobile) {
    return (
      <div
        className={styles.iconShowed}
        onClick={(e) => {
          if (disabledOnMobile) return;

          e.stopPropagation();
          e.preventDefault();

          filledActionItems?.[0]?.onClick();
        }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: disabledOnMobile ? '#BFBFBF' : undefined,
          height: 16,
          width: 16,
        }}
      >
        {filledActionItems?.[0].icon ?? <EditIcon />}
      </div>
    );
  }

  return (
    <div
      style={containerStyle}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <HeaderDropdown
        {...props}
        arrow={arrow}
        align={{ offset: offsetAlign }}
        trigger={trigger}
        placement={placement}
        items={filledActionItems}
      >
        {actionIcon || <ActionIcon />}
      </HeaderDropdown>
    </div>
  );
};
