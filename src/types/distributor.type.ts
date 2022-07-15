export interface IDistributorForm {
  brand_id: string;
  name: string;
  country_name: string;
  country_id: string;
  state_name: string;
  state_id: string;
  city_name: string;
  city_id: string;
  address: string;
  phone_code: string;
  postal_code: string;
  first_name: string;
  last_name: string;
  gender: true;
  email: string;
  phone: string;
  mobile: string;
  authorized_country_ids: string[];
  authorized_country_name: string;
  authorized_countries: string[];
  coverage_beyond: true;
}

export interface IDistributorEntryForm {
  submitButtonStatus: any;
  onSubmit: (data: IDistributorForm) => void;
  onCancel: () => void;
  data: IDistributorForm;
  setData: (data: IDistributorForm) => void;
}

export interface IDistributorListResponse {
  id: string;
  name: string;
  count: number;
  created_at: string;
  country_name: string;
  city_name: string;
  first_name: string;
  last_name: string;
  email: string;
  authorized_country_name: string;
  coverage_beyond: true;
}
