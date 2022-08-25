export interface DistributorsProp {
  distributorName: string;
  country: string;
  province: string;
  city: string;
  address: string;
  zipCode: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  mobile: string;
  authorizedCountry: string;
  coverageBeyond: string;
}

export const distributorsValueProp = {
  distributorName: '',
  country: '',
  province: '',
  city: '',
  address: '',
  zipCode: '',
  firstName: '',
  lastName: '',
  gender: 'male',
  email: '',
  phone: '',
  mobile: '',
  authorizedCountry: '',
  coverageBeyond: 'not allow',
};

export interface DistributorForm {
  brand_id: string;
  name: string;
  country_id: string;
  state_id: string;
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
  authorized_countries: {
    id: string;
    name: string;
  }[];
  coverage_beyond: true;
}

export interface DistributorExtraForm extends DistributorForm {
  id: string;
  country_name: string;
  person: string;
  authorized_country_name: string;
}

export interface DistributorResponseForm {
  country_name: string;
  count: number;
  distributors: DistributorExtraForm[];
}
export interface DistributorProductMarket {
  country_name: string;
  count: number;
  distributors: {
    id: string;
    brand_id: string;
    name: string;
    country_name: string;
    country_id: string;
    state_id: string;
    state_name: string;
    city_name: string;
    city_id: string;
    address: string;
    phone_code: string;
    postal_code: string;
    first_name: string;
    last_name: string;
    gender: boolean;
    email: string;
    phone: string;
    mobile: string;
    authorized_country_ids: string[];
    authorized_country_name: string;
    coverage_beyond: boolean;
    created_at: string;
    is_deleted: string;
  }[];
}

export interface DistributorEntryForm {
  submitButtonStatus: any;
  onSubmit: (data: DistributorForm) => void;
  onCancel: () => void;
  data: DistributorForm;
  setData: (data: DistributorForm) => void;
}

export interface Distributor {
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

export const DEFAULT_DISTRIBUTOR: DistributorForm = {
  brand_id: '',
  name: '',
  country_id: '',
  state_id: '',
  city_id: '',
  address: '',
  phone_code: '',
  postal_code: '',
  first_name: '',
  last_name: '',
  gender: true,
  email: '',
  phone: '',
  mobile: '',
  authorized_country_ids: [],
  authorized_countries: [],
  coverage_beyond: true,
};
