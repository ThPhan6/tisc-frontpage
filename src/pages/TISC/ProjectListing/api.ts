import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { ProjectListingDetail, ProjectListingResponse, ProjectListingSummary } from './type';
import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';

interface ProjectListingPaginationRespone {
  data: {
    projects: ProjectListingResponse[];
    pagination: PaginationResponse;
  };
}

export async function getProjectListingPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/project/listing`, { method: 'GET', params })
    .then((response: ProjectListingPaginationRespone) => {
      const { projects, pagination } = response.data;
      callback({
        data: projects,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_LISTING_FAILED);
    });
}

export async function getProjectListingSummary() {
  return request(`/api/project/get-summary-overall`, {
    method: 'GET',
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_LISTING_SUMMARY_ERROR);
      return {} as ProjectListingSummary;
    });
}

export async function getOneProjectListing(id: string) {
  return request<{ data: ProjectListingDetail }>(`/api/project/listing/${id}`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_PROJECT_LISTING_ERROR);
      return {} as ProjectListingDetail;
    });
}
