import { message } from 'antd';
import { request } from 'umi';

import { AutoStepLinkedOptionResponse } from '../types/autoStep';

export const getLinkedOptionByOptionIds = (optionId: string, exceptOptionIds?: string) => {
  // showPageLoading();

  return request<{ data: AutoStepLinkedOptionResponse[] }>(`/api/linkage/rest-options`, {
    method: 'GET',
    params: { option_ids: optionId, except_option_ids: exceptOptionIds || undefined },
  })
    .then((res) => {
      // hidePageLoading();
      return res.data.map((el) => ({
        ...el,
        subs: el.subs.map((item) => ({
          ...item,
          subs: item.subs.map((sub) => ({
            ...sub,
            sub_id: item.id,
            sub_name: item.name,
            pre_option: optionId,
            replicate: sub.replicate ?? 1,
          })),
        })),
      })) as AutoStepLinkedOptionResponse[];
    })
    .catch((err) => {
      // hidePageLoading();

      message.error(err?.data?.message ?? 'Failed to get rest options');
      return [] as AutoStepLinkedOptionResponse[];
    });
};
