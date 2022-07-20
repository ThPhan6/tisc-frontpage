import { PhoneInputValueProp } from '@/components/Form/types';
import { PATH } from '@/constants/path';
import { isUndefined } from 'lodash';
import { history } from 'umi';
import { pushTo } from './history';

export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d][\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{7,}$/;
export const REGEX_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const REGEX_GET_CONTENT_ONLY = /[_.\n\s\r\t__]*/g;
export const REGEX_NUMBER_ONLY = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

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
export const redirectAfterBrandOrDesignLogin = async () => {
  pushTo(PATH.brandHomePage);
};

export const getLetterAvatarBackgroundColor = (name: string) => {
  let digitString = '';

  /// convert character string to integer string
  for (let i = 0; i < name.length; i++) {
    digitString += name[i].charCodeAt(0);
  }

  const number = Number(digitString) * 9999;
  const backgroundColor =
    '#' +
    number
      .toString()
      .replace(/\D/g, '')
      .substring(number.toString().length - 6, number.toString().length);

  return backgroundColor;
};

export const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const isShowErrorMessage = (
  type: 'email' | 'password',
  value: string | PhoneInputValueProp,
) => {
  if (typeof value === 'string') {
    if (!value) {
      return true;
    }
    if (type === 'email') {
      return validateEmail(value);
    }
    return validatePassword(value);
  }
  return false;
};

export function showImageUrl(url: string) {
  if (url.startsWith('data:image')) {
    return url;
  }
  return `${STORE_URL}${url}`;
}

export const checkUndefined = (value: string | number | undefined) => {
  return isUndefined(value) ? 'N/A' : value;
};

export const formatPhoneCode = (phoneCode: string, removePlus: boolean = false) => {
  if (phoneCode.startsWith('+') || phoneCode === '') {
    if (removePlus) {
      return phoneCode.substring(1);
    }
    return phoneCode;
  }
  if (removePlus) {
    return phoneCode;
  }
  return `+${phoneCode}`;
};

export const validatePhoneNumber = (phoneNumber: string) => {
  return REGEX_NUMBER_ONLY.test(phoneNumber);
};

export const validatePostalCode = (postalCode: string) => {
  if (postalCode.length >= 5 && postalCode.length <= 10) {
    return true;
  }
  return false;
};
