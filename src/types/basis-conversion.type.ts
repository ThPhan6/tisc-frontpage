export interface SubBasisConversion {
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
export interface BasisConversionListResponse {
  id: string;
  name: string;
  count: number;
  subs: SubBasisConversion[];
  created_at: string;
}

export interface ConversionSubValueProps {
  id?: string;
  name_1: string;
  name_2: string;
  formula_1: string;
  formula_2: string;
  unit_1: string;
  unit_2: string;
}

export interface ElementInputProp {
  value: ConversionSubValueProps;
  order: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ConversionItemProps {
  value: ConversionSubValueProps;
  onChangeValue: (value: ConversionSubValueProps) => void;
  handleOnClickDelete: () => void;
}

export type ConversionValueProp = {
  id?: string;
  name: string;
  subs: ConversionSubValueProps[];
};

export const conversionValueDefault: ConversionSubValueProps = {
  name_1: '',
  name_2: '',
  formula_1: '',
  formula_2: '',
  unit_1: '',
  unit_2: '',
};

export interface ConversionBodyProp extends ConversionValueProp {}
