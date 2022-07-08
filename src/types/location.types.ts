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
  functional_types: [
    {
      id: string;
      name: string;
    },
  ];
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

export interface ICountryGroup {
  country_name: string;
  count: 0;
  locations: ILocationDetail[];
}
