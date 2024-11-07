import { LocationDetail } from '@/features/locations/type';
import { AssignedTeamMember } from '@/features/team-profiles/types';
import { ContactDetail } from '@/pages/Designer/CustomResource/type';

export interface TISCUserGroupBrandForm {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface BrandAssignTeamForm {
  name: string;
  users: AssignedTeamMember[];
}

export interface BrandListItem {
  id: string;
  assign_team: AssignedTeamMember[];
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

export interface BrandAttributeSummary {
  Brand: number;
  Origin: Number;
  Category: Number;
}

export interface BrandDetail {
  id: string;
  location_ids: any;
  brand_id?: string;
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
  location?: LocationDetail;
  contacts?: ContactDetail[];
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
