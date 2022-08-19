import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { setProductList } from '@/features/product/reducers';
import {
  BrandSummary,
  FavouriteProductList,
  GetListProductForDesignerRequestParams,
} from '@/features/product/types';
import store from '@/reducers';
import { FavouriteProductSummary } from '@/types';
import { message } from 'antd';
import { request } from 'umi';

export async function getFavouriteProductList(params: GetListProductForDesignerRequestParams) {
  return request<{ data: FavouriteProductList[]; brand_summary?: BrandSummary }>(
    `/api/favourite/product-list`,
    {
      method: 'GET',
      params,
    },
  )
    .then(({ data, brand_summary }) => {
      store.dispatch(setProductList({ data, brandSummary: brand_summary }));
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_FAVOURITE_PRODUCT_SUMMARY_ERROR,
      );
      return [] as FavouriteProductList[];
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

export async function createFavouriteRetrieve() {
  return request<boolean>(`/api/favourite/retrieve`, {
    method: 'POST',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_FAVOURITE_RETRIEVE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_FAVOURITE_RETRIEVE_ERROR);
      return false;
    });
}

export async function skipFavouriteRetrieve() {
  return request<boolean>(`/api/favourite/skip`, {
    method: 'POST',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.SKIP_FAVOURITE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.SKIP_FAVOURITE_ERROR);
      return false;
    });
}
