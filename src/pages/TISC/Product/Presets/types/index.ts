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
  value: PresetItemValueProp['subs'][0];
}

export type PresetItemValueProp = {
  name: string;
  subs: {
    value_1: string;
    value_2: string;
    unit_1: string;
    unit_2: string;
  }[];
};

export const presetsValueDefault: PresetsValueProp = {
  name: '',
  subs: [
    {
      name: '',
      subs: [],
    },
  ],
};

export const presetItemValueDefault: PresetItemValueProp = {
  name: '',
  subs: [],
};

export const subPresetDefaultValue: PresetItemValueProp['subs'][0] = {
  value_1: '',
  value_2: '',
  unit_1: '',
  unit_2: '',
};
