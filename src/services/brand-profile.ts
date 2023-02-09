import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

export async function updateBrandStatus(brandId: string, data: { status: number }) {
  showPageLoading();
  return request<boolean>(`/api/brand/update-status/${brandId}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_BRAND_STATUS_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_BRAND_STATUS_ERROR);
      hidePageLoading();
      return false;
    });
}
