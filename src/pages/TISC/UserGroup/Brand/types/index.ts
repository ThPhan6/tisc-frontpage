import type { TabItem } from '@/components/Tabs/types';

// export type BrandDetailTabValue =
//   | 'profile'
//   | 'locations'
//   | 'teams'
//   | 'distributors'
//   | 'availability';

export enum BrandTabKeys {
  profile = 'profile',
  locations = 'locations',
  teams = 'teams',
  distributors = 'distributors',
  availability = 'availability',
}

export const BrandTabs: TabItem[] = [
  { tab: 'RPOFILE', key: BrandTabKeys.profile },
  { tab: 'LOCATIONS', key: BrandTabKeys.locations },
  { tab: 'TEAMS', key: BrandTabKeys.teams },
  { tab: 'DISTRIBUTORS', key: BrandTabKeys.distributors },
  { tab: 'AVAILABILITY', key: BrandTabKeys.availability },
];
