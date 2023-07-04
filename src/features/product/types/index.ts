import { TablePaginationConfig } from 'antd/es/table/interface';

import { ProductDimensionWeight } from '@/features/dimension-weight/types';
import {
  OrderMethod,
  ProductConsiderStatus,
  ProductSpecifyStatus,
  ProjectProductStatus,
  SpecificationBodyRequest,
} from '@/features/project/types';
import { BrandDetail } from '@/features/user-group/types';
import { FinishScheduleResponse } from '@/pages/Designer/Project/tabs/ProductConsidered/SpecifyingModal/types';
import { ConversionSubValueProps, GeneralData } from '@/types';

import { ProductTopBarFilter } from '../components/FilterAndSorter';

export interface ProductSummary {
  categories: GeneralData[];
  collections: GeneralData[];
  company: GeneralData[];
  category_count: number;
  collection_count: number;
  company_count: number;
  card_count: number;
  product_count: number;
  brandId: string;
}

export type ProductAttributeType = 'Text' | 'Conversions' | 'Presets' | 'Options';

export interface SpecificationAttributeBasisOptionProps {
  id: string;
  option_code: string;
  product_id?: string;
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

export interface AttributeSelectedProps {
  groupId: string;
  attribute: {
    id: string;
    name: string;
  };
}

export interface ProductAttributeFormInput {
  id: string;
  name: string;
  attributes: ProductAttributeProps[];
  isChecked?: boolean;
  selection: boolean;
  attribute_selected_id?: string;
}

export enum Availability {
  Available,
  Discontinued,
  Discrepancy,
  OutOfStock,
}

export type ProductKeyword = [string, string, string, string];

export interface SpecifiedDetail {
  // basic information
  id: string;
  project_id: string;
  product_id: string;
  status?: ProjectProductStatus; // consider || specified
  consider_status?: ProductConsiderStatus; // considered - default || re-considered || unlist
  specified_status?: ProductSpecifyStatus; // specified - default || re-specify || cancel
  // vendor
  brand_location_id: string;
  distributor_location_id: string;
  /// order
  material_code_id: string;
  material_code: string;
  suffix_code: string;
  description: string;
  quantity: number;
  order_method: OrderMethod;
  requirement_type_ids: string[];
  instruction_type_ids: string[];
  finish_schedules: FinishScheduleResponse[];
  unit_type_id: string;
  unit_type?: string;
  special_instructions: string;
  /// specification
  specification: SpecificationBodyRequest;
  /// allocation
  allocation: string[]; // room_id
  entire_allocation: boolean;

  custom_product?: boolean;
}

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
  availability?: Availability;
  general_attribute_groups: ProductAttributeFormInput[];
  feature_attribute_groups: ProductAttributeFormInput[];
  specification_attribute_groups: ProductAttributeFormInput[];
  dimension_and_weight: ProductDimensionWeight;
  favorites?: number;
  images: string[];
  keywords: ProductKeyword;
  created_at?: string;
  created_by?: string;
  // specifying
  specifiedDetail?: SpecifiedDetail;
  brand_location_id: string;
  distributor_location_id: string;
  tips: ProductTipData[];
  downloads: ProductDownloadData[];
  catelogue_downloads: ProductCatelogueData[];
  custom_product?: boolean;
}

export interface RoomItem {
  id: string;
  room_id: string;
  room_name: string;
  room_size: number;
  quantity: number;
  sub_total: number;
  products: ProductItem[];
}

export type ProjectProductItem = ProductItem & { rooms?: RoomItem[] };

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
  dimension_and_weight: ProductDimensionWeight;
  images: string[];
  keywords: ProductKeyword;
  tips: ProductTipData[];
  downloads: ProductDownloadData[];
  catelogue_downloads: ProductCatelogueData[];
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
  company_id?: string;
}

export interface GroupProductList {
  count: number;
  id: string;
  name: string;
  products: ProductItem[];
  description?: string;
  brand_logo?: string;
}

export interface BrandSummary {
  card_count: number;
  collection_count: number;
  product_count: number;
  brand_logo: string;
  brand_name: string;
}

export type SortOrder = 'ASC' | 'DESC';
export type SortParams = {
  sort: string;
  order: SortOrder;
};

export interface ProductList {
  filter?: ProductTopBarFilter;
  data?: GroupProductList[];
  search?: string;
  sort?: SortParams;
  brandSummary?: BrandSummary;
  allProducts?: ProductItem[];
  pagination: TablePaginationConfig;
}

export interface GetListProductForDesignerRequestParams {
  brand_id?: string;
  category_id?: string;
  name?: string;
  sort?: string;
  order?: SortOrder;
  page?: number;
  pageSize?: number;
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
