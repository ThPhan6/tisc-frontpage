import { WebsiteUrlItem } from '@/features/office-profile/types';

export interface BrandProfile {
  created_at: string;
  id: string;
  is_deleted: boolean;
  location_ids: string;
  logo: string;
  mission_n_vision: string;
  name: string;
  official_websites: WebsiteUrlItem[];
  parent_company: string;
  slogan: string;
  status: number;
  team_profile_ids: string[];
  updated_at: string;
  catelogue_downloads: { title: string; url: string }[];
}

export interface DesignFirmProfile {
  created_at: string;
  id: string;
  name: string;
  parent_company: string;
  logo: string;
  slogan: string;
  profile_n_philosophy: string;
  official_website: string;
  updated_at: string;
  capabilities: string[];
  team_profile_ids: [];
  status: number;
}

export interface UserDetail {
  access_level: string;
  avatar: string;
  backup_email: string;
  brand?: BrandProfile;
  design?: DesignFirmProfile;
  id: string;
  relation_id: string;
  role_id: string;
  permissions: any;
  firstname: string;
  lastname: string;
  gender: boolean;
  location: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  personal_mobile: string;
  linkedin: string;
  work_location: string;
  type: number;
  retrieve_favourite: boolean;
  phone_code: string;
  remark: string;
  status: number;
}
