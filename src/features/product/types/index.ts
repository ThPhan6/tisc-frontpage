import { AssigningStatus, AssigningStatusName } from '@/features/project/types';
import { BrandDetail } from '@/features/user-group/types';
import { ConversionSubValueProps, GeneralData } from '@/types';

export interface ProductSummary {
  categories: GeneralData[];
  collections: GeneralData[];
  category_count: number;
  collection_count: number;
  card_count: number;
  product_count: number;
  brandId: string;
}

export type ProductAttributeType = 'Text' | 'Conversions' | 'Presets' | 'Options';

export interface SpecificationAttributeBasisOptionProps {
  id: string;
  option_code: string;
  image?: string | null;
  unit_1?: string;
  unit_2?: string;
  value_1?: string;
  value_2?: string;
  isChecked?: boolean;
}

export interface ProductAttributeProps {
  id: string;
  name: string;
  basis_id: string;
  basis_value_id: string;
  type: ProductAttributeType;
  text: string;
  conversion_value_1: string;
  conversion_value_2: string;
  conversion?: ConversionSubValueProps;
  basis_options?: SpecificationAttributeBasisOptionProps[];
}

export interface ProductAttributeFormInput {
  id?: string;
  name: string;
  attributes: ProductAttributeProps[];
  isChecked?: boolean;
}

export type ProductKeyword = [string, string, string, string];

export interface ProductItem {
  id: string;
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
  general_attribute_groups: ProductAttributeFormInput[];
  feature_attribute_groups: ProductAttributeFormInput[];
  specification_attribute_groups: ProductAttributeFormInput[];
  favorites?: number;
  images: string[];
  keywords: ProductKeyword;
  created_at?: string;
  created_by?: string;

  // consider data
  image?: string;
  brand_id?: string;
  brand_name?: string;
  brand_logo?: string;
  collection_name?: string;
  status?: AssigningStatus;
  status_name?: AssigningStatusName;
  is_entire?: boolean;
  project_zone_id?: string;
  considered_id?: string;
}

export interface ProductItemValue {
  id: string;
  name: string;
  logo?: string;
}

export interface ProductFormData {
  brand_id: string;
  collection_id: string;
  category_ids: string[];
  name: string;
  description: string;
  general_attribute_groups: ProductAttributeFormInput[];
  feature_attribute_groups: ProductAttributeFormInput[];
  specification_attribute_groups: ProductAttributeFormInput[];
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
  brand_logo?: string;
}

export interface BrandSummary {
  card_count: number;
  collection_count: number;
  product_count: number;
  brand_logo: string;
  brand_name: string;
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
  brandSummary?: BrandSummary;
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

/// inquiry-request
export interface GeneralInquiryForm {
  product_id: string;
  title: string;
  message: string;
  inquiry_for_ids: string[];
}
export interface ProjectRequestForm {
  project_id: string;
  product_id: string;
  title: string;
  message: string;
  request_for_ids: string[];
}
