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
  read_by: string[];
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
  position: string;
  email: string;
  phone: string;
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

export interface ActionTaskProps {
  id: string;
  created_at: string;
  created_by: string;
  model_id: string;
  model_name: string;
  lastname: string;
  firstname: string;
  action_name: string;
  status: number;
}

export interface ActionTaskModelParams {
  model_id: string;
  model_name: 'notification' | 'request' | 'inquiry';
}

export interface ActionTaskRequestBody extends ActionTaskModelParams {
  common_type_ids: string[];
}
