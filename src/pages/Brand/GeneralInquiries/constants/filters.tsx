import { ReactComponent as PendingIcon } from '@/assets/icons/action-pending-icon.svg';
import { ReactComponent as RespondedIcon } from '@/assets/icons/action-responded-icon.svg';

export interface TopBarFilterValueProps {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

export const FilterValues = {
  global: -1,
  pending: 0,
  Responded: 1,
};

export const FilterNames = {
  [FilterValues.global]: 'VIEW ALL',
  [FilterValues.pending]: 'Pending',
  [FilterValues.Responded]: 'Responded',
};

export const FilterStatusIcons = {
  [FilterValues.pending]: <PendingIcon />,
  [FilterValues.Responded]: <RespondedIcon />,
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
    id: FilterValues.Responded,
    name: FilterNames[FilterValues.Responded],
    icon: FilterStatusIcons[FilterValues.Responded],
  },
];

export const GeneralInquiryFilters: TopBarFilterValueProps[] = [
  GlobalFilter,
  ...GeneralInquiryStatuses,
];
