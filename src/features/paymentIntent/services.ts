import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { PaymentIntentResponse } from './types';

import { hidePageLoading, showPageLoading } from '../loading/loading';

export async function createPaymentIntent(billId: string) {
  showPageLoading();

  return request<{ data: PaymentIntentResponse }>(`/api/invoice/${billId}/intent`, {
    method: 'POST',
  })
    .then((repsonse) => {
      hidePageLoading();

      return repsonse.data;
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PAYMENT_INTENT_ERROR);
      return {} as PaymentIntentResponse;
    });
}

export async function updatePaidStatusTemprorarily(billId: string) {
  showPageLoading();

  return request<boolean>(`/api/invoice/${billId}/paid-temporarily`, {
    method: 'PUT',
  })
    .then((repsonse) => {
      hidePageLoading();

      console.log('repsonse', repsonse);

      return true;
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_PAID_TEMPRORARILY_ERROR);
      return false;
    });
}
