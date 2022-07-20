import { FaqItem } from '@/types/faq.type';

export interface FaqInput {
  question: string;
  answer: string;
}

export interface FaqPanel {
  id: string;
  title: string;
  logo: string;
  document: {
    document: string;
    question_and_answer: {
      question: string;
      answer: string;
    }[];
  };
  created_at: string;
}

export interface FaqItems {
  activeKey?: string | number | (string | number)[];
  data: FaqPanel[];
}

export interface FaqForm {
  tisc: FaqItems;
  brand: FaqItems;
  design: FaqItems;
}

// export type FaqItem = {
//   id: string;
//   icon?: string;
//   title: string;
//   document?: string;
//   question_and_answer?: QnA[];
// };

export type FaqState = {
  value: FaqItem[];
  expandedIndex: number;
};
