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
