import { message } from 'antd';
import { request } from 'umi';

import { AutoStepLinkedOptionResponse } from '../types/autoStep';

export const getLinkedOptionByOptionIds = (optionIds: string, exceptOptionIds?: string) => {
  // showPageLoading();

  return request<{ data: AutoStepLinkedOptionResponse[] }>(`/api/linkage/rest-options`, {
    method: 'GET',
    params: { option_ids: optionIds, except_option_ids: exceptOptionIds || undefined },
  })
    .then((res) => {
      // hidePageLoading();
      return res.data.map((el) => ({
        ...el,
        subs: el.subs.map((sub) => ({
          ...sub,
          subs: sub.subs.map((item) => ({ ...item, replicate: item.replicate ?? 1 })),
        })),
      })) as AutoStepLinkedOptionResponse[];
    })
    .catch((err) => {
      // hidePageLoading();

      message.error(err?.data?.message ?? 'Failed to get rest options');
      return [] as AutoStepLinkedOptionResponse[];
    });
};
