import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { setProductCatelogue } from '../reducers';
import type { ProductCatelogue } from '../types';
import store from '@/reducers';

export const getProductCatelogueByProductID = async (productId: string) => {
  return request<{ data: ProductCatelogue }>(
    `/api/product-catelogue-download/get-one/${productId}`,
    {
      method: 'GET',
    },
  )
    .then((res) => {
      store.dispatch(setProductCatelogue(res.data));
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PRODUCT_CATELOGUE_BY_PRODUCT_ID_ERROR,
      );
    });
};

export const createProductCatelogue = async (data: ProductCatelogue) => {
  return request(`/api/product-catelogue-download/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      // message.success(MESSAGE_NOTIFICATION.CREATE_PRODUCT_CATELOGUE_SUCCESS);
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PRODUCT_CATELOGUE_ERROR);
    });
};
