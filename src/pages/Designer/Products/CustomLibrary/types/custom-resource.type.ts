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
