import { request } from 'umi';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { IAttributeListResponse, IAttributeContentType, IAttributeForm } from '@/types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';

interface ICategoryPaginationResponse {
  data: {
    attributes: IAttributeListResponse[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
  };
}
export async function getProductAttributePagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/attribute/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: ICategoryPaginationResponse) => {
      const { attributes, pagination, summary } = response.data;
      callback({
        data: attributes,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary,
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}

export async function getProductAttributeByType(type: number) {
  return request<ICategoryPaginationResponse>(`/api/attribute/get-list`, {
    method: 'GET',
    params: {
      page: 1,
      pageSize: 99999999,
      type,
    },
  })
    .then((response) => {
      return response.data.attributes;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ATTRRIBUTE_DATA_FAILED);
      return [] as IAttributeListResponse[];
    });
}

export async function getProductAttributeContentType() {
  return request<{ data: IAttributeContentType }>(`/api/attribute/content-type/get-list`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error.message);
    });
}

export async function createAttribute(data: IAttributeForm) {
  return request<boolean>(`/api/attribute/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_ATTRIBUTE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_ATTRIBUTE_ERROR);
      return false;
    });
}
export async function getOneAttribute(id: string) {
  return request<{ data: IAttributeForm }>(`/api/attribute/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_ATTRIBUTE_ERROR);
    });
}
export async function updateAttribute(id: string, data: IAttributeForm) {
  return request<boolean>(`/api/attribute/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_ATTRIBUTE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_ATTRIBUTE_ERROR);
      return false;
    });
}
export async function deleteAttribute(id: string) {
  return request<boolean>(`/api/attribute/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_ATTRIBUTE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_ATTRIBUTE_ERROR);
      return false;
    });
}
