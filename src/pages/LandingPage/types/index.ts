import type { STATUS_RESPONSE } from '@/constants/util';

export interface LoginModalProps {
  theme?: 'default' | 'dark';
  visible: boolean;
  onClose: () => void;
  handleSubmitLogin: (data: { email: string; password: string }) => void;
  handleForgotPassword: (email: string) => void;
  type?: string;
}

export type InputValueProp = {
  email: string;
  password: string;
};

export type LoginBodyProp = {
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
  avatar: string;
  backup_email: string;
  personal_mobile: string;
  linkedin: string;
};

export interface ResetPasswordModalProps {
  resetData: {
    email: string;
    token: string;
  };
  visible: {
    value: boolean;
    setValue: (value: boolean) => void;
  };
  handleSubmit: (data: ResetPasswordBodyProp) => void;
}

export type ResetInputValueProp = {
  password: string;
  confirmPassword: string;
};

export type ResetPasswordBodyProp = {
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
