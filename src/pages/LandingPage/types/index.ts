import type { STATUS_RESPONSE } from '@/constants/util';

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponseProp = {
  message: STATUS_RESPONSE;
  statusCode: number;
  token: string;
};

export type UserInfoDataProp = {
  id: string;
  role_id: string;
  permissions: any;
  access_level: string;
  firstname: string;
  lastname: string;
  gender: string;
  location: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  phone_code: string;
  avatar: string;
  backup_email: string;
  personal_mobile: string;
  linkedin: string;
  type: number;
};

export type ResetPasswordInput = {
  password: string;
  confirmPassword: string;
};

export type ResetPasswordRequestBody = {
  password: string;
  confirmed_password: string;
  reset_password_token: string;
};

export interface ModalProps {
  theme?: 'default' | 'dark';
  visible: boolean;
  onClose: () => void;
}

export type ModalOpen =
  | 'About'
  | 'Policies'
  | 'Contact'
  | 'Browser Compatibility'
  | 'Designer Signup'
  | 'Brand Interested'
  | 'Tisc Login'
  | 'Login'
  | '';
