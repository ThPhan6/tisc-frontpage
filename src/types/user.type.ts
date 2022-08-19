export interface WebsiteUrlItem {
  country_id: string;
  url: string;
}

export interface BrandProfile {
  created_at: string;
  id: string;
  is_deleted: boolean;
  location_ids: any;
  logo: string;
  mission_n_vision: string;
  name: string;
  official_websites: WebsiteUrlItem[] | null;
  parent_company: string | null;
  slogan: string | null;
  status: number;
  team_profile_ids: any;
  updated_at: string | null;
}

export interface UserDetail {
  access_level: string;
  avatar: string;
  backup_email: string;
  brand?: BrandProfile;
  id: string;
  role_id: string;
  permissions: any;
  firstname: string;
  lastname: string;
  gender: string;
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
}
