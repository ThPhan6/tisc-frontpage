import { ReactNode } from 'react';

import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';

export const useGeneralFeature = (
  noWrap?: boolean,
  fontLevel?: 1 | 2 | 3 | 4 | 5,
  deleteIcon?: boolean | ReactNode,
  onDelete?: () => void,
) => {
  const span_4 = noWrap ? undefined : 4;
  const span_20 = noWrap ? undefined : 20;
  const hasFontLevel = fontLevel ? ((fontLevel + 2) as 7) : 7;
  const hasDeleteIcon =
    deleteIcon === true ? (
      <RemoveIcon onClick={onDelete} className="delete-action-input-group" />
    ) : (
      deleteIcon
    );

  return { span_4, span_20, hasFontLevel, hasDeleteIcon };
};
