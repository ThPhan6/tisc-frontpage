export interface AgreementPoliciesProps {
  title: string;
  message: string;
}

export interface CreateDocumentationResquestBody {
  title: string;
  document: DocumentDetail;
}

export interface DocumentDetail {
  document: string;
  question_and_answer?: {
    question: string;
    answer: string;
  }[];
}

export interface Documentation {
  id: string;
  title: string;
  document: DocumentDetail;
  updated_at: string;
  author: {
    firstname: string;
    id: string;
    lastname: string;
  };
}
