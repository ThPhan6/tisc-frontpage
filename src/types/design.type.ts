export interface DesignFirm {
  id: string;
  name: string;
  logo: string;
  origin: string;
  main_office: string;
  satellites: number;
  designers: number;
  capacities: number;
  projects: number;
  live: number;
  on_hold: number;
  archived: number;
  status: number;
  assign_team: string;
  created_at: string;
  updated_at: string;
}

export interface DesignFirmDetail {
  id: string;
  name: string;
  parent_company: string;
  logo: string;
  slogan: string;
  profile_n_philosophy: string;
  official_website: string;
  design_capabilities: string;
  team_profile_ids: [];
  location_ids: [];
  material_code_ids: [];
  project_ids: [];
  status: number;
}

export interface LocationsDesignFirm {
  country_name: string;
  count: 0;
  locations: LocationDetail[];
}

export interface LocationDetail {
  id: string;
  business_name: string;
  functional_types: {
    id: string;
    name: string;
  }[];
  functional_type: string;
  country_id: string;
  state_id: string;
  city_id: string;
  country_name: string;
  state_name: string;
  city_name: string;
  general_phone: string;
  general_email: string;
  created_at: string;
  phone_code: string;
  postal_code: string;
  address: string;
}

export interface TeamsDesignFirm {
  country_name: string;
  count: 0;
  users: UserInfo[];
}

export interface UserInfo {
  logo: string;
  firstname: string;
  lastname: string;
  gender: true;
  work_location: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  access_level: string;
  status: number;
  phone_code: string;
}

export interface ProjectsDesignFirm {
  status_name: string;
  count: 0;
  projects: ProjectDetail[];
}

export interface ProjectDetail {
  code: string;
  name: string;
  location: string;
  building_type: string;
  type: string;
  measurement_unit: number;
  design_due: string;
  construction_start: string;
}

export interface MaterialCodeDesignFirm {
  name: string;
  count: 0;
  subs: {
    name: string;
    count: 0;
    codes: {
      code: string;
      description: string;
    }[];
  }[];
}
