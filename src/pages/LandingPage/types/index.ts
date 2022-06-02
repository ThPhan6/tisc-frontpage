export interface LoginModalProps {
  theme?: 'default' | 'dark';
  visible: {
    value: boolean;
    setValue: (value: boolean) => void;
  };
  handleSubmitLogin: (data: { email: string; password: string }) => void;
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
  message: 'SUCCESS';
  statusCode: number;
  token: string;
};

export type UserInfoDataProp = {
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
