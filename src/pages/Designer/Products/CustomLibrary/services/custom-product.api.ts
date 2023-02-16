import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import {
  CustomProductDetailResponse,
  CustomProductFilter,
  CustomProductList,
  CustomProductRequestBody,
} from '../types/custom-product.type';
import store from '@/reducers';

import { setCustomProductDetail, setCustomProductList } from '../slice';
import { hidePageLoading, showPageLoading } from './../../../../../features/loading/loading';

export function getCustomProductList(params?: CustomProductFilter) {
  request<{ data: { products: CustomProductList[] } }>('/api/custom-product/get-list', {
    method: 'GET',
    params: params,
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
  request<{ data: CustomProductDetailResponse }>(`/api/custom-product/get-one/${id}`, {
    method: 'GET',
  })
    .then((res) => {
      store.dispatch(
        setCustomProductDetail({
          id: res.data.id,
          name: res.data.name,
          description: res.data.description,
          images: res.data.images,
          dimension_and_weight: res.data.dimension_and_weight,
          attributes: res.data.attributes,
          specifications: res.data.specifications.map((el) => ({ ...el, type: 'specification' })),
          options: res.data.options.map((el) => ({ ...el, type: 'option' })),
          collection: {
            id: res.data.collection_id,
            name: res.data.collection_name,
          },
          company: {
            id: res.data.company_id,
            name: res.data.company_name,
          },
          specification: {
            is_refer_document: res.data.specification.is_refer_document,
            attribute_groups: res.data.specification.attribute_groups?.map((el) => ({
              ...el,
              isChecked: true,
            })),
          },
        }),
      );
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_CUSTOM_PRODUCT_LIST_ERROR);
    });
}

export async function createCustomProduct(data: CustomProductRequestBody) {
  showPageLoading();
  return request<{ data: CustomProductDetailResponse }>(`/api/custom-product/create`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      hidePageLoading();
      message.success(MESSAGE_NOTIFICATION.CREATE_CUSTOM_PRODUCT_SUCCESS);
      return res.data;
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_CUSTOM_PRODUCT_ERROR);
    });
}

export async function updateCustomProduct(id: string, data: CustomProductRequestBody) {
  showPageLoading();
  return request<boolean>(`/api/custom-product/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      hidePageLoading();
      message.success(MESSAGE_NOTIFICATION.UPDATE_CUSTOM_PRODUCT_SUCCESS);
      return true;
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_CUSTOM_PRODUCT_ERROR);
      return false;
    });
}

export async function deleteCustomProduct(id: string) {
  return request<boolean>(`/api/custom-product/delete/${id}`, {
    method: 'DELETE',
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

export async function duplicateCustomProduct(id: string) {
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
