import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { FaqPanel } from '@/pages/TISC/Adminstration/Documentation/HowTo/types';
import type { IFAQ } from '@/types/faq.type';
import { message } from 'antd';
import { request } from 'umi';

export const getFAQ = async (type: number) => {
  return request<{ data: { documentations: IFAQ[] } }>(`/api/documentation/get-list`, {
    method: 'GET',
    params: { type },
  })
    .then((res) => {
      return res.data.documentations;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_FAQ_ERROR);
      return [] as IFAQ[];
    });
};

export const updateFAQ = async (data: FaqPanel[]) => {
  console.log(data, '[data]');
  return request<{ data: FaqPanel[] }>(`/api/documentation/update`, {
    method: 'PUT',
    data,
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_FAQ_ERROR);
      return [] as FaqPanel[];
    });
};
