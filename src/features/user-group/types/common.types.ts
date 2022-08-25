import { BrandDetail } from './brand.types';

export type ActiveKeyType = string | number | (string | number)[];

export enum BrandTabKeys {
  profile = 'PROFILE',
  locations = 'LOCATIONS',
  teams = 'TEAMS',
  distributors = 'DISTRIBUTORS',
  availability = 'AVAILABILITY',
}
export enum DesignTabKeys {
  profile = 'PROFILE',
  locations = 'LOCATIONS',
  teams = 'TEAMS',
  materialCode = 'MATERIAL CODE',
  projects = 'PROJECTS',
  custom = 'CUSTOM',
}
export type TabKeys = BrandTabKeys | DesignTabKeys;

export interface UserGroupProps {
  type?: 'brand' | 'design';
  data?: ProfileBrandDesign;
  id?: string;
}

export interface ProfileBrandDesign extends BrandDetail {
  profile_n_philosophy: string;
  official_website: string;
  design_capabilities: string;
  material_code_ids: [];
  project_ids: [];
}
export const DEFAULT_BRAND_DESIGN_PROFILE: ProfileBrandDesign = {
  id: '',
  parent_company: null,
  logo: '',
  slogan: '',
  mission_n_vision: '',
  official_websites: [],
  team_profile_ids: [],
  location_ids: [],
  status: 2 /* inactive */,
  name: '',
  profile_n_philosophy: '',
  official_website: '',
  design_capabilities: '',
  material_code_ids: [],
  project_ids: [],
};
