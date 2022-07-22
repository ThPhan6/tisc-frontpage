export interface IBrandListItem {
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

export interface IBrandDetail {
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

export interface IBrandAlphabet {
  [key: string]: IBrandDetail[];
}
export interface IBrandCard {
  id: string;
  name: string;
  logo: string;
  country: string;
  category_count: string;
  collection_count: string;
  card_count: string;
  teams: IBrandCardTeam[];
}
export interface IBrandCardTeam {
  id: string;
  firstname: string;
  lastname: string;
  avatar: any;
}
