export interface HowToProp {
  howToValue?: howToValueProp;
}

export interface ItemHowToProp {
  value: howToValueProp;
}
export type howToValueProp = {
  icon?: JSX.Element;
  title: string;
  is_collapse?: string;
  document?: string;
  question_and_answer?: QAValueProp[];
};

export const howToValueDefault = {
  icon: '',
  title: '',
  is_collapse: '',
  document: '',
  question_and_answer: [],
};

export interface ItemQAProp {
  value: QAValueProp;
}
export type QAValueProp = {
  question: string;
  answer: string;
};

export const QAValueDefault = {
  question: '',
  answer: '',
};
