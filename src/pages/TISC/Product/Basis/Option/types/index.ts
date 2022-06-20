export interface ISubBasisOption {
  id: string;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
}
export interface IBasisOptionListResponse {
  id: string;
  name: string;
  count: number;
  subs: {
    id: string;
    name: string;
    count: number;
    subs: ISubBasisOption[];
  }[];
  created_at: string;
}

export interface ElementInputItemProps {
  id?: string;
  image: string;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
}

export interface ElementInputProp {
  order: number;
  valueElementInput: ElementInputItemProps;
  onChangeElementInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type SubOptionValueProps = {
  id?: string;
  name: string;
  subs: ElementInputItemProps[];
};

export interface SubOptionProps {
  value: SubOptionValueProps;
  onChangeValue: (value: SubOptionValueProps) => void;

  handleOnClickDeleteSubOption: () => void;

  handleOnChangeOptionNameInput: (e: React.ChangeEvent<HTMLInputElement>) => void;

  subOptions: SubOptionValueProps;
  // setSubOptions: () => void;
  handleChange: (sub: ElementInputItemProps) => void;
}

export interface OptionGroupProps {
  id?: string;
  name: string;
  subs: SubOptionValueProps[];
}

export interface OptionEntryFormProps {
  onCancel?: () => void;
  onSubmit?: (data: OptionGroupProps) => void;
  optionValue: OptionGroupProps;
  setOptionValue: (value: OptionGroupProps) => void;
}
