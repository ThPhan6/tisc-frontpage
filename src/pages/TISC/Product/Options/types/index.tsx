export interface ElementInputProp {
  order: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ConversionItemProps {
  value: ConversionValueProp;
  onChangeValue: (value: ConversionValueProp) => void;
  handleOnClickDelete: () => void;
}

export type ElementInputValueProp = {
  id: string;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
};

export const elementInputValueDefault = {
  id: '',
  value_1: '',
  value_2: '',
  unit_1: '',
  unit_2: '',
};

export type ConversionValueProp = {
  id: string;
  input: string;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
};

export const conversionValueDefault = {
  id: '',
  input: '',
  value_1: '',
  value_2: '',
  unit_1: '',
  unit_2: '',
};
