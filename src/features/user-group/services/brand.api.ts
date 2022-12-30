import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { getResponseMessage } from '@/helper/common';

import {
  BrandAlphabet,
  BrandAssignTeamForm,
  BrandCard,
  BrandDesignProfile,
  BrandDetail,
  BrandListItem,
  TISCUserGroupBrandForm,
} from '../types';
import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { KeyValueData } from '@/types';

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
export async function getTiscWorkspace() {
  return request<{ data: BrandCard[] }>(`/api/workspace`, {
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
  return request<{ data: BrandDesignProfile }>(`/api/brand/get-one/${brandId}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_DATA_ERROR);
      return {} as BrandDesignProfile;
    });
}

export async function getBrandSummary() {
  return request<{
    data: DataMenuSummaryProps[];
  }>(`/api/brand/summary`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_BRAND_SUMMARY_ERROR);
      return [] as DataMenuSummaryProps[];
    });
}

export async function getBrandStatuses() {
  return request<KeyValueData[]>(`/api/brand/statuses`, {
    method: 'GET',
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_STATUSES_ERROR);
      return [] as KeyValueData[];
    });
}

export async function getListAssignTeamByBrandId(brandId: string) {
  return request<{ data: BrandAssignTeamForm[] }>(
    `/api/team/get-list-group-team-profile/${brandId}`,
    {
      method: 'GET',
    },
  )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_ASSIGN_TEAM_ERROR);
      return [] as BrandAssignTeamForm[];
    });
}

export async function createAssignTeamByBrandId(brandId: string, data: string[]) {
  return request<boolean>(`/api/team/assign/${brandId}`, {
    method: 'POST',
    data: { user_ids: data },
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_LIST_ASSIGN_TEAM_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_LIST_ASSIGN_TEAM_ERROR);
      return false;
    });
}

export async function createBrand(data: TISCUserGroupBrandForm) {
  return request<{ data: BrandDetail }>(`/api/brand/create`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      message.success(getResponseMessage('create', 'brand', 'success'));
      return res.data;
    })
    .catch((error) => {
      message.error(getResponseMessage('create', 'brand', 'failed', error));
      return undefined;
    });
}
