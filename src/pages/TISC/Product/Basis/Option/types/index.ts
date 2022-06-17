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

export interface ElementInputProp {
  order: number;
  value?: ElementInputValueProp;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface OptionItemProps {
  value: OptionValueProp;
  onChangeValue: (value: OptionValueProp) => void;
  handleOnClickDelete: () => void;
}

export interface OptionValueProp {
  id?: string;
  name: string;
  subs: ElementInputValueProp[];
}

export type ElementInputValueProp = {
  id?: string;
  name: string;
  subs: {
    id?: string;
    value_1: string;
    value_2: string;
    unit_1: string;
    unit_2: string;
  }[];
};

export const elementInputValueDefault = {
  name: '',
  subs: [],
};
