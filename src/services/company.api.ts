import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { Company } from '@/components/Modal/CompanyModal';

export async function getCompanySummary() {
  return request<{ data: Company[] }>(`/api/partner/company-summary`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_COMPANY_SUMMARY_ERROR);
      return [] as Company[];
    });
}
