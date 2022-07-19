import type { ReactNode } from 'react';

export interface FaqInput {
  question: string;
  answer: string;
}

export interface FaqPanel {
  id?: string;
  icon?: ReactNode;
  title: string;
  description: string;
  FAQ: FaqInput[];
}

export interface FaqItems {
  activeKey?: string | number | (string | number)[];
  data: FaqPanel[];
}

export interface FaqForm {
  tisc: FaqItems;
  brands: FaqItems;
  designers: FaqItems;
}
