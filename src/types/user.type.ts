export interface IUserDetail {
  access_level: string;
  avatar: string;
  backup_email: string;
  brand?: {
    created_at: string;
    id: string;
    is_deleted: boolean;
    location_ids: any;
    logo: string;
    mission_n_vision: string;
    name: string;
    offical_websites: string | null;
    parent_company: string | null;
    slogan: string | null;
    status: number;
    team_profile_ids: any;
    updated_at: string | null;
  };
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
}

export const UserDetailValueDefault = {
  access_level: '',
  avatar: '',
  backup_email: '',
  brand: {
    created_at: '',
    id: '',
    is_deleted: true,
    location_ids: '',
    logo: '',
    mission_n_vision: '',
    name: '',
    offical_websites: '',
    parent_company: '',
    slogan: '',
    status: 1,
    team_profile_ids: '',
    updated_at: '',
  },
  id: '',
  role_id: '',
  permissions: '',
  firstname: '',
  lastname: '',
  gender: '',
  location: '',
  position: '',
  email: '',
  phone: '',
  mobile: '',
  personal_mobile: '',
  linkedin: '',
};
