export interface GeneralInquiryListProps {
  id: string;
  created_at: string;
  created_by: string;
  design_firm: string;
  firm_location: string;
  inquier: string;
  inquiry_for: string;
  title: string;
  status: number;
  read: string[];
}

export interface GeneralInquirySummaryData {
  inquires: number;
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

export interface InquiryMessageOfGeneralInquiry {
  inquiry_for: string;
  title: string;
  message: string;
  product_collection: string;
  product_description: string;
  product_image: string;
  official_website: string;
}

export interface GeneralInquiryResponse {
  product_name: string;
  design_firm: GeneralInquiryDesignFirm;
  inquiry_message: InquiryMessageOfGeneralInquiry;
}

export interface InquiryMessageTask {
  id: string;
  date: string;
  actions: string;
  teams: string;
  status: string;
}
