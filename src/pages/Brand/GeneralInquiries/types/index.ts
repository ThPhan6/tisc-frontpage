import { ActionTaskModalParams } from '@/components/ActionTask/types';
import { RespondedOrPendingStatus } from '@/types';
import { ProjectTrackingDetail } from '@/types/project-tracking.type';

export interface GeneralInquiryListProps {
  id: string;
  created_at: string;
  design_firm: string;
  firm_location: string;
  inquirer: string;
  inquiry_for: string;
  title: string;
  status: RespondedOrPendingStatus;
  read: boolean;
}

export interface GeneralInquirySummaryData {
  inquires: number;
  pending: number;
  responded: number;
}

export interface GeneralInquiryDesignFirm {
  name: string;
  address: string;
  country_name: string;
  city_name: string;
  state_name: string;
  phone_code: string;
  general_email: string;
  general_phone: string;
  official_website: string;
}

export interface InquiryMessageOfGeneralInquiry {
  id: string;
  inquiry_for: string;
  title: string;
  message: string;
  product: {
    id: string;
    name: string;
    description: string;
    collection: string;
    image: string;
  };
  designer: {
    name: string;
    position: string;
    email: string;
    phone: string;
    phone_code: string;
  };
}

export interface GeneralInquiryResponse {
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

export interface ActionTaskRequestBody extends ActionTaskModalParams {
  common_type_ids: string[];
}

export interface ActionTaskModalProps {
  setData?: (setState: (prevState: ProjectTrackingDetail) => ProjectTrackingDetail) => void;
  indexItem?: number;
}
