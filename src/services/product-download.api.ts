import { request } from 'umi';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { ProductDownload } from '@/types';
import { setProductDownload } from '@/reducers/product';
import store from '@/reducers';

export const getProductDownloadByProductID = async (productId: string) => {
  return request<{ data: ProductDownload }>(
    `/api/product-catelogue-download/get-one/${productId}`,
    {
      method: 'GET',
    },
  )
    .then((res) => {
      store.dispatch(setProductDownload(res.data));
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PRODUCT_DOWNLOAD_BY_PRODUCT_ID_ERROR,
      );
    });
};

export const createProductDownload = async (data: ProductDownload) => {
  return request(`/api/product-catelogue-download/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      // message.success(MESSAGE_NOTIFICATION.CREATE_PRODUCT_DOWNLOAD_SUCCESS);
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PRODUCT_DOWNLOAD_ERROR);
    });
};
