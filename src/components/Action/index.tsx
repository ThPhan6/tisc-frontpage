import { HeaderDropdown, MenuIconProps } from '../HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { FC } from 'react';

interface ActionFormProps {
  actionItems?: MenuIconProps[];
  actionIcon?: JSX.Element;
  offsetAlign?: [number, number];
  trigger?: 'click' | 'hover' | 'contextMenu';
  arrow?: boolean;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
}

interface ActionMenuForm extends ActionFormProps {
  handleUpdate?: () => void;
  handleDelete?: () => void;
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
      items={actionItems?.map((item) => ({
        onClick: item.onClick,
        icon: item.icon && item.icon,
        label: item.label,
      }))}
    >
      {actionIcon ? actionIcon : <ActionIcon />}
    </HeaderDropdown>
  );
};

export const ActionMenu: FC<ActionMenuForm> = ({ handleDelete, handleUpdate }) => {
  const actionItems = [];
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
