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

export type FaqState = {
  value: FaqItem[];
  expandedIndex: number;
};
