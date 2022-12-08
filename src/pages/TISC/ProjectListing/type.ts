import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import { ProjectSpaceZone } from '@/features/project/types';

export interface ProjectListingResponse {
  id: string;
  created_at: string;
  name: string;
  status: string;
  project_type: string;
  building_type: string;
  country_name: string;
  city_name: string;
  design_due: string;
  design_id: string;
  metricArea: number;
  imperialArea: number;
  productCount: number;
  deleted: number;
  consider: number;
  unlisted: number;
  specified: number;
  cancelled: number;
}

export interface ProjectListingSummary {
  data: DataMenuSummaryProps[];
  area: {
    metric: number;
    imperial: number;
  };
}

export interface BrandInfo {
  name: string;
  logo: string;
  products: {
    id: string;
    brand_id: string;
    name: string;
    image: string;
    status: number;
  }[];
}

export interface ProjectInformation {
  designFirm: {
    name: string;
    logo: string;
  };
  code: string;
  name: string;
  status: number;
  address: string;
  project_type: string;
  building_type: string;
  measurement_unit: number;
  design_due: string;
  construction_start: string;
  updated_at: string;
}

export interface SpaceDetail {
  imperialArea: number;
  metricArea: number;
  zones: ProjectSpaceZone[];
}

export interface TeamDetail {
  id: string;
  firstname: string;
  lastname: string;
  gender: boolean;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  status: number;
  department: string;
  phone_code: string;
  access_level: string;
  work_location: string;
  avatar: string;
}

export interface CustomProduct {
  company_id: string;
  image: string;
  name: string;
  status: number;
  isSpecified?: boolean;
}
export interface ProjectListingDetail {
  basic: ProjectInformation;
  spacing: SpaceDetail;
  considered: {
    brands: BrandInfo[];
    customProducts: CustomProduct[];
    deleted: number;
    consider: number;
    unlisted: number;
  };
  specified: {
    brands: BrandInfo[];
    customProducts: CustomProduct[];
    deleted: number;
    specified: number;
    cancelled: number;
  };
  members: TeamDetail[];
}
