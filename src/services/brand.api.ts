import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type {
  IBrandListItem,
  IBrandAlphabet,
  BrandDetail,
  IBrandCard,
  BrandStatuses,
} from '@/types';
import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { message } from 'antd';
import { request } from 'umi';
import { DataMenuSummaryProps } from '@/components/MenuSummary/types';

interface IBrandListResponse {
  brands: IBrandListItem[];
  pagination: PaginationResponse;
}

export async function getBrandPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse<IBrandListItem[]>) => void,
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
export async function getBrandCards() {
  return request<{ data: IBrandCard[] }>(`/api/brand/get-list-card`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_DATA_ERROR);
      return [] as IBrandCard[];
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
      return {} as BrandDetail;
    });
}

export async function getBrandSummary() {
  return request<{
    data: DataMenuSummaryProps[];
  }>(`/api/brand/summary`, {
    method: 'GET',
  })
    .then((response) => {
      console.log('data', response.data);

      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_BRAND_SUMMARY_ERROR);
      return [] as DataMenuSummaryProps[];
    });
}

export async function getBrandStatuses() {
  return request<BrandStatuses[]>(`/api/brand/statuses`, {
    method: 'GET',
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_STATUSES_ERROR);
      return [] as BrandStatuses[];
    });
}

export async function createBrand() {
  return request<{ data: BrandDetail }>(`/api/brand/create`, {
    method: 'POST',
  })
    .then(() => {
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_DATA_ERROR);
      return false;
    });
}
