import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

export async function updateBrandStatus(brandId: string, data: { status: number }) {
  return request<boolean>(`/api/brand/update-status/${brandId}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_BRAND_STATUS_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_BRAND_STATUS_ERROR);
      return false;
    });
}
