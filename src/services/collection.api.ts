import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import type { Collection } from '@/types';

// import { setProductSummary } from '@/reducers/product';
// import store from '@/reducers';

export async function getCollectionByBrandId(brandId: string) {
  return request<{ data: { collections: Collection[] } }>(`/api/collection/get-list`, {
    method: 'GET',
    params: {
      page: 1,
      pageSize: 99999999,
      brand_id: brandId,
    },
  })
    .then((response) => {
      return response.data.collections;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_COLLECTION_ERROR);
      return [] as Collection[];
    });
}

export async function createCollection(data: { name: string; brand_id: string }) {
  return request(`/api/collection/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_BRAND_COLLECTION_ERROR);
      return false;
    });
}
export async function deleteCollection(id: string) {
  return request(`/api/collection/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_BRAND_COLLECTION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_BRAND_COLLECTION_ERROR);
      return false;
    });
}
