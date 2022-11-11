import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { CustomProductList } from '../types/custom-product.type';

export function getCustomProductList() {
  return request<{ products: CustomProductList }>('/api/custom-product/get-list', { method: 'GET' })
    .then((res) => res.products)
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_CUSTOM_PRODUCT_LIST_ERROR,
      );
    });
}
