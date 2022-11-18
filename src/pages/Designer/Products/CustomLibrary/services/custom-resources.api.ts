import { message } from 'antd';
import { request } from 'umi';

import { CustomResourceType } from '../types';
import { GeneralData } from '@/types';

export async function getAllCustomResource(type: CustomResourceType) {
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
