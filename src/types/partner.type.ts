import { UserDetail } from './user.type';

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

export interface Contact extends UserDetail {
  fullname: string;
  company_name: string;
  country_name: string;
}

export interface ContactRequest
  extends Pick<
    UserDetail,
    | 'firstname'
    | 'lastname'
    | 'gender'
    | 'linkedin'
    | 'mobile'
    | 'phone'
    | 'relation_id'
    | 'position'
    | 'email'
    | 'remark'
    | 'status'
    | 'phone_code'
  > {
  company_name?: string;
  country_name?: string;
}
