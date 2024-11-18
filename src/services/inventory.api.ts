import { message } from 'antd';
import { request } from 'umi';

import { ExportRequest } from '@/features/Import/types/export.type';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

export const importInventoryCSV = () => {};

export const exportInventoryCSV = async (data: ExportRequest) => {
  showPageLoading();
  return request<{ data: any }>(`/api/inventory/export`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      message.success('Export CSV successfully');
      hidePageLoading();
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? 'Export CSV failed');
      hidePageLoading();

      return {};
    });
};
