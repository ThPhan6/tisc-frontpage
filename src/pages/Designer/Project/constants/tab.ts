import type { TabItem } from '@/components/Tabs/types';

export enum ProjectTabKeys {
  basicInformation = 'Basic Information',
  zoneAreaRoom = 'Zone/Area/Room',
  productConsidered = 'Product Considered',
  productSpecified = 'Product Specified',
}

export enum ProductSpecifiedTabKeys {
  issuingInformation = 'information',
  coverAndPreamble = 'cover',
  standardSpecification = 'standard',
}

export const ProductSpecifiedTabs: TabItem[] = [
  { tab: 'issuing information', key: ProductSpecifiedTabKeys.issuingInformation },
  { tab: 'cover & preamble', key: ProductSpecifiedTabKeys.coverAndPreamble },
  { tab: 'standard specification', key: ProductSpecifiedTabKeys.standardSpecification },
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
  {
    tab: 'specification',
    mobileTabTitle: 'Spec',
    key: ProjectSpecifyTabKeys.specification,
  },
  { tab: 'vendor', key: ProjectSpecifyTabKeys.vendor },
  { tab: 'allocation', key: ProjectSpecifyTabKeys.allocation },
  { tab: 'code & order', mobileTabTitle: 'Code', key: ProjectSpecifyTabKeys.codeAndOrder },
];
