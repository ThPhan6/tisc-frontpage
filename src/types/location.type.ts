export interface ICountry {
  id: string;
  name: string;
  phone_code: string;
}

export interface IState {
  id: string;
  name: string;
}

export interface ICity {
  id: string;
  name: string;
}

export interface ILocationDetail {
  id: string;
  business_name: string;
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
  locations: ILocationDetail[];
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

export interface FunctionalTypeData {
  id: string;
  name: string;
}

export interface Regions {
  name: string;
  count: number;
  countries: ICountry[];
}
