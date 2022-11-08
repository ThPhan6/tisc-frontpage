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
  data: {
    id: string;
    quantity: number;
    label: string;
    subs: {
      id: string;
      quantity: number;
      label: string;
    }[];
  }[];
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
  zones: {
    id: string;
    name: string;
    areas: {
      id: string;
      name: string;
      count: number;
      rooms: {
        id: string;
        room_name: string;
        room_id: string;
        room_size: number;
        quantity: number;
        sub_total: number;
        room_size_unit: string;
      }[];
    }[];
  }[];
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

export interface ProjectListingDetail {
  basic: ProjectInformation;
  spacing: SpaceDetail;
  considered: {
    brands: BrandInfo[];
    deleted: number;
    consider: number;
    unlisted: number;
  };
  specified: {
    brands: BrandInfo[];
    deleted: number;
    specified: number;
    cancelled: number;
  };
  members: TeamDetail[];
}
