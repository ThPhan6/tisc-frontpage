import { ReactComponent as PendingIcon } from '@/assets/icons/action-pending-icon.svg';
import { ReactComponent as RespondedIcon } from '@/assets/icons/action-responded-icon.svg';
import { ReactComponent as KeepInViewIcon } from '@/assets/icons/eye-icon.svg';
import { ReactComponent as FollowedIcon } from '@/assets/icons/followed-icon.svg';
import { ReactComponent as HighPriorityIcon } from '@/assets/icons/high-priority-icon.svg';
import { ReactComponent as LowPriorityIcon } from '@/assets/icons/low-priority-icon.svg';
import { ReactComponent as MidPriorityIcon } from '@/assets/icons/mid-priority-icon.svg';
import { ReactComponent as NonPriorityIcon } from '@/assets/icons/non-priority-icon.svg';
import { ReactComponent as ProjectArchivedIcon } from '@/assets/icons/project-archived-icon.svg';
import { ReactComponent as ProjectLiveIcon } from '@/assets/icons/project-live-icon.svg';
import { ReactComponent as ProjectOnHoldIcon } from '@/assets/icons/project-on-hold-icon.svg';

import { DropDownFilterValueProps } from '@/components/TopBar/types';

export enum ProjectStatus {
  'Live',
  'On Hold',
  'Archive',
}

export enum ProjectTrackingPriority {
  'Non',
  'High priority',
  'Mid priority',
  'Low priority',
}

export enum Global {
  'VIEW ALL' = -1,
}

export const GlobalFilter: DropDownFilterValueProps = {
  id: Global['VIEW ALL'],
  name: Global[Global['VIEW ALL']],
};

export const FilterStatusIcons = {
  [ProjectStatus.Live]: <ProjectLiveIcon className="icon-align" />,
  [ProjectStatus['On Hold']]: <ProjectOnHoldIcon className="icon-align" />,
  [ProjectStatus.Archive]: <ProjectArchivedIcon className="icon-align" />,
};

export const ProjectStatuses: DropDownFilterValueProps[] = [
  {
    id: ProjectStatus.Live,
    name: ProjectStatus[ProjectStatus.Live],
    icon: FilterStatusIcons[ProjectStatus.Live],
  },
  {
    id: ProjectStatus['On Hold'],
    name: ProjectStatus[ProjectStatus['On Hold']],
    icon: FilterStatusIcons[ProjectStatus['On Hold']],
  },
  {
    id: ProjectStatus.Archive,
    name: ProjectStatus[ProjectStatus.Archive],
    icon: FilterStatusIcons[ProjectStatus.Archive],
  },
];

export const ProjectStatusFilters: DropDownFilterValueProps[] = [GlobalFilter, ...ProjectStatuses];

export const PriorityIcons = {
  [ProjectTrackingPriority.Non]: <NonPriorityIcon className="icon-align" />,
  [ProjectTrackingPriority['High priority']]: <HighPriorityIcon className="icon-align" />,
  [ProjectTrackingPriority['Mid priority']]: <MidPriorityIcon className="icon-align" />,
  [ProjectTrackingPriority['Low priority']]: <LowPriorityIcon className="icon-align" />,
};

export const ProjectPriority: DropDownFilterValueProps[] = [
  {
    id: ProjectTrackingPriority.Non,
    name: ProjectTrackingPriority[ProjectTrackingPriority.Non],
    icon: PriorityIcons[ProjectTrackingPriority.Non],
  },
  {
    id: ProjectTrackingPriority['High priority'],
    name: ProjectTrackingPriority[ProjectTrackingPriority['High priority']],
    icon: PriorityIcons[ProjectTrackingPriority['High priority']],
  },
  {
    id: ProjectTrackingPriority['Mid priority'],
    name: ProjectTrackingPriority[ProjectTrackingPriority['Mid priority']],
    icon: PriorityIcons[ProjectTrackingPriority['Mid priority']],
  },
  {
    id: ProjectTrackingPriority['Low priority'],
    name: ProjectTrackingPriority[ProjectTrackingPriority['Low priority']],
    icon: PriorityIcons[ProjectTrackingPriority['Mid priority']],
  },
];

export const ProjectPriorityFilters: DropDownFilterValueProps[] = [
  GlobalFilter,
  ...ProjectPriority,
];

export enum ProjectRequestStatus {
  'Pending',
  'Responded',
}

export const RequestsIcons = {
  [ProjectRequestStatus.Pending]: <PendingIcon />,
  [ProjectRequestStatus.Responded]: <RespondedIcon />,
};

export enum ProjectTrackingNotificationType {
  'Deleted',
  'Considered',
  'Re-Considered',
  'Unlisted',
  'Specified',
  'Re-Specified',
  'Cancelled',
}

export enum ProjectTrackingNotificationStatus {
  'Keep-in-view',
  'Followed-up',
}

export const NotificationsIcons = {
  [ProjectTrackingNotificationStatus['Keep-in-view']]: <KeepInViewIcon />,
  [ProjectTrackingNotificationStatus['Followed-up']]: <FollowedIcon />,
};
