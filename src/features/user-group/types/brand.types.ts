import { MemberAssignedForm } from '@/components/AssignTeam/type';

export interface TISCUserGroupBrandForm {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface BrandMemberAssigned extends MemberAssignedForm {
  is_assigned: boolean;
}

export interface BrandAssignTeamForm {
  name: string;
  users: BrandMemberAssigned[];
}

export interface BrandListItem {
  id: string;
  assign_team: BrandMemberAssigned[];
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
  id: string;
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
  // image?: string;
  // collection_name?: string;
  // description?: string;
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
