import { ProductAttributeType } from '@/features/product/types';
import { BasisPresetTypeString, SubBasisConversion, SubBasisPreset } from '@/types';

export enum EAttributeContentType {
  texts = 'texts',
  conversions = 'conversions',
  presets = 'presets',
  feature_presets = 'feature_presets',
  options = 'options',
}

export interface SubAttribute {
  id: string;
  name: string;
  basis_id: string;
  description: string;
  description_1: string;
  description_2: string;
  content_type: EAttributeContentType;
  sub_group_id: string;
}

export interface AttributeListResponse {
  id: string;
  name: string;
  count: number;
  master: boolean;
  subs: SubAttribute[];
  created_at: string;
}

export interface BasisText {
  id: string;
  name: string;
}

export interface BasisConventionOption {
  id: string;
  name_1: string;
  name_2: string;
}

export interface BasisConvention extends BasisText {
  count: number;
  subs: BasisConventionOption[];
}

export interface BasisPresetOption extends BasisText {
  count?: number;
  subs?: BasisPresetOption[];
}

export interface AttributeContentType {
  texts: BasisText[];
  conversions: BasisConvention[];
  presets: BasisPresetOption[];
  feature_presets: BasisPresetOption[];
  options: BasisPresetOption[];
}

export interface AttributeSubForm {
  id?: string;
  name: string;
  basis_id: string;
  description?: string;
  description_1?: string;
  description_2?: string;
  content_type?: string;
  activeKey?: string;
  additional_type?: BasisPresetTypeString;
  sub_group_id?: string;
}
export interface AttributeForm {
  id?: string;
  type?: number;
  name: string;
  count: number;
  subs: {
    id?: string;
    name: string;
    count: number;
    subs: AttributeSubForm[];
  }[];
}

export interface ICreateAttributeRequest {
  brand_id: string;
  name: string;
  type: number;
  subs: {
    name: string;
    subs: {
      name: string;
      basis_id: string;
      description: string;
    }[];
  }[];
}

export interface IUpdateAttributeRequest {
  name: string;
  subs: {
    id?: string;
    name: string;
    subs: {
      id?: string;
      name: string;
      basis_id: string;
      description: string;
    }[];
  }[];
}

export interface ProductSubAttributes extends SubAttribute {
  basis: {
    id: string;
    type: ProductAttributeType;
    name: string;
    name_1: string;
    name_2: string;
    subs: SubBasisConversion[] & SubBasisPreset[] & BasisText[];
  };
}

export interface ProductMainSubAttributes {
  id: string;
  name: string;
  type?: number;
  subs: ProductSubAttributes[];
}

export interface ProductAttributes {
  id: string;
  name: string;
  type: number;
  subs: ProductSubAttributes[];
}

export interface AttributesWithSubAddtionData {
  id: string;
  name: string;
  type: number;
  subs: ProductMainSubAttributes[];
}

export interface ProductAttributeWithSubAdditionByType {
  general: AttributesWithSubAddtionData[];
  feature: AttributesWithSubAddtionData[];
  specification: AttributesWithSubAddtionData[];
}

export interface ProductAttributeByType {
  general: ProductAttributes[];
  feature: ProductAttributes[];
  specification: ProductAttributes[];
}

export enum EGetAllAttributeType {
  ADD_SUB,
  NONE_SUB,
}
