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
  subs: {
    id: string;
    name: string;
    count: number;
    subs: SubBasisPreset[];
  }[];
  created_at: string;
}

export interface PresetsValueProp {
  name: string;
  subs: PresetItemValueProp[];
}

export interface PresetItemProps {
  value: PresetItemValueProp;
  onChangeValue: (value: PresetItemValueProp) => void;
  handleOnClickDelete: () => void;
}

export interface PresetElementInputProp {
  order: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: SubPresetValueProp;
}

export type PresetItemValueProp = {
  name: string;
  is_collapse: string;
  subs: SubPresetValueProp[];
};

export type SubPresetValueProp = {
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
};

export const presetsValueDefault = {
  name: '',
  is_collapse: '',
  subs: [],
};

export const subPresetDefaultValue = {
  value_1: '',
  value_2: '',
  unit_1: '',
  unit_2: '',
};

export interface PresetsEntryFormProps {
  onCancel?: () => void;
  onSubmit?: (data: PresetsValueProp) => void;
  presetValue?: PresetsValueProp;
  submitButtonStatus?: boolean;
}
