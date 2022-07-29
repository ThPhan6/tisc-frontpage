import type { TabItem } from '@/components/Tabs/types';

export type ProjectTabValue = 'information' | 'zoneAreaRoom' | 'considered' | 'specified';

export enum ProjectTabKeys {
  basicInformation = 'information',
  zoneAreaRoom = 'zoneAreaRoom',
  productConsidered = 'considered',
  productSpecified = 'specified',
}

export const ProjectTabs: TabItem[] = [
  { tab: 'basic information', key: ProjectTabKeys.basicInformation },
  { tab: 'zones/areas/rooms', key: ProjectTabKeys.zoneAreaRoom },
  { tab: 'product considered', key: ProjectTabKeys.productConsidered },
  { tab: 'product specified', key: ProjectTabKeys.productSpecified },
];
