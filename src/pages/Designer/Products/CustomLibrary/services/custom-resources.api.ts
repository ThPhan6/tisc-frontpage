import { message } from 'antd';
import { request } from 'umi';

import { DistributorProductMarket } from '@/features/distributors/type';

export async function getCustomDistributorByCompany(companyId: string) {
  return request<{ data: DistributorProductMarket[] }>(
    `/api/custom-resource/distributor/${companyId}`,
    { method: 'GET' },
  )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      message.error(err?.data?.message ?? 'Failed to get list distributors');
      return [] as DistributorProductMarket[];
    });
}
