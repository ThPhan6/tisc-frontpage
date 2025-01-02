import { MESSAGE_ERROR } from '@/constants/message';
import { SORT_ORDER } from '@/constants/util';
import { message as messageAntd } from 'antd';

import { isEmpty, isNaN, isNumber, isUndefined, lowerCase, throttle, toNumber } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { PhoneInputValueProp } from '@/components/Form/types';
import { TableColumnItem } from '@/components/Table/types';
import { UserType } from '@/pages/LandingPage/types';
import { CommonPartnerType } from '@/types';

import routes from '../../config/routes';
import { pushTo } from './history';
import moment from 'moment';

export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()+=~`{}|/:;‘“<>[,.-])[A-Za-z\d@$!%*?&_#^()+=~`{}|/:;’“<>[,.-]{8,}$/;
export const REGEX_EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
export const REGEX_GET_CONTENT_ONLY = /[_.\n\s\r\t__]*/g;
export const REGEX_PHONE_NUMBER_ONLY = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
export const REGEX_EMPTY_SPACE = /^\S*$/;
export const REGEX_NUMBER_ONLY = /^[0-9]*$/;
export const REGEX_NUMBER_FLOAT_ONLY = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
export const REGEX_HASH_WITH_DIGITS = /#(\d+)/;

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

const findFirstAccessibleMenu = (
  index: number,
  routeList: any[],
  access: any,
): undefined | string => {
  const routeItem = routeList[index];
  if (!routeItem) {
    return;
  }
  if (!routeItem.access) {
    return findFirstAccessibleMenu(index + 1, routeList, access);
  }
  const haveSubRoutes = routeItem.access && routeItem.routes?.some((route: any) => route.access);
  if (haveSubRoutes) {
    return findFirstAccessibleMenu(0, routeItem.routes, access);
  }
  if (access[routeItem.access] === true) {
    return routeItem.path;
  }
  return findFirstAccessibleMenu(index + 1, routeList, access);
};

const ACCESS_BY_TYPE: { [key in UserType]: string } = {
  1: 'tisc',
  2: 'brand',
  3: 'design',
  4: 'partner',
};

/// default throttle action has only called first time when function excuted
export const throttleAction = (
  fnc: any,
  time: number = 1000,
  action?: { leading?: boolean; trailing?: boolean },
) =>
  throttle(fnc, time, {
    leading: action?.leading ?? true,
    trailing: action?.trailing ?? false,
  });

export const redirectAfterLogin = (access: any, userType: UserType) => {
  const routesByUserType = routes.filter((el: any) =>
    el.access?.includes(ACCESS_BY_TYPE[userType]),
  );

  const accessableMenu = findFirstAccessibleMenu(0, routesByUserType, access) || '/404';

  pushTo(accessableMenu);
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

export const formatCurrencyNumber = (
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
    return MESSAGE_ERROR.EMAIL_REQUIRED;
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

export const getSelectedOptions = (options: CheckboxValue[], selectedIds: string[]) =>
  options.filter((opt) => selectedIds.includes(String(opt.value)) || opt.value === 'other');

export const setDefaultWidthForEachColumn = (
  table: TableColumnItem<any>[],
  // excluding column set width
  excludedColIndex?: number | number[],
  // set same width for each column
  // default columns are action/status/count
  // default witdh for these columns are its width have been set(e.width)
  setWidthFor?: { columns?: string[]; colWidth?: number },
  // default width for each columns(default number is 10)
  defaultWidth?: number,
) =>
  table.map((e, index) => ({
    ...e,
    width: getValueByCondition([
      // set column width auto by index
      [
        typeof excludedColIndex === 'number'
          ? excludedColIndex === index
          : excludedColIndex?.includes(index),
        'auto',
      ],
      // set custom column with its width
      [setWidthFor?.columns?.includes(String(e.dataIndex)), setWidthFor?.colWidth || e.width],
      // default columns with its width have been set
      [
        !setWidthFor &&
          ['action', 'status', 'count'].includes(lowerCase(String(e.dataIndex || e.title))),
        e.width,
      ],
      // set custom default width for each column
      [defaultWidth, defaultWidth],
      // default width for each column is 10
      [!defaultWidth, 10],
    ]),
  }));

export const getDesignDueDay = (designDue: number) => {
  const dueDay = moment(designDue).diff(moment(moment().format('YYYY-MM-DD')), 'days') ?? 0;
  let suffix = 'day';
  if (dueDay > 1 || dueDay < -1) {
    suffix += 's';
  }
  return {
    value: dueDay,
    text: dueDay === 0 ? 'Today' : `${dueDay} ${suffix}`,
  };
};

export const validateDocumentTitle = (title: string) => {
  if (title.length <= 50) {
    return true;
  }
  return false;
};

export const bufferToArrayBufferCycle = (buffer: Buffer) => {
  const result = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(result);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return result;
};

export const formatNumber = (
  number: number | string | undefined = 0,
  maximumFractionDigits = 2,
) => {
  return number.toLocaleString(undefined, { maximumFractionDigits });
};

export const formatPercentNumber = (
  number: number | string,
  maximumFractionDigits: number = 0,
  includePercent: boolean = true,
) => {
  const result = formatNumber((Number(number) / 100) * 10000, maximumFractionDigits);

  return includePercent ? `${result}%` : result;
};

export const formatImageIfBase64 = (img: string) =>
  img.indexOf('data:image') > -1 ? img.split(',')[1] : img;

export const checkValidURL = (url: string) => {
  const result = url.match(
    /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  );
  return result !== null;
};

export const checkBrowser = () => {
  const chromeAgent = navigator.userAgent.indexOf('Chrome') > -1;
  let safariAgent = navigator.userAgent.indexOf('Safari') > -1;

  if (chromeAgent && safariAgent) {
    safariAgent = false;
  }

  return { isSafari: safariAgent, isChrome: chromeAgent };
};

export const checkNil = (value: string | number) =>
  value === '' || typeof value === null || typeof value === undefined;

export const uniqueArrayBy = (arr: any[], uniqKeys: string[]) => {
  const obj = Object.create(null);

  return arr.filter((el) => {
    const key = uniqKeys.map((k) => el[k]).join('|');

    if (!obj[key]) {
      obj[key] = true;
      return true;
    }
  });
};

export const findDuplicateBy = (arr: any[], uniqKeys: string[]): any[] => {
  const dup: any = [];
  const seen: any = {};

  arr.forEach((item) => {
    const key = uniqKeys.map((k) => item[k]).join('|');

    if (seen[key]) {
      dup.push(item);
    } else {
      seen[key] = true;
    }
  });

  return dup;
};

export const sortObjectArray = (items: any[], field: string, order: 'asc' | 'desc' = 'asc') => {
  const compare = (value1: any, value2: any) => {
    const item1 = typeof value1[field] === 'string' ? value1[field].toLowerCase() : value1[field];

    const item2 = typeof value2[field] === 'string' ? value2[field].toLowerCase() : value2[field];

    if (order === 'asc') {
      if (typeof item1 === 'string') {
        return item1.localeCompare(item2, undefined, { numeric: true, sensitivity: 'base' });
      }
    }

    if (typeof item1 === 'string') {
      return item2.localeCompare(item1, undefined, { numeric: true, sensitivity: 'base' });
    }
  };

  return items.sort(compare);
};

export const getQueryVariableFromOriginURL = (originURL: string): Record<string, string> => {
  let pairs: string[] = [];

  const vars = originURL.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('?');

    pairs = pairs.concat(pair);
  }

  const queryPairs = pairs.splice(1, pairs.length - 1);

  let result = {};

  for (const queryPair of queryPairs) {
    const [key, value] = queryPair.split('=');

    result = { ...result, [key]: value };
  }

  return result;
};
export const removeSpecialChars = (str: string, replaceStr: string = '') => {
  return str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, replaceStr);
};

export const simplizeString = (str: string) => {
  return removeSpecialChars(str.trim().toLowerCase().replace(/ /g, '-')).replace(/\-+/g, '-');
};

export const validateRequiredFields = <T>(
  data: T,
  requiredFields: { field: keyof T; messageField: string }[],
) => {
  let check = true;
  requiredFields.forEach((requiredField) => {
    if (
      typeof data[requiredField.field] === 'number' ||
      typeof data[requiredField.field] === 'boolean'
    ) {
      return;
    }

    if (isEmpty(data[requiredField.field])) {
      messageAntd.error(requiredField.messageField);
      check = false;
    }

    if (requiredField.field === 'email' && !REGEX_EMAIL.test(String(data[requiredField.field]))) {
      messageAntd.error('Invalid email format');
      check = false;
    }
  });

  return check;
};

export const handleGetCommonPartnerTypeList = (data: CommonPartnerType | null) => {
  if (data) {
    const affiliationOrder = ['Agent', 'Distributor'];
    const relationOrder = ['Direct', 'Indirect'];

    const sortedAffiliation = data.affiliation.sort((a, b) => {
      const indexA = affiliationOrder.indexOf(a.name);
      const indexB = affiliationOrder.indexOf(b.name);

      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    const sortedRelation = data.relation.sort((a, b) => {
      const indexA = relationOrder.indexOf(a.name);
      const indexB = relationOrder.indexOf(b.name);

      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    const acquisitionOrder = [
      'Leads',
      'Awareness',
      'Interests',
      'Negotiation',
      'Active',
      'Freeze',
      'Inactive',
    ];
    const sortedAcquisition = data.acquisition.sort((a, b) => {
      const indexA = acquisitionOrder.indexOf(a.name);
      const indexB = acquisitionOrder.indexOf(b.name);

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    return {
      ...data,
      affiliation: sortedAffiliation,
      relation: sortedRelation,
      acquisition: sortedAcquisition,
    };
  }
  return null;
};

export const extractDataBase64 = (src: string): string | null => {
  if (src) {
    const base64Prefix = 'base64,';
    const base64Index = src.indexOf(base64Prefix);
    if (base64Index !== -1) return src.substring(base64Index + base64Prefix.length);
  }
  return null;
};

export function convertToNegative(input: string) {
  const number = parseInt(input.replace(/-/g, ''), 10);

  const sign = input.split('').filter((char) => char === '-').length % 2 === 0 ? 1 : -1;

  return number * sign;
}

export const keepLastObjectOccurrence = (inputObj: Object) => {
  const result: any = {};

  for (const [key, value] of Object.entries(inputObj)) {
    // Update the result to keep the current key (the last occurrence)
    result[value] = key;
  }

  const finalResult: any = {};
  for (const [value, key] of Object.entries(result) as any) {
    finalResult[key] = value;
  }

  return finalResult;
};

export const downloadFile = (data: BlobPart[], fileName: string, options?: BlobPropertyBag) => {
  try {
    const blob = new Blob(data, options);
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error converting file to blob:', error);
  }
};

export const isNumeric = (value: string) => !isNaN(value) && !isNaN(parseFloat(value));
