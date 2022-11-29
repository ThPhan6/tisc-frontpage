import { ProductDimensionWeight } from '@/features/dimension-weight/types';
import { SpecifiedDetail } from '@/features/product/types';
import { SpecificationBodyRequest } from '@/features/project/types';
import { GeneralData } from '@/types';

export interface CustomProductList {
  id: string;
  name: string;
  description: string;
  company_id: string;
  company_name: string;
  collection_id: string;
  collection_name: string;
  location: string;
  image: string;
}

export type ProductFilterType = 'company_id' | 'collection_id';

export interface CustomProductFilter {
  company_id?: string;
  collection_id?: string;
}

export type ProductInfoTab = 'summary' | 'specification';

export interface NameContentProps {
  id: string;
  name: string;
  content: string;
}

export interface ProductOptionContentProps {
  id?: string;
  description: string;
  product_id: string;
  image?: string;
}
export interface ProductOptionProps {
  id?: string;
  use_image: boolean;
  tag: string;
  title: string;
  items: ProductOptionContentProps[];
}

export interface CustomProductDetailProps {
  id: string;
  name: string;
  description: string;
  images: string[];
  dimension_and_weight: ProductDimensionWeight;
  attributes: NameContentProps[];
  specifications: NameContentProps[];
  options: ProductOptionProps[];
  collection: GeneralData;
  company: GeneralData;
  specification: SpecificationBodyRequest;
  specifiedDetail?: SpecifiedDetail;
}

export interface CustomProductDetailResponse
  extends Omit<CustomProductDetailProps, 'collection' | 'company'> {
  collection_id: string;
  collection_name: string;
  company_id: string;
  company_name: string;
}

export interface CustomProductRequestBody {
  name: string;
  description: string;
  images: string[];
  dimension_and_weight: ProductDimensionWeight;
  attributes: NameContentProps[];
  specifications: NameContentProps[];
  options: ProductOptionProps[];
  collection_id: string;
  company_id: string;
}
