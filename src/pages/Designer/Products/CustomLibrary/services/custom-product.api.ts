import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import {
  CustomProductDetailProps,
  CustomProductFilter,
  CustomProductList,
} from '../types/custom-product.type';
import store from '@/reducers';

import { CustomProductRequestBody } from '../ProductLibraryDetail';
import { setCustomProductList } from '../slice';

export function getCustomProductList(params?: CustomProductFilter) {
  request<{ data: { products: CustomProductList[] } }>('/api/custom-product/get-list', {
    method: 'GET',
    params: { company_id: params?.company_id, collection_id: params?.collection_id },
  })
    .then((res) => {
      store.dispatch(setCustomProductList(res.data.products));
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_CUSTOM_PRODUCT_LIST_ERROR,
      );
    });
}

export function getOneCustomProduct(id: string) {
  request<{ data: { products: CustomProductList[] } }>(`/api/custom-product/get-one/${id}`, {
    method: 'GET',
  })
    .then((res) => {
      store.dispatch(setCustomProductList(res.data.products));
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_CUSTOM_PRODUCT_LIST_ERROR);
    });
}

export function createCustomProduct(data: CustomProductRequestBody) {
  return request<{ data: CustomProductDetailProps }>(`/api/custom-product/create`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_CUSTOM_PRODUCT_SUCCESS);
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_CUSTOM_PRODUCT_ERROR);
    });
}

export function updateCustomProduct(id: string, data: CustomProductRequestBody) {
  return request<boolean>(`/api/custom-product/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_CUSTOM_PRODUCT_ERROR);
      return false;
    });
}

export function deleteCustomProduct(id: string) {
  return request<boolean>(`/api/custom-product/delete/${id}`, {
    method: 'DELELTE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_CUSTOM_PRODUCT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_CUSTOM_PRODUCT_ERROR);
      return false;
    });
}

export function duplicateCustomProduct(id: string) {
  return request<boolean>(`/api/custom-product/duplicate/${id}`, {
    method: 'POST',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DUPLICATE_CUSTOM_PRODUCT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DUPLICATE_CUSTOM_PRODUCT_ERROR);
      return false;
    });
}
