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

export interface IBrandDetail {
  created_at: string;
  id: string;
  is_deleted: boolean;
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
