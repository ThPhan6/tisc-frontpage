export interface Company {
  name: string;
  country_name: string;
  city_name: string;
  contact: string;
  affiliation_name: string;
  affiliation_id: string;
  relation_name: string;
  relation_id: string;
  acquisition_name: string;
  acquisition_id: string;
  price_rate: number | null;
  authorized_country_name: string;
  coverage_beyond: boolean;
}

export interface CompanyForm extends Omit<Company, 'contact'> {
  website: string;
  province: string;
  address: string;
  postal_code: string;
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
