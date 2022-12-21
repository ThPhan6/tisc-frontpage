import { InvoiceStatus } from './type';

import moment from 'moment';

export const checkShowBillingAmount = (data: any) => {
  if (
    data?.status === InvoiceStatus.Overdue ||
    (data?.status === InvoiceStatus.Paid &&
      moment(data.due_date).diff(moment(data.payment_date)) < 0)
  ) {
    return true;
  }
  return false;
};

export const formatToMoneyValue = (
  number: number,
  locale: Intl.LocalesArgument = 'en-us',
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
) => {
  return number.toLocaleString(locale, options);
};
