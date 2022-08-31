import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { setProductTip } from '../reducers';
import type { ProductTip } from '../types';
import store from '@/reducers';

export const getProductTipByProductID = async (productId: string) => {
  return request<{ data: ProductTip }>(`/api/product-tip/get-one/${productId}`, {
    method: 'GET',
  })
    .then((res) => {
      store.dispatch(setProductTip(res.data));
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PRODUCT_TIP_BY_PRODUCT_ID_ERROR,
      );
    });
};

export const createProductTip = async (data: ProductTip) => {
  return request(`/api/product-tip/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      // message.success(MESSAGE_NOTIFICATION.CREATE_PRODUCT_TIP_SUCCESS);
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PRODUCT_TIP_ERROR);
    });
};
