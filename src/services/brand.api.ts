import { request } from 'umi';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { IBrandListItem, IBrandAlphabet, IBrandDetail } from '@/types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
} from '@/components/Table/types';

interface IBrandListResponse {
  brands: IBrandListItem;
  pagination: IPaginationResponse;
}

export async function getBrandPagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/brand/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: { data: IBrandListResponse }) => {
      const { brands, pagination } = response.data;
      callback({
        data: brands,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}

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

export async function getBrandById(brandId: string) {
  return request<{ data: IBrandDetail }>(`/api/brand/get-one/${brandId}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_DATA_ERROR);
      return undefined;
    });
}
