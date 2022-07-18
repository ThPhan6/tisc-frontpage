import { ISubBasisConversion, ISubBasisOption, ISubBasisPreset } from '@/types';

export interface ISubAttribute {
  id: string;
  name: string;
  basis_id: string;
  description: string;
  description_1: string;
  description_2: string;
  content_type: string;
}
export interface IAttributeListResponse {
  id: string;
  name: string;
  count: number;
  subs: ISubAttribute[];
  created_at: string;
}

export interface IBasisText {
  id: string;
  name: string;
}

export interface IBasisConventionOption {
  id: string;
  name_1: string;
  name_2: string;
}
export interface IBasisConvention extends IBasisText {
  count: number;
  subs: IBasisConventionOption[];
}
export interface IBasisPresetOption extends IBasisText {
  count?: number;
  subs?: IBasisPresetOption[];
}

export interface IAttributeContentType {
  texts: IBasisText[];
  conversions: IBasisConvention[];
  presets: IBasisPresetOption[];
  options: IBasisPresetOption[];
}

export interface IAttributeSubForm {
  id?: string;
  name: string;
  basis_id: string;
  description?: string;
  description_1?: string;
  description_2?: string;
  content_type?: string;
  activeKey?: string;
}
export interface IAttributeForm {
  id?: string;
  type?: number;
  name: string;
  subs: IAttributeSubForm[];
}

export interface IAttributeGeneralFeatureSub extends ISubAttribute {
  basis: {
    id: string;
    type: string;
    name: string;
    subs: ISubBasisConversion[] & ISubBasisPreset[] & IBasisText[];
  };
}
export interface IAttributeGeneralFeature {
  id: string;
  name: string;
  type: number;
  subs: IAttributeGeneralFeatureSub[];
}

export interface IAttributeSpecificationSub extends ISubAttribute {
  basis: {
    id: string;
    type: string;
    name: string;
    subs: ISubBasisConversion[] & IBasisText[] & ISubBasisOption[];
  };
}
export interface IAttributeSpecification {
  id: string;
  name: string;
  type: number;
  subs: IAttributeSpecificationSub[];
}

export interface IAttributebyType {
  general: IAttributeGeneralFeature[];
  feature: IAttributeGeneralFeature[];
  specification: IAttributeSpecification[];
}
