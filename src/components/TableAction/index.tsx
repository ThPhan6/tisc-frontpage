import { FC } from 'react';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as EmailInviteIcon } from '@/assets/icons/email-invite-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';

import { HeaderDropdown, MenuIconProps } from '../HeaderDropdown';

interface ActionFormProps {
  actionItems?: MenuIconProps[];
  actionIcon?: JSX.Element;
  offsetAlign?: [number, number];
  trigger?: 'click' | 'hover' | 'contextMenu';
  arrow?: boolean;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
}

export const ActionForm: FC<ActionFormProps> = ({
  actionItems,
  offsetAlign = [14, -10],
  actionIcon,
  trigger = 'click',
  arrow = true,
  placement = 'bottomRight',
}) => {
  return (
    <HeaderDropdown
      arrow={arrow}
      align={{ offset: offsetAlign }}
      trigger={[trigger]}
      placement={placement}
      items={actionItems}>
      {actionIcon || <ActionIcon />}
    </HeaderDropdown>
  );
};

type ActionType = 'specify' | 'updated' | 'deleted' | 'view' | 'invite';

type ActionMenuForm = ActionFormProps & {
  [key in ActionType]?: MenuIconProps;
};

export const ActionMenu: FC<ActionMenuForm> = ({ specify, deleted, updated, view, invite }) => {
  const actionItems: MenuIconProps[] = [];

  if (specify) {
    actionItems.push({
      icon: specify.icon || <DispatchIcon />,
      onClick: specify.onClick,
      label: specify.label || 'Specify',
      disabled: specify.disabled || undefined,
      containerClass: specify.containerClass || '',
    });
  }
  if (view) {
    actionItems.push({
      icon: view.icon || <ViewIcon />,
      onClick: view.onClick,
      label: view.label || 'View',
      disabled: view.disabled || undefined,
      containerClass: view.containerClass || '',
    });
  }
  if (invite) {
    actionItems.push({
      icon: invite.icon || <EmailInviteIcon />,
      onClick: invite.onClick,
      label: invite.label || 'Email Invite',
      disabled: invite.disabled || undefined,
      containerClass: invite.containerClass || '',
    });
  }
  if (updated) {
    actionItems.push({
      icon: updated.icon || <EditIcon />,
      onClick: updated.onClick,
      label: updated.label || 'Update',
      disabled: updated.disabled || undefined,
      containerClass: updated.containerClass || '',
    });
  }
  if (deleted) {
    actionItems.push({
      icon: deleted.icon || <DeleteIcon />,
      onClick: deleted.onClick,
      label: deleted.label || 'Delete',
      disabled: deleted.disabled || undefined,
      containerClass: deleted.containerClass || '',
    });
  }

  return <ActionForm actionItems={actionItems} />;
};
