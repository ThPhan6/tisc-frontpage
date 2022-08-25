import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { Faq } from './type';

export const getFAQCurrent = async () => {
  return request<{ data: Faq[] }>(`/api/documentation/howto/get-current`, {
    method: 'GET',
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_FAQ_ERROR);
      return [] as Faq[];
    });
};
