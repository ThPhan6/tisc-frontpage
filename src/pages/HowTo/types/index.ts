export interface CollapsingProps {
  activeKey?: string;
  handleActiveCollapse: (id: string) => void;
}

export type QnA = {
  question: string;
  answer: string;
};

export interface QuestionProps extends CollapsingProps {
  id: string;
  question: string;
}

// export type FaqItem = {
//   id: string;
//   icon?: string;
//   title: string;
//   document?: string;
//   question_and_answer?: QnA[];
// };
