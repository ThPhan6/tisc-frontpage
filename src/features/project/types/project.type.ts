import { ProductItem } from '@/features/product/types';

export interface ProjectFilterValueProps {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

export interface ProjectSummaryData {
  projects: number;
  live: number;
  on_hold: number;
  archived: number;
}

export interface ProjectBodyRequest {
  name: string;
  code: string;
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  project_type_id: string;
  building_type_id: string;
  measurement_unit: number;
  design_due: string;
  construction_start: string;
  status: number;
  country_name?: string;
  state_name?: string;
  city_name?: string;
}

export interface ProjectDetailProps extends ProjectBodyRequest {
  id: string;
}

export interface ProjectListProps {
  id: string;
  status: number;
  code: string;
  name: string;
  location: string;
  project_type: string;
  building_type: string;
  design_due: number;
  assign_teams: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

export interface ProjectsDesignFirm {
  status_name: string;
  count: 0;
  projects: ProjectDetail[];
}

export interface ProjectDetail {
  code: string;
  name: string;
  location: string;
  building_type: string;
  type: string;
  measurement_unit: number;
  design_due: string;
  construction_start: string;
}

export interface ConsideredProjectRoom {
  id: string;
  count: number;
  room_name: string;
  room_id: string;
  room_size: number;
  quantity: number;
  products: ProductItem[];
}

export interface ConsideredProjectArea {
  id?: string;
  name: string;
  rooms: ConsideredProjectRoom[];
}

export interface ConsideredProduct {
  id?: string;
  name: string;
  count: number;
  products: ProductItem[];
  area?: ConsideredProjectArea[];
}

export enum ProductConsiderStatus {
  'Considered',
  'Re-Considered',
  'Unlisted',
}

export enum ProductSpecifyStatus {
  'Specified',
  'Re-specified',
  'Cancelled',
}

export enum ProjectProductStatus {
  consider,
  specify,
}

export enum OrderMethod {
  'Direct Purchase',
  'Custom Order',
}

export type ProductConsiderStatusName = keyof typeof ProductConsiderStatus;

export interface FindProductConsiderRequest {
  project_id: string;
  project_zone_id?: string;
  is_entire?: boolean;
}
