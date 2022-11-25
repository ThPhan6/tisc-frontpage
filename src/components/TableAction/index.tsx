import { FC } from 'react';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as BillingIcon } from '@/assets/icons/billing-icon.svg';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';
import { ReactComponent as LogOutIcon } from '@/assets/icons/outside-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon.svg';

import { HeaderDropdown, MenuIconProps } from '../HeaderDropdown';

type ActionType =
  | 'specify'
  | 'updated'
  | 'deleted'
  | 'view'
  | 'invite'
  | 'user'
  | 'logout'
  | 'billing'
  | 'updateOrView';

interface ActionFormProps {
  actionItems?: (MenuIconProps & { type: ActionType })[];
  actionIcon?: JSX.Element;
  offsetAlign?: [number, number];
  trigger?: 'click' | 'hover' | 'contextMenu';
  arrow?: boolean;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
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
  updateOrView: {
    icon: <EditIcon />,
    label: 'Edit/View',
  },
};

export const ActionMenu: FC<ActionFormProps> = ({
  actionItems,
  offsetAlign = [14, -10],
  actionIcon,
  trigger = 'click',
  arrow = true,
  placement = 'bottomRight',
}) => {
  const filledActionItems = actionItems?.map((item) => ({
    ...item,
    icon: item.icon || DEFAULT_ACTION_INFO[item.type].icon,
    label: item.label || DEFAULT_ACTION_INFO[item.type].label,
  }));

  return (
    <HeaderDropdown
      arrow={arrow}
      align={{ offset: offsetAlign }}
      trigger={[trigger]}
      placement={placement}
      items={filledActionItems}>
      {actionIcon || <ActionIcon />}
    </HeaderDropdown>
  );
};
