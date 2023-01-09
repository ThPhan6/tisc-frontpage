import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';

export const useGeneralFeature = (
  noWrap?: boolean,
  fontLevel?: 1 | 2 | 3 | 4 | 5,
  deleteIcon?: boolean,
  onDelete?: () => void,
  horizontal?: boolean,
) => {
  const labelSpan = horizontal ? (noWrap ? undefined : 4) : 24;
  const inputSpan = horizontal ? (noWrap ? undefined : 20) : 24;
  const fontSize = fontLevel ? ((fontLevel + 2) as 7) : 7;
  const iconDelete = deleteIcon ? (
    <RemoveIcon onClick={onDelete} className="delete-action-input-group" />
  ) : null;

  return { labelSpan, inputSpan, fontSize, iconDelete };
};

export const formatToConversionInputValue = (
  number: number,
  locale: Intl.LocalesArgument = 'en-us',
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  },
) => {
  return number.toLocaleString(locale, options).replace(/,/g, '');
};
