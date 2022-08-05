export interface TISCUserGroupBrandForm {
  brandname: string;
  firstname: string;
  lastname: string;
  email: string;
  // status: string | number;
  role_id: string;
}

export type entryFormInput = 'brandname' | 'firstname' | 'lastname' | 'email' | 'role_id';
