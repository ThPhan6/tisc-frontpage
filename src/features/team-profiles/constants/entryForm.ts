import { TeamProfileDetailProps } from '../types';

export const DEFAULT_TEAMPROFILE: TeamProfileDetailProps = {
  role_id: '',
  firstname: '',
  lastname: '',
  fullname: '',
  gender: null,
  location_id: '',
  department_id: '',
  position: '',
  email: '',
  phone: '',
  mobile: '',
  avatar: '',
  backup_email: '',
  personal_mobile: '',
  linkedin: '',
  created_at: '',
  phone_code: '',
  work_location: '',
  access_level: '',
  status: '',
  type: '',
  relation_id: '',
  permissions: '',
};

export const DEFAULT_TEAMPROFILE_WITH_GENDER = {
  ...DEFAULT_TEAMPROFILE,
  gender: true,
};
