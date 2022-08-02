export interface TISCUserGroupBrandForm {
  brandname: string;
  firstname: string;
  lastname: string;
  email: string;
  // status: string | number;
  role_id: string;
}

export interface BrandTeam {
  logo: string;
  firstname: string;
  lastname: string;
  gender: boolean;
  work_location: string | null;
  department: string;
  position: string | null;
  email: string;
  phone: string | null;
  mobile: string | null;
  access_level: string;
  status: number;
}

export interface TISCUserGroupBrandTeam {
  country_name: string;
  users: BrandTeam[];
}

export type entryFormInput = 'brandname' | 'firstname' | 'lastname' | 'email' | 'role_id';
