import { HeaderDropdown, MenuIconProp } from '../HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { FC } from 'react';

interface IActionForm {
  actionItems?: MenuIconProp[];
  actionIcon?: JSX.Element;
  offsetAlign?: [number, number];
  trigger?: 'click' | 'hover' | 'contextMenu';
  arrow?: boolean;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
}

interface IActionMenu extends IActionForm {
  handleUpdate: () => void;
  handleDelete: () => void;
}

export const ActionForm: FC<IActionForm> = ({
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

export const ActionMenu: FC<IActionMenu> = ({ handleDelete, handleUpdate }) => {
  return (
    <ActionForm
      actionItems={[
        {
          icon: <EditIcon />,
          onClick: handleUpdate,
          label: 'Edit',
        },
        {
          icon: <DeleteIcon />,
          onClick: handleDelete,
          label: 'Delete',
        },
      ]}
    />
  );
};
