import { ReactComponent as ProjectLiveIcon } from '@/assets/icons/project-live-icon.svg';
import { ReactComponent as ProjectOnHoldIcon } from '@/assets/icons/project-on-hold-icon.svg';
import { ReactComponent as ProjectArchivedIcon } from '@/assets/icons/project-archived-icon.svg';
import { ProjectFilterValueProps } from '@/types';

export const FilterValues = {
  global: -1,
  live: 2,
  onHold: 3,
  archived: 1,
};

export const FilterNames = {
  [FilterValues.global]: 'VIEW ALL',
  [FilterValues.live]: 'Live',
  [FilterValues.onHold]: 'On hold',
  [FilterValues.archived]: 'Archived',
};

export const FilterStatusIcons = {
  [FilterValues.live]: <ProjectLiveIcon />,
  [FilterValues.onHold]: <ProjectOnHoldIcon />,
  [FilterValues.archived]: <ProjectArchivedIcon />,
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
