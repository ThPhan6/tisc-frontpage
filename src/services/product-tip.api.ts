import { request } from 'umi';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { IProductTip } from '@/types';
import { setProductTip } from '@/reducers/product';
import store from '@/reducers';

export const getProductTipByProductID = async (productId: string) => {
  return request<{ data: IProductTip }>(`/api/product-tip/get-one/${productId}`, {
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

export const createProductTip = async (data: IProductTip) => {
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
