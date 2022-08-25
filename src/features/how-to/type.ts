export interface CollapsingProps {
  activeKey?: string;
  handleActiveCollapse: (index: number) => void;
}

export type QnA = {
  question: string;
  answer: string;
};

export interface QuestionProps extends CollapsingProps {
  index: number;
  question: string;
}

export type FaqItem = {
  id: string;
  icon?: string;
  title: string;
  document?: string;
  question_and_answer?: QnA[];
};

export interface Faq {
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
