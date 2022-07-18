import type { ReactNode } from 'react';
export interface IFAQFieldProps {
  question: string;
  answer: string;
}

export interface IHowToSubProps {
  id?: string;
  icon?: ReactNode;
  title: string;
  description: string;
  FAQ: IFAQFieldProps[];
}

export interface IHowToValueProps {
  activeKey?: string | number | (string | number)[];
  data: IHowToSubProps[];
}

export interface IHowToForm {
  tisc: IHowToValueProps;
  brands: IHowToValueProps;
  designers: IHowToValueProps;
}
