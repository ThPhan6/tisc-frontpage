export interface SubBasisPreset {
  id: string;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
}
export interface BasisPresetListResponse {
  id: string;
  name: string;
  count: number;
  master: boolean;
  subs: {
    id: string;
    name: string;
    count: number;
    subs: BasisPresetSubForm[];
  }[];
  created_at: string;
}

export interface BasisPresetSubForm {
  id: string;
  name: string;
  subs: SubBasisPreset[];
  count: number;
  main_id: string;
}

export interface MainBasisPresetSubForm {
  id: string;
  name: string;
  subs: BasisPresetSubForm[];
  count: number;
}

export enum BasisPresetType {
  general,
  feature,
}

export enum BasisPresetTypeString {
  general = 'General Presets',
  feature = 'Feature Presets',
}

export interface PresetsValueProp {
  name: string;
  subs: PresetItemValueProp[];
  additional_type: BasisPresetType;
}

export interface PresetElementInputProp {
  order: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: SubBasisPreset;
}

export type PresetItemValueProp = {
  id: string;
  count: number;
  name: string;
  subs: SubBasisPreset[];
  sub_group_id?: string;
};

export const presetsValueDefault = {
  name: '',
  collapse: '',
  subs: [],
};

export const subPresetDefaultValue = {
  value_1: '',
  value_2: '',
  unit_1: '',
  unit_2: '',
};
