export interface ElementInputProp {
  order: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface OptionItemProps {
  value: ElementInputValueProp;
  onChangeValue: (value: ElementInputValueProp) => void;
  handleOnClickDelete: () => void;
  onCancel?: () => void;
  onSubmit?: (data: OptionItemProps) => void;
}

export type OptionValueProp = {
  id?: string;
  name: string;
  subs: ElementInputValueProp[];
};

export type ElementInputValueProp = {
  id?: string;
  name: string;
  subs: {
    id?: string;
    image?: string;
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
