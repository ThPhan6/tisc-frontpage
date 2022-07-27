import { TeamProfileDetailProps } from '@/types';

export interface ProjectFilterValueProps {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

export interface ProjectSummaryProps {
  projects: number;
  live: number;
  onHold: number;
  archived: number;
}

export interface ProjectListProps {
  status: number;
  code: string;
  name: string;
  location: string;
  project_type: string;
  building_type: string;
  design_due: number;
  assign_teams: TeamProfileDetailProps[];
}
