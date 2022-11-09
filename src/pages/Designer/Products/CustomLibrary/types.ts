import { DimensionWeightConversion } from '@/features/dimension-weight/types';
import { GeneralData } from '@/types';

export type ProductInfoTab = 'summary' | 'specification' | 'vendor';

export interface NameContentProps {
  id: string;
  name: string;
  content: string;
}

/// Summary
export interface SummaryRequestBody {
  company: GeneralData;
  collection: GeneralData;
  product: string;
  description: string;
  attributes: NameContentProps[];
}

/// Specification

export interface ProductOptionContentProps {
  id: string;
  description: string;
  product_id: string;
  image: string;
}
export interface ProductOptionProps {
  id: string;
  use_image: boolean;
  tag: string;
  contents: ProductOptionContentProps[];
}

export interface SpecificationRequestBody {
  dimension_n_weight: DimensionWeightConversion[];
  specifications: NameContentProps[];
  options: ProductOptionProps[];
}

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
