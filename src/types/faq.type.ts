export interface FaqItem {
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

export interface AllFaq {
  tisc: FaqItem[];
  brand: FaqItem[];
  design: FaqItem[];
}
export interface FAQUpdateRequest {
  title: string;
  document: {
    document: string;
    question_and_answer: [
      {
        question: string;
        answer: string;
      },
    ];
  };
}

export type FaqState = {
  value: FaqItem[];
  expandedIndex: number;
};

export interface AllFaqState {
  brand: FaqState;
  design: FaqState;
  tisc: FaqState;
}
