import { PhoneInputValueProp } from '@/components/Form/types';
import { PATH } from '@/constants/path';
import { isUndefined } from 'lodash';
import { history } from 'umi';
import { pushTo } from './history';

export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d][\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{7,}$/;
export const REGEX_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateEmail = (email: string) => {
  return REGEX_EMAIL.test(email);
};

export const validatePassword = (password: string) => {
  return REGEX_PASSWORD.test(password);
};

export const validatePhoneInput = (value: PhoneInputValueProp) => {
  return value.phoneNumber && value.zoneCode;
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

export const isShowErrorMessage = (
  type: 'email' | 'password' | 'phone-input',
  value: string | PhoneInputValueProp,
) => {
  if (typeof value === 'string' && type !== 'phone-input') {
    if (!value) {
      return true;
    }
    if (type === 'email') {
      return validateEmail(value);
    }
    return validatePassword(value);
  }
  if (type === 'phone-input' && typeof value !== 'string') {
    if (!value.phoneNumber && !value.zoneCode) {
      return true;
    }
    return validatePhoneInput(value);
  }
  return false;
};

export function showImageUrl(url: string) {
  return `${STORE_URL}${url}`;
}

export const getPersonalPhone = (phone: string | undefined) => {
  if (phone) {
    const phoneArray = phone.split(' ');
    return {
      zoneCode: phoneArray[0],
      phoneNumber: phoneArray[1],
    };
  }
};

export const checkUndefined = (value: string | number | undefined) => {
  return isUndefined(value) ? 'N/A' : value;
};
