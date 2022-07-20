import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { AllFaq, FaqItem } from '@/types/faq.type';
import { message } from 'antd';
import { request } from 'umi';

export const getAllFAQ = async () => {
  return request<{ data: AllFaq }>(`/api/documentation/howto/get-all`, {
    method: 'GET',
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_FAQ_ERROR);
      return {} as AllFaq;
    });
};

export const updateFAQ = async (data: FaqItem[]) => {
  return request<{ data: FaqItem[] }>(`/api/documentation/howto/update`, {
    method: 'PUT',
    data: { data },
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_FAQ_ERROR);
      return [] as FaqItem[];
    });
};

export const getFAQCurrent = async () => {
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
