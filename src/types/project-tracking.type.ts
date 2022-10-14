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
  assignedTeams: {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
  }[];
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

export interface ProjectDetail {
  projects: Project;
  projectRequests: Requests[];
  notifications: Notifications[];
  designFirm: DesignFirmDetail;
}

export interface DesignFirmDetail {
  name: string;
  official_website: string;
  phone: string;
  phone_code: string;
  email: string;
  address: string;
}

export interface Project {
  created_at: string;
  name: string;
  location: string;
  project_type: string;
  building_type: string;
  measurement_unit: number;
  design_due: string;
  construction_start: string;
}

export interface Requests {
  created_at: string;
  title: string;
  message: string;
  status: number;
  created_by: string;
  product: ProductDetail;
  newRequest: boolean;
  requestFor: string;
}

export interface Notifications {
  created_at: string;
  type: number;
  status: number;
  created_by: string;
  product: ProductDetail;
  newNotification: boolean;
}

export const DEFAULT_REQUESTS: Requests = {
  created_at: '',
  title: '',
  message: '',
  status: 0,
  created_by: '',
  product: {
    id: '',
    name: '',
    description: '',
    images: [],
    collection_name: '',
  },
  newRequest: true,
  requestFor: '',
};

export const DEFAULT_PROJECT_DETAIL: ProjectDetail = {
  projects: {
    created_at: '',
    name: '',
    location: '',
    project_type: '',
    building_type: '',
    measurement_unit: 0,
    design_due: '',
    construction_start: '',
  },
  projectRequests: [DEFAULT_REQUESTS],
  notifications: [
    {
      created_at: '',
      type: 0,
      status: 0,
      created_by: '',
      product: {
        id: '',
        name: '',
        description: '',
        images: [],
        collection_name: '',
      },
      newNotification: true,
    },
  ],
  designFirm: {
    name: '',
    official_website: '',
    phone: '',
    phone_code: '',
    email: '',
    address: '',
  },
};

export const DEFAULT_PROJECT_LIST: ProjecTrackingList[] = [
  {
    id: '',
    created_at: '',
    projectName: '',
    projectLocation: '',
    projectType: '',
    designFirm: '',
    projectStatus: '',
    priority: 0,
    priorityName: '',
    assignedTeams: [
      {
        id: '',
        firstname: '',
        lastname: '',
        avatar: '',
      },
    ],
    requestCount: 0,
    newRequest: false,
    notificationCount: 0,
    newNotification: false,
    newTracking: false,
  },
];
