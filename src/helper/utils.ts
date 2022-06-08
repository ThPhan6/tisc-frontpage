import { PATH } from '@/constants/path';
import { history } from 'umi';
import { pushTo } from './history';

export const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
export const REGEX_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateEmail = (email: string) => {
  return REGEX_EMAIL.test(email);
};

export const validatePassword = (password: string) => {
  return REGEX_PASSWORD.test(password);
};

export const redirectAfterLogin = async () => {
  if (!history) return;
  const { query } = history.location;
  const { redirect } = query as { redirect: string };
  pushTo(redirect || PATH.homePage);
};

export const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const isShowErrorMessage = (type: 'email' | 'password', value: string) => {
  if (!value) {
    return true;
  }
  if (type === 'email') {
    return validateEmail(value);
  }
  return validatePassword(value);
};
