import { IGeneralData } from '@/types';

export interface IProductSummary {
  categories: IGeneralData[];
  collections: IGeneralData[];
  category_count: number;
  collection_count: number;
  card_count: number;
  product_count: number;
}
export type IGeneralFeatureFormInputType = 'Text' | 'Conversions' | 'Presets';
export type ISpecificationFormInputType = 'Text' | 'Conversions' | 'Options';
export interface IGeneralFeatureFormInput {
  id?: string;
  name: string;
  attributes: {
    id: string;
    basis_id: string;
    basis_value_id: string;
    type: IGeneralFeatureFormInputType;
    text: string;
    conversion_value_1: string;
    conversion_value_2: string;
  }[];
}

export interface ISpecificationFormInput {
  id?: string;
  name: string;
  attributes: {
    id: string;
    basis_id: string;
    type: ISpecificationFormInputType;
    text: string;
    conversion_value_1: string;
    conversion_value_2: string;
    basis_options: {
      id: string;
      option_code: string;
    }[];
  }[];
}
export type IProductKeyword = [string, string, string, string];

export interface IProductDetail {
  id?: string;
  brand?: {
    id: string;
    name: string;
  };
  collection?: {
    id: string;
    name: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  name: string;
  code?: string;
  description: string;
  general_attribute_groups: IGeneralFeatureFormInput[];
  feature_attribute_groups: IGeneralFeatureFormInput[];
  specification_attribute_groups: ISpecificationFormInput[];
  favorites?: number;
  images: string[];
  keywords: IProductKeyword;
  created_at?: string;
  created_by?: string;
}

export interface IProductFormData {
  brand_id: string;
  collection_id: string;
  category_ids: string[];
  name: string;
  description: string;
  general_attribute_groups: IGeneralFeatureFormInput[];
  feature_attribute_groups: IGeneralFeatureFormInput[];
  specification_attribute_groups: ISpecificationFormInput[];
  images: string[];
  keywords: IProductKeyword;
}
export interface IRelatedCollection {
  id: string;
  collection_id: string;
  name: string;
  images: string[];
  created_at: string;
}

export interface IProductGetListParameter {
  brand_id: string;
  category_id?: string;
  collection_id?: string;
}

export interface GroupProductList {
  count: number;
  id: string;
  name: string;
  products: IProductDetail[];
}
