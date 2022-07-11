export interface IDistributorForm {
  brand_id: string;
  name: string;
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  first_name: string;
  last_name: string;
  gender: true;
  email: string;
  phone: string;
  mobile: string;
  authorized_country_ids: string[];
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

export interface ICountryDetail {
  id: string;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: string;
  latitude: 0;
  longitude: 0;
  emoji: string;
  emojiU: string;
}
