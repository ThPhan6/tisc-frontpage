import { FC } from 'react';
import { HeaderDropdown, MenuIconProps } from '../HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';

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
      items={actionItems}
    >
      {actionIcon || <ActionIcon />}
    </HeaderDropdown>
  );
};

interface ActionMenuForm extends ActionFormProps {
  handleUpdate?: () => void;
  handleDelete?: () => void;
  specify?: {
    handleSpecify: () => void;
    disabled: boolean;
    label?: string;
  };
}
export const ActionMenu: FC<ActionMenuForm> = ({ handleDelete, handleUpdate, specify }) => {
  const actionItems: MenuIconProps[] = [];

  if (specify) {
    actionItems.push({
      icon: <DispatchIcon />,
      onClick: specify.handleSpecify,
      label: specify.label || 'Specify',
      disabled: specify.disabled,
    });
  }
  if (handleUpdate) {
    actionItems.push({
      icon: <EditIcon />,
      onClick: handleUpdate,
      label: 'Edit',
    });
  }
  if (handleDelete) {
    actionItems.push({
      icon: <DeleteIcon />,
      onClick: handleDelete,
      label: 'Delete',
    });
  }

  return <ActionForm actionItems={actionItems} />;
};
