export interface Company {
  id: string;
  name: string;
  country_name: string;
  city_name: string;
  state_name: string;
  contact: string;
  affiliation_name: string;
  affiliation_id: string;
  relation_name: string;
  relation_id: string;
  acquisition_name: string;
  acquisition_id: string;
  price_rate: number | string;
  authorized_country_name: string;
  coverage_beyond: boolean;
}

export interface CompanyForm extends Omit<Company, 'contact'> {
  website: string;
  province: string;
  address: string;
  postal_code: string;
  phone_code: string;
  phone: string;
  email: string;
  remark: string;
  country_id: string;
  state_id: string;
  city_id: string;
  authorized_countries: {
    id: string;
    name: string;
  }[];
  authorized_country_ids: string[];
}

export interface Contact {
  id: string;
  fullname: string;
  company_name: string;
  country_name: string;
  status: PartnerContactStatus;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  avatar: string;
}

export interface ContactForm extends Omit<Contact, 'fullname' | 'avatar'> {
  firstname: string;
  lastname: string;
  gender: boolean;
  linkedin: string;
  remark: string;
  partner_company_id: string;
  phone_code: string;
}

export enum PartnerContactStatus {
  Uninitiate,
  Pending,
  Activated,
}
