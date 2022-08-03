import { ProductAttributeType } from '@/features/product/types';
import { SubBasisConversion, SubBasisPreset } from '@/types';

export interface SubAttribute {
  id: string;
  name: string;
  basis_id: string;
  description: string;
  description_1: string;
  description_2: string;
  content_type: string;
}

export interface AttributeListResponse {
  id: string;
  name: string;
  count: number;
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
}
export interface AttributeForm {
  id?: string;
  type?: number;
  name: string;
  subs: AttributeSubForm[];
}

export interface ProductSubAttributes extends SubAttribute {
  basis: {
    id: string;
    type: ProductAttributeType;
    name: string;
    subs: SubBasisConversion[] & SubBasisPreset[] & BasisText[];
  };
}

export interface ProductAttributes {
  id: string;
  name: string;
  type: number;
  subs: ProductSubAttributes[];
}

export interface ProductAttributeByType {
  general: ProductAttributes[];
  feature: ProductAttributes[];
  specification: ProductAttributes[];
}
