import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import type { Collection, CollectionAddPayload, CollectionRelationType } from '@/types';

export async function getCollections(relationId: string, relationType: CollectionRelationType) {
  return request<{ data: { collections: Collection[] } }>(`/api/collection/get-list`, {
    method: 'GET',
    params: {
      page: 1,
      pageSize: 99999999,
      relation_id: relationId,
      relation_type: relationType,
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

export async function createCollection(data: CollectionAddPayload) {
  return request<{ data: Collection }>(`/api/collection/create`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_BRAND_COLLECTION_SUCCESS);

      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_BRAND_COLLECTION_ERROR);
      return {} as Collection;
    });
}
export async function updateCollection(collectionId: string, name: string) {
  return request(`/api/collection/update/${collectionId}`, {
    method: 'PATCH',
    data: { name },
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_BRAND_COLLECTION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_BRAND_COLLECTION_ERROR);
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
