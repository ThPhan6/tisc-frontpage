import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';

export const useGeneralFeature = (
  noWrap?: boolean,
  fontLevel?: 1 | 2 | 3 | 4 | 5,
  deleteIcon?: boolean,
  onDelete?: () => void,
) => {
  const labelSpan = noWrap ? undefined : 4;
  const inputSpan = noWrap ? undefined : 20;
  const fontSize = fontLevel ? ((fontLevel + 2) as 7) : 7;
  const iconDelete = deleteIcon ? (
    <RemoveIcon onClick={onDelete} className="delete-action-input-group" />
  ) : null;

  return { labelSpan, inputSpan, fontSize, iconDelete };
};
