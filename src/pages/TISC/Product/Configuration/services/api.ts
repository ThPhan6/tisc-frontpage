import { request } from 'umi';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { IBrandAlphabet, IProductSummary } from '../types';
import { setProductSummary } from '@/reducers/product';
import store from '@/reducers';

export async function getBrandAlphabet() {
  return request<{ data: IBrandAlphabet }>(`/api/brand/get-all-alphabet`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_DATA_ERROR);
      return {} as IBrandAlphabet;
    });
}

export async function getProductSummary(brandId: string) {
  return request<{ data: IProductSummary }>(`/api/product/brand-product-summary/${brandId}`, {
    method: 'GET',
  })
    .then((response) => {
      store.dispatch(setProductSummary(response.data));
    })
    .catch((error) => {
      store.dispatch(setProductSummary());
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_SUMMARY_DATA_ERROR);
    });
}
