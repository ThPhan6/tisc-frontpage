export interface BrandListItem {
  id: string;
  assign_team: any[];
  cards: number;
  categories: number;
  collections: number;
  coverages: number;
  created_at: string;
  distributors: number;
  locations: number;
  logo: string;
  name: string;
  origin: string;
  products: number;
  status: number;
  teams: number;
}

export interface BrandDetail {
  created_at: string;
  id: string;
  is_deleted: boolean;
  location_ids: any;
  logo: string;
  mission_n_vision: string;
  name: string;
  official_websites: {
    country_id: string;
    country_name: string;
    url: string;
  }[];
  parent_company: string | null;
  slogan: string | null;
  status: number;
  team_profile_ids: any;
  updated_at: string | null;
}

export interface BrandAlphabet {
  [key: string]: BrandDetail[];
}
export interface BrandCard {
  id: string;
  name: string;
  logo: string;
  country: string;
  category_count: string;
  collection_count: string;
  card_count: string;
  teams: BrandCardTeam[];
}
export interface BrandCardTeam {
  id: string;
  firstname: string;
  lastname: string;
  avatar: any;
}

export interface BrandStatuses {
  key: string;
  value: string | number;
}

export interface MemberAssignTeam {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  is_assigned: boolean;
}

export interface AssignTeamForm {
  name: string;
  users: MemberAssignTeam[];
}
