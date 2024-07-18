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
  {
    tab: 'issuing information',
    tabletTabTitle: 'ISSUING',
    key: ProductSpecifiedTabKeys.issuingInformation,
  },
  {
    tab: 'cover & preamble',
    tabletTabTitle: 'COVER',
    key: ProductSpecifiedTabKeys.coverAndPreamble,
  },
  {
    tab: 'standard specification',
    tabletTabTitle: 'SPECIFICATION',
    key: ProductSpecifiedTabKeys.standardSpecification,
  },
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
    tab: '1.confirm specification',
    mobileTabTitle: 'Spec',
    key: ProjectSpecifyTabKeys.specification,
  },
  { tab: '2.select vendors', key: ProjectSpecifyTabKeys.vendor },
  { tab: '3.verify locations', key: ProjectSpecifyTabKeys.allocation },
  {
    tab: '4.assign code & instruction',
    mobileTabTitle: 'Code',
    key: ProjectSpecifyTabKeys.codeAndOrder,
  },
];
