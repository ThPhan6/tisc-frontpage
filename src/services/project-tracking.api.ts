import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { ProjectTrackingPriority } from '@/pages/Brand/ProjectTracking/constant';
import { message } from 'antd';
import { request } from 'umi';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { ProjecTrackingList } from '@/types/project-tracking.type';

interface ProjectTrackingPaginationRespone {
  data: {
    projectTrackings: ProjecTrackingList[];
    pagination: PaginationResponse;
  };
}
export async function getProjectTrackingPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/project-tracking/request/get-list`, { method: 'GET', params })
    .then((response: ProjectTrackingPaginationRespone) => {
      const { projectTrackings, pagination } = response.data;
      callback({
        data: projectTrackings,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_TRACKING_LIST_FAILED);
    });
}

export async function updateProjectTrackingPriority(
  id: string,
  data: { priority?: ProjectTrackingPriority; assigned_teams?: string[]; read_by?: string[] },
) {
  return request(`/api/project-tracking/${id}/update`, { method: 'PATCH', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_PROJECT_TRACKING_INFO_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(
        error?.data?.message || MESSAGE_NOTIFICATION.UPDATE_PROJECT_TRACKING_INFO_ERROR,
      );
      return false;
    });
}

export async function getProjectTrackingSummary() {
  return request<{ data: DataMenuSummaryProps[] }>(`/api/project-tracking/summary`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_TRACKING_SUMMARY_ERROR,
      );
      return [] as DataMenuSummaryProps[];
    });
}
