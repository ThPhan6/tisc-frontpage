import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { FavouriteProductSummary, FavouriteRetrieve } from './types';
import { setProductList } from '@/features/product/reducers';
import {
  BrandSummary,
  GetListProductForDesignerRequestParams,
  GroupProductList,
} from '@/features/product/types';
import store from '@/reducers';

import { hidePageLoading, showPageLoading } from '../loading/loading';

export async function getFavouriteProductList(params: GetListProductForDesignerRequestParams) {
  showPageLoading();
  return await request<{ data: GroupProductList[]; brand_summary?: BrandSummary }>(
    `/api/favourite/product-list`,
    {
      method: 'GET',
      params: {
        ...params,
        page: 1,
        pageSize: 99999,
      },
    },
  )
    .then(({ data, brand_summary }) => {
      store.dispatch(setProductList({ data, brandSummary: brand_summary }));
      hidePageLoading();
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_FAVOURITE_PRODUCT_SUMMARY_ERROR,
      );
      hidePageLoading();
      return [] as GroupProductList[];
    });
}

export async function getFavouriteProductSummary() {
  return request<{ data: FavouriteProductSummary }>(`/api/favourite/product-summary`, {
    method: 'GET',
  })
    .then((res) => res.data)
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_FAVOURITE_PRODUCT_SUMMARY_ERROR,
      );
      return {} as FavouriteProductSummary;
    });
}

export async function retrieveFavouriteProduct(data: FavouriteRetrieve) {
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
      message.success(MESSAGE_NOTIFICATION.SKIP_FAVOURITE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.SKIP_FAVOURITE_ERROR);
      return false;
    });
}
