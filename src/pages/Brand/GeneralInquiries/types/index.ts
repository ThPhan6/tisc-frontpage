export enum GeneralInquiryStatus {
  pending,
  responded,
}

export interface GeneralInquiryProps {
  date: string;
  design_firm: string;
  firm_location: string;
  inquier: string;
  inquiry_for: string;
  title: string;
  status: GeneralInquiryStatus;
  unreaded: boolean;
}

export interface GeneralInquirySummaryData {
  inquiries: number;
  pending: number;
  responded: number;
}

export interface GeneralInquiryDesignFirm {
  name: string;
  official_website: string;
  inquirer: string;
  role: string;
  work_email: string;
  work_phone: string;
  address: string;
}

export interface GeneralInquiryDesignFirm {
  name: string;
  official_website: string;
  inquirer: string;
  role: string;
  work_email: string;
  work_phone: string;
}

export interface InquiryMessageTask {
  id: string;
  date: string;
  actions: string;
  teams: string;
  status: string;
}

export interface InquiryMessageOfGeneralInquiry {
  inquiry_for: string;
  title: string;
  message: string;
  tasks: InquiryMessageTask[];
}
