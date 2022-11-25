import { FC } from 'react';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';
import { ReactComponent as LogOutIcon } from '@/assets/icons/outside-icon.svg';
import { ReactComponent as CopyIcon } from '@/assets/icons/tabs-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon.svg';

import { HeaderDropdown, HeaderDropdownProps, MenuIconProps } from '../HeaderDropdown';

type ActionType =
  | 'specify'
  | 'updated'
  | 'copy'
  | 'deleted'
  | 'view'
  | 'invite'
  | 'user'
  | 'logout';

interface ActionFormProps extends HeaderDropdownProps {
  actionItems?: (MenuIconProps & { type: ActionType })[];
  actionIcon?: JSX.Element;
  offsetAlign?: [number, number];
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
};

export const ActionMenu: FC<ActionFormProps> = ({
  actionItems,
  offsetAlign = [14, -10],
  actionIcon,
  trigger = ['click'],
  arrow = true,
  placement = 'bottomRight',
  ...props
}) => {
  const filledActionItems = actionItems?.map((item) => ({
    ...item,
    icon: item.icon || DEFAULT_ACTION_INFO[item.type].icon,
    label: item.label || DEFAULT_ACTION_INFO[item.type].label,
  }));

  return (
    <HeaderDropdown
      {...props}
      arrow={arrow}
      align={{ offset: offsetAlign }}
      trigger={trigger}
      placement={placement}
      items={filledActionItems}>
      <div onClick={(e) => e.stopPropagation()}>{actionIcon || <ActionIcon />}</div>
    </HeaderDropdown>
  );
};
