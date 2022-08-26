import { PATH } from '@/constants/path';
import { history } from 'umi';

import { isNaN, isNumber, isUndefined, toNumber } from 'lodash';

import { PhoneInputValueProp } from '@/components/Form/types';

import { pushTo } from './history';

export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d][\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{7,}$/;
export const REGEX_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const REGEX_GET_CONTENT_ONLY = /[_.\n\s\r\t__]*/g;
export const REGEX_PHONE_NUMBER_ONLY = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
export const REGEX_EMPTY_SPACE = /^\S*$/;
export const REGEX_NUMBER_ONLY = /^[0-9]*$/;
export const REGEX_NUMBER_FLOAT_ONLY = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

export const validateNumber = (text: string, allowEmpty = true) => {
  if (text === '' && allowEmpty) {
    return true;
  }
  return REGEX_NUMBER_ONLY.test(text);
};
export const validateFloatNumber = (text: string, allowEmpty = true) => {
  if (text === '' && allowEmpty) {
    return true;
  }
  return REGEX_NUMBER_FLOAT_ONLY.test(text);
};

export const validateEmail = (email: string) => {
  return REGEX_EMAIL.test(email);
};

export const validatePassword = (password: string) => {
  return REGEX_PASSWORD.test(password);
};

export const redirectAfterLogin = () => {
  if (!history) return;
  const { query } = history.location;
  const { redirect } = query as { redirect: string };
  pushTo(redirect || PATH.tiscHomePage);
};

export const redirectAfterBrandLogin = () => {
  pushTo(PATH.brandHomePage);
};

export const redirectAfterDesignerLogin = () => {
  pushTo(PATH.designerHomePage);
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

export function showImageUrl(url?: string | null) {
  if (!url) {
    return '';
  }
  if (url.startsWith('data:image')) {
    return url;
  }
  return `${STORE_URL}${url}`;
}

export const checkUndefined = (value: string | number | undefined) => {
  return isUndefined(value) ? 'N/A' : value;
};

export const formatPhoneCode = (phoneCode?: string | null, removePlus: boolean = false) => {
  if (!phoneCode) {
    return '';
  }
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
  return REGEX_PHONE_NUMBER_ONLY.test(phoneNumber);
};

export const validatePostalCode = (postalCode: string) => {
  if (postalCode.length <= 10) {
    return true;
  }
  return false;
};
// for postal code
export const messageError = (input: string, length: number = 10, message: string) => {
  return input !== '' ? (input.length === length ? message : '') : undefined;
};
export const messageErrorType = (
  input: string,
  length: number,
  error: 'error' | 'warning',
  normal: 'normal',
) => {
  return input !== '' ? (input.length === length ? error : normal) : undefined;
};

export const isEmptySpace = (input: string) => {
  return REGEX_EMPTY_SPACE.test(input);
};

export const getPathName = (pathName: string) => {
  const name = pathName.split('/')[1];

  if (name === 'tisc') {
    return true;
  }

  return false;
};
export const getFullName = (data: any) => {
  // return `${data?.lastname ?? ''} ${data?.firstname ?? ''}`;
  return `${data?.firstname ?? ''} ${data?.lastname ?? ''}`;
};

export const isValidURL = (url: string) => {
  let validURL: URL;
  try {
    validURL = new URL(url);
  } catch (_) {
    return false;
  }

  return validURL.protocol === 'http:' || validURL.protocol === 'https:';
};

export const getMaxLengthText = (text: string, maxLength: number) => {
  if (!text) {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3) + '...';
};

export const formatNumberDisplay = (
  num: number | string,
  locale: Intl.LocalesArgument = 'en-us',
  options: Intl.NumberFormatOptions = {},
) => {
  let value = num;
  if (!isNumber(value)) {
    value = toNumber(value);
  }
  if (isNaN(value)) {
    return 'N/A';
  }
  return value.toLocaleString(locale, options);
};

// for email
export const emailMessageError = (email: string, errorMessage: string) => {
  const checkValidEmail = validateEmail(email);

  return email !== '' ? (checkValidEmail ? '' : errorMessage) : undefined;
};
export const emailMessageErrorType = (
  email: string,
  error: 'error' | 'warning',
  normal: 'normal',
) => {
  const checkValidEmail = validateEmail(email);

  return email !== '' ? (checkValidEmail ? normal : error) : undefined;
};

export const setUrlParams = (params: { key: string; value: string }[]) => {
  const url = new URL(window.location.href);
  params.forEach(({ key, value }) => {
    url.searchParams.set(key, value);
  });
  window.history.pushState(null, '', url.toString());
};

export const removeUrlParams = (key: string | string[]) => {
  const url = new URL(window.location.href);
  if (typeof key === 'string') {
    url.searchParams.delete(key);
  } else {
    key.forEach((k) => url.searchParams.delete(k));
  }
  window.history.pushState(null, '', url.toString());
};

export const updateUrlParams = (params: {
  set?: { key: string; value: string }[];
  remove?: string | string[];
  removeAll?: boolean;
}) => {
  const { set, remove, removeAll } = params;
  if (!set && !remove) {
    return;
  }

  const url = new URL(window.location.href);

  if (removeAll) {
    url.search = '';
  } else if (remove) {
    if (typeof remove === 'string') {
      url.searchParams.delete(remove);
    } else {
      remove.forEach((k) => url.searchParams.delete(k));
    }
  }

  if (set) {
    set.forEach(({ key, value }) => {
      url.searchParams.set(key, value);
    });
  }

  window.history.pushState(null, '', url.toString());
};

export const removeAllUrlParams = () => {
  window.history.pushState(null, '', window.location.pathname);
};
