import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { RetrieveFavouriteProductRequestBody } from '@/types/design-favourite.type';
import { message } from 'antd';
import { request } from 'umi';

export async function retrieveFavouriteProduct(data: RetrieveFavouriteProductRequestBody) {
  return request<boolean>(`/api/favourite/retrieve`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.RETRIEVE_FAVOURITE_PRODUCT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.RETRIEVE_FAVOURITE_PRODUCT_ERROR);
      return false;
    });
}

export async function skipFavouriteProduct() {
  return request<boolean>(`/api/favourite/skip`, { method: 'POST' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.SKIP_FAVOURITE_PRODUCT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}
