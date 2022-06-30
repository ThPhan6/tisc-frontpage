export interface ICollapseProps {
  activeKey?: string;
  handleActiveCollapse: (id: string) => void;
}

export interface ItemHowToProp extends ICollapseProps {
  value: HowToValueProp;
}

export interface ItemQAProp extends ICollapseProps {
  item: QAValueProp;
}

export interface QuestionProp extends ICollapseProps {
  id: string;
  question: string;
}

export type HowToValueProp = {
  id: string;
  icon?: JSX.Element;
  title: string;
  document?: string;
  question_and_answer?: QAValueProp[];
};

export type QAValueProp = {
  id: string;
  question: string;
  answer: string;
};
