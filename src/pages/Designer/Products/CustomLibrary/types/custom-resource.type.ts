/// Vendor
export interface CustomLibraryContact {
  id: string;
  firstname: string;
  lastname: string;
  position: string;
  work_email: string;
  phone_code: string;
  phone_number: string;
  mobile_code: string;
  mobile_number: string;
}
export interface ContactAddressProps {
  id: string;
  company_id: string;
  country_id: string;
  state_id: string;
  city_id: string;
  website: string;
  address: string;
  postal_code: string;
  contacts: CustomLibraryContact[];
}
export interface ContactAddressRequestBody {
  brand: ContactAddressProps;
  distributor: ContactAddressProps;
}

export interface CustomResources {
  id: string;
  business_name: string;
  general_email: string;
  general_phone: string;
  phone_code: string;
  location: string;
  contacts: number;
  distributors: number;
  cards: number;
  brands: number;
}

export interface ContactDetail {
  first_name: string;
  last_name: string;
  position: string;
  work_email: string;
  work_phone: string;
  work_mobile: string;
}

export interface CustomResourceForm {
  business_name: string;
  website_uri: string;
  associate_resource_ids: string[];
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  general_phone: string;
  general_email: string;
  contacts: ContactDetail[];
  type: number;
}
