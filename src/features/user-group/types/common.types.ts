import { BrandDetail } from './brand.types';

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
  materialCode = 'Marterial Code',
  projects = 'PROJECTS',
  library = 'Library',
}
export type TabKeys = BrandTabKeys | DesignTabKeys;

export interface RequiredValueProps {
  id: string;
}
export interface UserGroupProps {
  type: 'brand' | 'design';
  data?: BrandDesignProfile;
  id?: string;
}

export interface BrandDesignProfile extends BrandDetail {
  profile_n_philosophy: string;
  official_website: string;
  design_capabilities: string;
  material_code_ids: [];
  project_ids: [];
}
export const DEFAULT_BRAND_DESIGN_PROFILE: BrandDesignProfile = {
  id: '',
  parent_company: null,
  logo: '',
  slogan: '',
  mission_n_vision: '',
  official_websites: [],
  team_profile_ids: [],
  location_ids: [],
  status: 0 /* null */,
  name: '',
  profile_n_philosophy: '',
  official_website: '',
  design_capabilities: '',
  material_code_ids: [],
  project_ids: [],
};
