export interface TeamProfileTableProps {
  id: string;
  firstname: string;
  lastname: string;
  fullname: string;
  work_location: string;
  position: string;
  email: string;
  phone: string;
  avatar: string;
  access_level: string;
  created_at: string;
  status: string;
  phone_code: string;
}

export interface TeamProfileDetailProps {
  id?: string;
  role_id: string;
  firstname: string;
  lastname: string;
  fullname: string;
  gender: boolean;
  location_id: string;
  department_id: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  avatar: string;
  backup_email: string;
  personal_mobile: string;
  linkedin: string;
  created_at: string;
  phone_code: string;
  work_location: string;
  access_level: string;
  status: string | number;
  type: string | number;
  relation_id: string;
  permissions: string;
}

export interface TeamProfileRequestBody {
  firstname: string;
  lastname: string;
  gender: boolean;
  location_id: string;
  department_id: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  role_id: string;
}

export interface TeamProfileBrandAssignMember {
  avatar: string | null;
  email: string;
  firstname: string;
  lastname: string;
  id: string;
  role_id: string;
}

export interface BrandTeam {
  logo: string;
  firstname: string;
  lastname: string;
  gender: boolean;
  work_location: string | null;
  department: string;
  position: string | null;
  email: string;
  phone: string | null;
  mobile: string | null;
  access_level: string;
  status: number;
}

export interface TeamProfileGroupCountry {
  country_name: string;
  count: number;
  users: BrandTeam[];
}

export type typeInput = 'firstname' | 'lastname' | 'position' | 'email';

export type typePhoneInput = 'phone' | 'mobile';

export type typeRadio = 'gender' | 'location' | 'department' | 'access_level';

export type typeOpenModal = '' | 'location' | 'department' | 'access_level';

export interface TeamsDesignFirm {
  country_name: string;
  count: 0;
  users: {
    logo: string;
    firstname: string;
    lastname: string;
    gender: true;
    work_location: string;
    department: string;
    position: string;
    email: string;
    phone: string;
    mobile: string;
    access_level: string;
    status: number;
    phone_code: string;
  }[];
}
