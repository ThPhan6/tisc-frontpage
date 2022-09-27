import { PATH } from '@/constants/path';
import { SORT_ORDER } from '@/constants/util';
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
  for (const person of name) {
    digitString += person.charCodeAt(0);
  }

  const number = Number(digitString) * 9999;
  return (
    '#' +
    number
      .toString()
      .replace(/\D/g, '')
      .substring(number.toString().length - 6, number.toString().length)
  );
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
export const messageError = (input: string, message: string, length: number = 10) => {
  if (input === '') {
    return undefined;
  }
  return input.length === length ? message : '';
};
export const messageErrorType = (
  input: string,
  length: number,
  error: 'error' | 'warning',
  normal: 'normal',
) => {
  if (input === '') {
    return undefined;
  }
  return input.length === length ? error : normal;
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
  return `${data?.firstname || data?.first_name || ''} ${data?.lastname || data?.last_name || ''}`;
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
export const getEmailMessageError = (email: string, errorMessage: string) => {
  const checkValidEmail = validateEmail(email);
  if (email === '') {
    return undefined;
  }
  return checkValidEmail ? '' : errorMessage;
};
export const getEmailMessageErrorType = (
  email: string,
  error: 'error' | 'warning',
  normal: 'normal',
) => {
  const checkValidEmail = validateEmail(email);
  if (email === '') {
    return undefined;
  }
  return checkValidEmail ? normal : error;
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

export const setSortOrder = (order?: string) => {
  if (!order) return '';

  return order === SORT_ORDER.increase ? SORT_ORDER.headerFollow : SORT_ORDER.footerFollow;
};

/// Don't use to return component
export const getValueByCondition = (valueByCondition: [any, any][], finalValue?: any) => {
  return valueByCondition.find((condition) => (condition[0] ? true : false))?.[1] ?? finalValue;
};

export const getBusinessAddress = (businessAddress: any) => {
  const city = businessAddress.city_name !== '' ? `${businessAddress.city_name},` : '';
  const state = businessAddress.state_name !== '' ? `${businessAddress.state_name},` : '';
  return `${businessAddress.address}, ${city} ${state} ${businessAddress.country_name}`;
};
