export interface ProjectFilterValueProps {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

export interface ProjectSummaryData {
  projects: number;
  live: number;
  on_hold: number;
  archived: number;
}

export interface ProjectBodyRequest {
  name: string;
  code: string;
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  project_type_id: string;
  building_type_id: string;
  measurement_unit: number;
  design_due: string;
  construction_start: string;
  status: number;
  country_name?: string;
}

export interface ProjectDetailProps extends ProjectBodyRequest {
  id: string;
}

export interface ProjectListProps {
  id: string;
  status: number;
  code: string;
  name: string;
  location: string;
  project_type: string;
  building_type: string;
  design_due: number;
  assign_teams: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

export interface GetConsideredProductsResponse {
  summary: [];
}
