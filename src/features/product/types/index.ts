import { BrandDetail, GeneralData } from '@/types';

export interface ProductSummary {
  categories: GeneralData[];
  collections: GeneralData[];
  category_count: number;
  collection_count: number;
  card_count: number;
  product_count: number;
  brandId: string;
}
export type GeneralFeatureFormInputType = 'Text' | 'Conversions' | 'Presets';
export type SpecificationFormInputType = 'Text' | 'Conversions' | 'Options';
export interface GeneralFeatureFormInput {
  id?: string;
  name: string;
  attributes: {
    id: string;
    basis_id: string;
    basis_value_id: string;
    type: GeneralFeatureFormInputType;
    text: string;
    conversion_value_1: string;
    conversion_value_2: string;
  }[];
}

export interface SpecificationFormInput {
  id?: string;
  name: string;
  attributes: {
    id: string;
    basis_id: string;
    type: SpecificationFormInputType;
    text: string;
    conversion_value_1: string;
    conversion_value_2: string;
    basis_options: {
      id: string;
      option_code: string;
    }[];
  }[];
}
export type ProductKeyword = [string, string, string, string];

export interface ProductItem {
  id?: string;
  brand?: BrandDetail;
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
  is_liked?: boolean;
  description: string;
  general_attribute_groups: GeneralFeatureFormInput[];
  feature_attribute_groups: GeneralFeatureFormInput[];
  specification_attribute_groups: SpecificationFormInput[];
  favorites?: number;
  images: string[];
  keywords: ProductKeyword;
  created_at?: string;
  created_by?: string;
}

export interface ProductFormData {
  brand_id: string;
  collection_id: string;
  category_ids: string[];
  name: string;
  description: string;
  general_attribute_groups: GeneralFeatureFormInput[];
  feature_attribute_groups: GeneralFeatureFormInput[];
  specification_attribute_groups: SpecificationFormInput[];
  images: string[];
  keywords: ProductKeyword;
}
export interface RelatedCollection {
  id: string;
  collection_id: string;
  name: string;
  images: string[];
  created_at: string;
}

export interface ProductGetListParameter {
  brand_id: string;
  category_id?: string;
  collection_id?: string;
}

export interface GroupProductList {
  count: number;
  id: string;
  name: string;
  products: ProductItem[];
}

export type ProductFilterType = 'category_id' | 'collection_id' | 'brand_id' | 'name';

export interface ProductTopBarFilter {
  name: ProductFilterType;
  title: string;
  value: string;
}

export type SortOrder = 'ASC' | 'DESC';
export type SortParams = {
  sort: string;
  order: SortOrder;
};

export interface ProductList {
  filter?: ProductTopBarFilter;
  data: GroupProductList[];
  search?: string;
  sort?: SortParams;
}

export interface GetListProductForDesignerRequestParams {
  brand_id?: string;
  category_id?: string;
  name?: string;
  sort?: string;
  order?: SortOrder;
}

export interface ProductCatelogueData {
  id?: string;
  title: string;
  url: string;
}
export interface ProductCatelogue {
  id?: string;
  product_id?: string;
  contents: ProductCatelogueData[];
  created_at?: string;
}

export interface ProductDownloadData {
  id?: string;
  title: string;
  url: string;
}
export interface ProductDownload {
  id?: string;
  product_id?: string;
  contents: ProductDownloadData[];
  created_at?: string;
}

export interface ProductTipData {
  id?: string;
  title: string;
  content: string;
}
export interface ProductTip {
  id?: string;
  product_id?: string;
  contents: ProductTipData[];
  created_at?: string;
}
