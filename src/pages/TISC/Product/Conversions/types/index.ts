export interface ElementInputProp {
  order: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ConversionItemProps {
  value: ConversionValueProp;
  onChangeValue: (value: ConversionValueProp) => void;
  handleOnClickDelete: () => void;
}

export type ConversionValueProp = {
  name_1: string;
  name_2: string;
  formula_1: string;
  formula_2: string;
  unit_1: string;
  unit_2: string;
};

export const conversionValueDefault = {
  name_1: '',
  name_2: '',
  formula_1: '',
  formula_2: '',
  unit_1: '',
  unit_2: '',
};
