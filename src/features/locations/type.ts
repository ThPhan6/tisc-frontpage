export interface Country {
  id: string;
  name: string;
  phone_code: string;
}

export interface State {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
}

export interface LocationDetail {
  id: string;
  business_name: string;
  business_number: string;
  functional_types: {
    id: string;
    name: string;
  }[];
  functional_type: string;
  country_id: string;
  state_id: string;
  city_id: string;
  country_name: string;
  state_name: string;
  city_name: string;
  general_phone: string;
  general_email: string;
  created_at: string;
  phone_code: string;
  postal_code: string;
  address: string;
}

export interface LocationGroupedByCountry {
  country_name: string;
  count: number;
  locations: LocationDetail[];
}

export interface LocationForm {
  business_name: string;
  business_number: string;
  functional_type_ids: string[];
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  general_phone: string;
  general_email: string;
}

export interface Regions {
  name: string;
  count: number;
  countries: Country[];
}
