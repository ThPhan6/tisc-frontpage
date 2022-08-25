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

export interface DesignStatuses {
  key: string;
  value: string | number;
}
