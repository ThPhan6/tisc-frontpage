export interface CollapsingProps {
  activeKey?: string | number;
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

export type Faq = {
  id: string;
  icon?: string;
  title: string;
  document?: string;
  question_and_answer?: QnA[];
};
