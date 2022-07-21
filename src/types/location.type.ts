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
  name: string;
  phone_code: string;
}

export interface LocationGroupedByCountry {
  name: string;
  count: number;
  countries: ILocationDetail[];
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
