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
