import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import type { ProjectSpaceListProps, ProjectSpaceZone } from '../types';
import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';

import { hidePageLoading } from '@/features/loading/loading';

interface ProjectSpacePaginationResponse {
  data: {
    project_zones: ProjectSpaceListProps[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}

export async function getProjectSpaceListPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/project-zone/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: ProjectSpacePaginationResponse) => {
      const { project_zones, summary } = response.data;
      callback({
        data: project_zones,
        pagination: {
          current: params.page,
          pageSize: params.pageSize,
          total: 0,
        },
        summary: summary,
      });
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_SPACE_DATA_FAILED);
    });
}

export async function createProjectSpace(data: ProjectSpaceZone) {
  return request(`/api/project-zone/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_PROJECT_SPACE_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PROJECT_SPACE_FAILED);
      hidePageLoading();
      return false;
    });
}
export async function updateProjectSpace(id: string, data: ProjectSpaceZone) {
  return request<{ data: ProjectSpaceZone }>(`/api/project-zone/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then((res) => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_PROJECT_SPACE_SUCCESS);
      hidePageLoading();
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_PROJECT_SPACE_FAILED);
      hidePageLoading();
    });
}

export async function deleteProjectSpace(id: string) {
  return request(`/api/project-zone/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_PROJECT_SPACE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_PROJECT_SPACE_FAILED);
      return false;
    });
}
