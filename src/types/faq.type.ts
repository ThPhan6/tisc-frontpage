export interface IFAQ {
  id: string;
  logo: string;
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
export interface IFAQUpdateRequest {
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
