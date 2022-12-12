import { ConversionSubValueProps } from '@/types';

export interface DesignFirm {
  id: string;
  name: string;
  logo: string;
  origin: string;
  main_office: string;
  satellites: number;
  designers: number;
  capacities: number;
  projects: number;
  live: number;
  on_hold: number;
  archived: number;
  status: number;
  assign_team: string;
  created_at: string;
  updated_at: string;
}

export interface DesignFirmDetail {
  id: string;
  name: string;
  parent_company: string;
  logo: string;
  slogan: string;
  profile_n_philosophy: string;
  official_website: string;
  design_capabilities: string;
  team_profile_ids: [];
  location_ids: [];
  material_code_ids: [];
  project_ids: [];
  status: number;
}

export interface ContactDetail {
  first_name: string;
  last_name: string;
  position: string;
  work_email: string;
  work_phone: string;
  work_mobile: string;
}

export interface BusinessDetail {
  website_uri: string;
  design_id: string;
  associate_resource_ids: string[];
  contacts: ContactDetail[];
  type: number;
  created_at: string;
  updated_at: string;
  location_id: string;
  id: string;
  country_id: string;
  country_name: string;
  city_id: string;
  city_name: string;
  state_id: string;
  state_name: string;
  phone_code: string;
  address: string;
  business_name: string;
  business_number: string;
  postal_code: string;
  general_phone: string;
  general_email: string;
}

export interface OptionValue {
  id: string;
  title: string;
  use_image: boolean;
  tag: string;
  items: {
    id: string;
    image: string;
    description: string;
    product_id: string;
  }[];
}

export interface DimensionAndWeight {
  id: string;
  name: string;
  with_diameter: boolean;
  attributes: {
    basis_id: string;
    basis_value_id: string;
    conversion_value_1: string;
    conversion_value_2: string;
    id: string;
    name: string;
    text: string;
    type: string;
    with_diameter: boolean;
    conversion: ConversionSubValueProps;
  }[];
}
export interface LibraryDesignFirm {
  brands: BusinessDetail[];
  distributors: BusinessDetail[];
  collections: {
    id: string;
    name: string;
    products: {
      id: string;
      name: string;
      image: string;
    }[];
  }[];
  products: {
    id: string;
    name: string;
    description: string;
    image: string;
    attributes: {
      name: string;
      content: string;
    }[];
    specifications: {
      name: string;
      content: string;
    }[];
    options: OptionValue[];
    dimension_and_weight: DimensionAndWeight;
    collection_id: string;
    company_id: string;
    created_at: string;
    updated_at: string;
    design_id: string;
    company_name: string;
    collection_name: string;
  }[];
}
