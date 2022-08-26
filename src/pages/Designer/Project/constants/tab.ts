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

export enum ProductSpecifiedTabKeys {
  issuingInformation = 'information',
  standardSpecSheet = 'standard',
  customSpecSheet = 'custom',
}

export const ProductSpecifiedTabs: TabItem[] = [
  { tab: 'issuing information', key: ProductSpecifiedTabKeys.issuingInformation },
  { tab: 'standard spec sheet', key: ProductSpecifiedTabKeys.standardSpecSheet },
  { tab: 'custom spec sheet', key: ProductSpecifiedTabKeys.customSpecSheet, disable: true },
];

// specifiy tab
export type ProjectSpecifyTabValue = 'specification' | 'vendor' | 'allocation' | 'codeAndOrder';

export enum ProjectSpecifyTabKeys {
  specification = 'specification',
  vendor = 'vendor',
  allocation = 'allocation',
  codeAndOrder = 'codeAndOrder',
}

export const ProjectSpecifyTabs: TabItem[] = [
  { tab: 'specification', key: ProjectSpecifyTabKeys.specification },
  { tab: 'vendor', key: ProjectSpecifyTabKeys.vendor },
  { tab: 'allocation', key: ProjectSpecifyTabKeys.allocation },
  { tab: 'code & order', key: ProjectSpecifyTabKeys.codeAndOrder },
];
