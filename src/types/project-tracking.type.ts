export interface ProjecTrackingList {
  id: string;
  created: string;
  name: string;
  location: string;
  project_type: string;
  design_firm: string;
  status: number;
  requests: number;
  notifications: number;
  priority: number;
  assign_teams: {
    id: string;
    name: string;
    avatar: string;
  }[];
  subscription: number;
}
