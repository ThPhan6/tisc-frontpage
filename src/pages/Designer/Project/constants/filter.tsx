import { ReactComponent as HighPriorityIcon } from '@/assets/icons/high-priority-icon.svg';
import { ReactComponent as LowPriorityIcon } from '@/assets/icons/low-priority-icon.svg';
import { ReactComponent as MidPriorityIcon } from '@/assets/icons/mid-priority-icon.svg';
import { ReactComponent as ProjectArchivedIcon } from '@/assets/icons/project-archived-icon.svg';
import { ReactComponent as ProjectLiveIcon } from '@/assets/icons/project-live-icon.svg';
import { ReactComponent as ProjectOnHoldIcon } from '@/assets/icons/project-on-hold-icon.svg';

import { ProjectFilterValueProps } from '@/features/project/types';

export const FilterValues = {
  global: -1,
  live: 2,
  onHold: 3,
  archived: 1,
  highPriority: 4,
  midPriority: 5,
  lowPriority: 6,
};

export const FilterNames = {
  [FilterValues.global]: 'VIEW ALL',
  [FilterValues.live]: 'Live',
  [FilterValues.onHold]: 'On hold',
  [FilterValues.archived]: 'Archived',
  [FilterValues.highPriority]: 'High priority',
  [FilterValues.midPriority]: 'Mid priority',
  [FilterValues.lowPriority]: 'Low priority ',
};

export const FilterStatusIcons = {
  [FilterValues.live]: <ProjectLiveIcon className="icon-align" />,
  [FilterValues.onHold]: <ProjectOnHoldIcon className="icon-align" />,
  [FilterValues.archived]: <ProjectArchivedIcon className="icon-align" />,
  [FilterValues.highPriority]: <HighPriorityIcon className="icon-align" />,
  [FilterValues.midPriority]: <MidPriorityIcon className="icon-align" />,
  [FilterValues.lowPriority]: <LowPriorityIcon className="icon-align" />,
};

export const GlobalFilter: ProjectFilterValueProps = {
  id: FilterValues.global,
  name: FilterNames[FilterValues.global],
};

export const ProjectStatuses: ProjectFilterValueProps[] = [
  {
    id: FilterValues.live,
    name: FilterNames[FilterValues.live],
    icon: FilterStatusIcons[FilterValues.live],
  },
  {
    id: FilterValues.onHold,
    name: FilterNames[FilterValues.onHold],
    icon: FilterStatusIcons[FilterValues.onHold],
  },
  {
    id: FilterValues.archived,
    name: FilterNames[FilterValues.archived],
    icon: FilterStatusIcons[FilterValues.archived],
  },
];

export const ProjectFilters: ProjectFilterValueProps[] = [GlobalFilter, ...ProjectStatuses];

export const ProjectPriority: ProjectFilterValueProps[] = [
  {
    id: FilterValues.highPriority,
    name: FilterNames[FilterValues.highPriority],
    icon: FilterStatusIcons[FilterValues.highPriority],
  },
  {
    id: FilterValues.midPriority,
    name: FilterNames[FilterValues.midPriority],
    icon: FilterStatusIcons[FilterValues.midPriority],
  },
  {
    id: FilterValues.lowPriority,
    name: FilterNames[FilterValues.lowPriority],
    icon: FilterStatusIcons[FilterValues.lowPriority],
  },
];

export const ProjectTrackingFilters: ProjectFilterValueProps[] = [
  GlobalFilter,
  ...ProjectStatuses,
  ...ProjectPriority,
];
