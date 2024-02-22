import { AssignedTeamMember } from '@/features/team-profiles/types';

export interface ProjecTrackingList {
  id: string;
  created_at: string;
  projectName: string;
  projectLocation: string;
  projectType: string;
  designFirm: string;
  projectStatus: string;
  priority: number;
  priorityName: string;
  assignedTeams: AssignedTeamMember[];
  requestCount: number;
  newRequest: boolean;
  notificationCount: number;
  newNotification: boolean;
  newTracking: boolean;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  images: string[];
  collection_name: string;
}

export interface LocationDetail {
  address: string;
  city_name: string;
  country_name: string;
  general_email: string;
  general_phone: string;
  phone_code: string;
  teamMembers: {
    firstname: string;
    lastname: string;
    position: string;
  }[];
}

export interface DesignFirmDetail {
  name: string;
  official_website: string;
  locations: LocationDetail[];
}

export interface DesignerInfo {
  location_id: string;
  firstname: string;
  lastname: string;
  position: string;
  email: string;
  phone: string;
  phone_code: string;
}

export interface Project {
  id: string;
  created_at: string;
  name: string;
  location: string;
  project_type: string;
  building_type: string;
  measurement_unit: number;
  design_due: string;
  construction_start: string;
}

export enum ProjectTrackingEnum {
  'Assistance request' = 'Assistance request',
}

export interface ProjectTrackingDetail {
  projects: Project;
  projectRequests: {
    id: string;
    created_at: string;
    title: string;
    message: string;
    status: number;
    created_by: string;
    product: ProductDetail;
    newRequest: boolean;
    requestFor: string;
    designer: DesignerInfo;
  }[];
  notifications: {
    created_at: string;
    type: number;
    status: number;
    created_by: string;
    product: ProductDetail;
    newNotification: boolean;
    designer: DesignerInfo;
    id: string;
  }[];
  designFirm: DesignFirmDetail;
  isRequestsDetailItemOpen?: boolean;
  isNotificationsDetailItemOpen?: boolean;
}

export const DEFAULT_PROJECT_TRACKING_DETAIL: ProjectTrackingDetail = {
  projects: {
    id: '',
    created_at: '',
    name: '',
    location: '',
    project_type: '',
    building_type: '',
    measurement_unit: 0,
    design_due: '',
    construction_start: '',
  },
  projectRequests: [],
  notifications: [],
  designFirm: {
    name: '',
    official_website: '',
    locations: [],
  },
};

export interface RequestAndNotificationDetail {
  read: boolean;
  product: ProductDetail;
  designer: DesignerInfo;
  id: string;
  title: {
    created_at: string;
    name: string | number;
  };
  status: number;
  request?: {
    title: string;
    message: string;
  };
  requestFor?: string;
  message?: string;
  newRequest?: boolean;

  projectProductId?: string; // Project view for brand from link
  projectId?: string; // Assistance Request - Request Detail
}
