import { message } from 'antd';
import { request } from 'umi';

import { GeneralData } from '@/types';

export async function getAllCustomResource(type: number) {
  return request<{ data: GeneralData[] }>(`/api/custom-resource/get-all`, {
    method: 'GET',
    params: { type: type },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      message.error(err?.data?.message ?? 'Failed to get list brand companies');
      return [] as GeneralData[];
    });
}
