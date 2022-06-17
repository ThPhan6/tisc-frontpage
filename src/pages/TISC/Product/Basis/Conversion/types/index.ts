export interface ISubBasisConversion {
  id: string;
  name_1: string;
  name_2: string;
  formula_1: number;
  formula_2: number;
  unit_1: string;
  unit_2: string;
  conversion_between: string;
  first_formula: string;
  second_formula: string;
}
export interface IBasisConversionListResponse {
  id: string;
  name: string;
  count: number;
  subs: ISubBasisConversion[];
  created_at: string;
}

export interface ElementInputProp {
  value: ConversionValueProp['subs'][0];
  order: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ConversionItemProps {
  value: ConversionValueProp['subs'][0];
  onChangeValue: (value: ConversionValueProp['subs'][0]) => void;
  handleOnClickDelete: () => void;
}

export type ConversionValueProp = {
  id?: string;
  name: string;
  subs: {
    id?: string;
    name_1: string;
    name_2: string;
    formula_1: string;
    formula_2: string;
    unit_1: string;
    unit_2: string;
  }[];
};

export const conversionValueDefault = {
  name_1: '',
  name_2: '',
  formula_1: '',
  formula_2: '',
  unit_1: '',
  unit_2: '',
};

export interface ConversionsEntryFormProps {
  onCancel?: () => void;
  onSubmit?: (data: ConversionValueProp) => void;
  conversionValue: ConversionValueProp;
  setConversionValue: (value: ConversionValueProp) => void;
}

export interface ConversionBodyProp extends ConversionValueProp {}
