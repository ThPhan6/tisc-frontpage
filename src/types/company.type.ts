export interface Company {
  name: string;
  country: string;
  city: string;
  contact: string;
  affiliation: string;
  relation: number | string;
  acquisition: number | string;
  price_rate: number | string;
  authorised_country: string;
  beyond: number | string;
}

export interface CompanyForm extends Omit<Company, 'contact'> {
  website: string;
  province: string;
  address: string;
  postal_code: string;
  phone: string;
  email: string;
  remark: string;
}
