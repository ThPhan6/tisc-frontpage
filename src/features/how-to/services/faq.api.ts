import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { FaqItem } from '../types';

export const getCurrentFAQ = async () => {
  return request<{ data: FaqItem[] }>(`/api/documentation/howto/get-current`, {
    method: 'GET',
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_FAQ_ERROR);
      return [] as FaqItem[];
    });
};
