import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { BrandListItem, BrandAlphabet, BrandDetail, BrandCard } from '@/types';
import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { message } from 'antd';
import { request } from 'umi';

interface BrandListResponse {
  brands: BrandListItem[];
  pagination: PaginationResponse;
}

export async function getBrandPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse<BrandListItem[]>) => void,
) {
  request(`/api/brand/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: { data: BrandListResponse }) => {
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
  return request<{ data: BrandAlphabet }>(`/api/brand/get-all-alphabet`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_DATA_ERROR);
      return {} as BrandAlphabet;
    });
}
export async function getBrandCards() {
  return request<{ data: BrandCard[] }>(`/api/brand/get-list-card`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_DATA_ERROR);
      return [] as BrandCard[];
    });
}

export async function getBrandById(brandId: string) {
  return request<{ data: BrandDetail }>(`/api/brand/get-one/${brandId}`, {
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
