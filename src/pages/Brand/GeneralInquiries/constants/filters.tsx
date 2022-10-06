import { ReactComponent as PendingIcon } from '@/assets/icons/pending-icon.svg';
import { ReactComponent as RespondedIcon } from '@/assets/icons/responsed-icon.svg';

export interface TopBarFilterValueProps {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

export const FilterValues = {
  global: -1,
  pending: 1,
  responded: 2,
};

export const FilterNames = {
  [FilterValues.global]: 'VIEW ALL',
  [FilterValues.pending]: 'Pending',
  [FilterValues.responded]: 'Responded',
};

export const FilterStatusIcons = {
  [FilterValues.pending]: <PendingIcon className="icon-align" />,
  [FilterValues.responded]: <RespondedIcon className="icon-align" />,
};

export const GlobalFilter: TopBarFilterValueProps = {
  id: FilterValues.global,
  name: FilterNames[FilterValues.global],
};

export const GeneralInquiryStatuses: TopBarFilterValueProps[] = [
  {
    id: FilterValues.pending,
    name: FilterNames[FilterValues.pending],
    icon: FilterStatusIcons[FilterValues.pending],
  },
  {
    id: FilterValues.responded,
    name: FilterNames[FilterValues.responded],
    icon: FilterStatusIcons[FilterValues.responded],
  },
];

export const GeneralInquiryFilters: TopBarFilterValueProps[] = [
  GlobalFilter,
  ...GeneralInquiryStatuses,
];
