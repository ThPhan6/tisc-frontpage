import type { STATUS_RESPONSE } from '@/constants/util';

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponseProp = {
  message: STATUS_RESPONSE;
  statusCode: number;
  token: string;
  type: string;
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
  interested: number[];
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
export type CreatePasswordRequestBody = {
  password: string;
  confirmed_password: string;
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

export type SignUpDesignerRequestBody = {
  firstname: string;
  email: string;
  password: string;
  confirmed_password: string;
};

export type ContactRequestBody = {
  name: string;
  email: string;
  inquiry: string;
};

export type Policy = {
  id: string;
  title: string;
  document: {
    document: '';
  };
};
