import { ProductDimensionWeight } from '@/features/dimension-weight/types';
import { GeneralData } from '@/types';

export interface CustomProductList {
  id: string;
  name: string;
  description: string;
  company_id: string;
  collection_id: string;
  location: string;
  image: string;
  company_name: string;
  collection_name: string;
}

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
  dimension_n_weight: ProductDimensionWeight[];
  specifications: NameContentProps[];
  options: ProductOptionProps[];
}
