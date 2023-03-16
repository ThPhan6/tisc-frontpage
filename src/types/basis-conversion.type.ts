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
  product_id?: string;
}
export interface BasisConversionListResponse {
  id: string;
  name: string;
  master: boolean;
  count: number;
  subs: SubBasisConversion[];
  created_at: string;
}

export interface ConversionSubValueProps {
  id?: string;
  name_1: string;
  name_2: string;
  formula_1: number;
  formula_2: number;
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

export interface ConversionBodyProp extends ConversionValueProp {}
