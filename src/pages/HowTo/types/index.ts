export interface CollapsingProps {
  activeKey?: string;
  handleActiveCollapse: (id: string) => void;
}

export type QnA = {
  id: string;
  question: string;
  answer: string;
};

export interface QuestionProps extends CollapsingProps {
  id: string;
  question: string;
}

export type FaqItem = {
  id: string;
  icon?: JSX.Element;
  title: string;
  document?: string;
  question_and_answer?: QnA[];
};
